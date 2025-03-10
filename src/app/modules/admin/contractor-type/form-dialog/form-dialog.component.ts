import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { VendorService } from '../service/vendor.service';

@Component({
    selector: 'app-form-dialog-vendor',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    permissiondata: any[];
    constructor(
        private dialogRef: MatDialogRef<FormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: VendorService
    ) {
        this.addForm = this.formBuilder.group({
            id: '',
            image: '',
            name: ['', Validators.required],
            tax_id: ['', Validators.required],
            address: ['', Validators.required],
            email: ['', Validators.required, Validators.email],
            email2: ['', Validators.email],
            tel: ['', Validators.required],
            tel_remark: '',
            tel2: '',
            line_id: ['', Validators.required],
            note_contact: '',
            contact_name: ['', Validators.required],
            contact_tel: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        // สร้าง Reactive Form

        this._service.getPermission().subscribe((res: any) => {
            this.permissiondata = res;
            console.log(this.permissiondata);
        });

        if (this.data) {
            this.addForm.patchValue({
                ...this.data,
                image: ''
            })
            console.log(this.addForm.value);
            
        } else {
            console.log('new');
            
        } 

    }

    onSaveClick(): void {
        if (this.addForm.valid) {
            const updatedData = this.addForm.value;
            this.dialogRef.close(updatedData);
            // แสดง SweetAlert2 ข้อความ "complete"
        }

        // แสดง Snackbar ข้อความ "complete"
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
    selectedFile: File = null;
    onFileChange(event) {
        this.selectedFile = (event.target as HTMLInputElement).files[0];

        // if (this.selectedFile) {
        //     // ปรับให้เก็บข้อมูลที่คุณต้องการ ในที่นี้เป็นชื่อไฟล์
        //     this.addForm.patchValue({ image: this.selectedFile.name });
        //   }
        // this.addForm.get('image').updateValueAndValidity();
    }

    Submit(): void {
        console.log(this.addForm.value);
        // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
        // console.log(end)
        // this.addForm.patchValue({
        //   register_date:end
        // })
        const confirmation = this._fuseConfirmationService.open({
            title: 'บันทึกข้อมูล',
            message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Confirm',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                const formData = new FormData();
                Object.entries(this.addForm.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                        if (key === 'image') {
                            formData.append(key, this.selectedFile);
                        }
                    }
                );
                if(this.data) {
                    this._service.update(this.data.id, formData).subscribe({
                        next: (resp: any) => {
                            this.onCancelClick();
                        },
                        error: (err: any) => {
                            console.log(err);
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'เกิดข้อผิดพลาด',
                                message: err.error.message,
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
                            console.log(err.error.message);
                        },
                    });
                } else {
                    this._service.Savedata(formData).subscribe({
                        next: (resp: any) => {
                            this.onCancelClick();
                        },
                        error: (err: any) => {
                            console.log(err);
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'เกิดข้อผิดพลาด',
                                message: err.error.message,
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
                            console.log(err.error.message);
                        },
                    });
                }
               
            }
        });
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);
        const file = this.files[0];
        this.addForm.patchValue({
            image: file,
        });
    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }
}
