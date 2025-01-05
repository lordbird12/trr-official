import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';


@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    otpArray = Array(6).fill(0); // Create 6 slots for OTP fields

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService

    ) {
        this.signInForm = this.fb.group({});
        this.initializeOtpForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        // this.signInForm = this._formBuilder.group({
        //     otp: ['', [Validators.required, Validators.maxLength(6)]],
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value).subscribe(
            () => {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }

    email() {
        console.log(this.signInForm.get('email').value);
    }

    initializeOtpForm(): void {
        // Dynamically add controls for each OTP field
        this.otpArray.forEach((_, index) => {
            this.signInForm.addControl('otp' + index, new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]'), // Only numeric values
            ]));
        });
    }

    moveFocus(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;

        if (input.value.length === 1 && index < this.otpArray.length - 1) {
            const nextInput = document.querySelector(`input[formControlName='otp${index + 1}']`) as HTMLInputElement;
            nextInput?.focus();
        } else if (event.key === 'Backspace' && index > 0 && input.value.length === 0) {
            const previousInput = document.querySelector(`input[formControlName='otp${index - 1}']`) as HTMLInputElement;
            previousInput?.focus();
        }
    }

    verifyOtp(): void {
        if (this.signInForm.valid) {
            const otp = this.otpArray.map((_, index) => this.signInForm.get('otp' + index)?.value).join('');
            console.log('Entered OTP:', otp);
            const getotp = JSON.parse(localStorage.getItem('otp'));

            this._authService.confirmOtp({ otp_code: otp, token_otp: getotp.token }).subscribe({
                next: (resp: any) => {
                    this._fuseConfirmationService.open({
                        title: 'ดำเนินการสำเร็จ',
                        message: resp.message,
                        icon: {
                            show: true,
                            name: 'heroicons_outline:check-circle',
                            color: 'primary',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'Confirm',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                                label: 'Cancel',
                            },
                        },
                        dismissible: true,
                    });3
                    this._router.navigate(['reset-password']);
                },
                error: (err: any) => {
                    this._fuseConfirmationService.open({
                        title: 'เกิดข้อผิดพลาด',
                        message: "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่",
                        icon: {
                            show: true,
                            name: 'heroicons_outline:exclamation-triangle',
                            color: 'warning',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'Confirm',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                                label: 'Cancel',
                            },
                        },
                        dismissible: true,
                    });
                    return;
                },
            });
        } else {
            console.log('OTP form is invalid');
        }
    }

}
