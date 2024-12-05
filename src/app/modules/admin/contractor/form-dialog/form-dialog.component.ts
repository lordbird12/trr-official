import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NewsService } from '../service/news.service';

@Component({
    selector: 'app-form-dialog-news',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent implements OnInit {

    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    permissiondata: any[];
    contractorType: any[] = [];
    factory: any[] = [
    ];
    status: any[] = [

        {
            code: 'Yes',
            name: 'เปิดใช้งาน',
        },
        {
            code: 'No',
            name: 'ปิดใช้งาน',
        },

    ];


    constructor(
        private dialogRef: MatDialogRef<FormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: NewsService
    ) {
        this._service.getFeature().subscribe((resp: any) => {
            this.contractorType = resp;
        })
        this._service.get_factory().subscribe((resp: any) => {
            this.factory = resp;
        })
        this.addForm = this.formBuilder.group({
            id: '',
            name: ['', Validators.required],
            phone: ['', Validators.required],
            detail: ['', Validators.required],
            status: ['Yes'],
            image: '',
            features: this.formBuilder.array([]),
            factories: this.formBuilder.array([]),

        });
    }

    ngOnInit(): void {

        if (this.data) {
            this.addForm.patchValue({
                ...this.data,
                image: '',
            })
            console.log(this.data, 'data');

            this.data.feature_contractors.forEach((data: any) => {
                const features = this.addForm.get('features') as FormArray;
                const a = this.formBuilder.group({
                    feature_id: data.feature_id
                });
                features.push(a);
            })
            this.data.facetories_contractors.forEach((data: any) => {
                const factories = this.addForm.get('factories') as FormArray;
                const a = this.formBuilder.group({
                    factorie_id: data.factorie_id
                });
                factories.push(a);
            })
            console.log('data', this.addForm.value);

            this._changeDetectorRef.detectChanges();

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

    Submit(): void {

        const confirmation = this._fuseConfirmationService.open({
            title: 'บันทึกข้อมูล',
            message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ตกลง',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            if (result === 'confirmed') {
                let formValue = this.addForm.value

                if (!this.data) {


                    this._service.Savedata(formValue).subscribe({
                        next: (resp: any) => {
                            this.onCancelClick();
                        },

                        error: (err: any) => {
                            console.log(err);
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'ไม่สามารถบันทึกข้อมูลได้',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ตกลง',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'ยกเลิก',
                                    },
                                },
                                dismissible: true,
                            });
                        },
                    });
                } else {
                    this._service.update(formValue, this.data.id).subscribe({
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
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ตกลง',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'ยกเลิก',
                                    },
                                },
                                dismissible: true,
                            });
                        },
                    });
                }
            }
        });

    }

    onPhoneInput(event: any): void {
        const input = event.target;
        input.value = input.value.replace(/[^0-9]/g, ''); // กรองเฉพาะตัวเลข
    }


    addFeature(featureId: number) {
        const features = this.addForm.get('features') as FormArray;

        // ตรวจสอบว่า featureId มีอยู่ใน FormArray หรือไม่
        const index = features.value.findIndex((value: any) => value.feature_id === featureId);
        console.log(index)
        if (index === -1) {
            const value = this.formBuilder.group({
                feature_id: featureId,
            });
            features.push(value);
        } else {
            // ถ้ามีอยู่แล้วให้ลบออก
            features.removeAt(index);
        }
    }

    // ฟังก์ชันสำหรับการเพิ่ม factory จาก checkbox
    addFactory(factoryId: number) {
        const factories = this.addForm.get('factories') as FormArray;

        // ตรวจสอบว่า factoryId มีอยู่ใน FormArray หรือไม่
        const index = factories.value.findIndex((value: any) => value.factorie_id === factoryId);

        if (index === -1) {
            const value = this.formBuilder.group({
                factorie_id: factoryId,
            });
            factories.push(value);
        } else {
            // ถ้ามีอยู่แล้วให้ลบออก
            factories.removeAt(index);
        }
    }

    isFactoryChecked(factorie_id: number): boolean {
        const factoriesFormArray = this.addForm.get('factories') as FormArray;
        return factoriesFormArray.value.some((value: any) => value.factorie_id === factorie_id);
    }

    isFeatureChecked(featureId: number): boolean {
        const features = this.addForm.get('features') as FormArray;
        return features.value.some((value: any) => value.feature_id === featureId);
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);
        const file = this.files[0];
        // this.addForm.patchValue({
        //     image: file,
        // });
        let data = {
            image: file,
            path: 'images/contractor/'
        }

        this.uploadImage(data)

    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }

    uploadImage(data: any) {
        const formData = new FormData();
        Object.entries(data).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        this._service.image(formData).subscribe((resp: any) => {
            this.addForm.patchValue({
                image: resp
            })
        })
    }
}

