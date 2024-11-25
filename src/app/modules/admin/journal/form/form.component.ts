import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { JournalService } from '../service/journal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-form-journal',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    isLoading: boolean = false;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    permissiondata: any[];
    Id: any;
    item: any;
    editorContent = '';
    uploadedImages: any;
    uploadedFile: any;
    srcResult: any;
    defaultImages: string[] = ['https://logowik.com/content/uploads/images/adobe-pdf3324.jpg'];

    is_use: any[] = [
        { name: 'Active', value: '1' },
        { name: 'Inactive', value: '0' },
    ];


    constructor(
        private _router: Router,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: JournalService,
        public activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.Id = params.id;
        });
        this.addForm = this.formBuilder.group({
            id:'',
            no: '',
            title: '',
            detail: '',
            file: '',
            image: '',
            notify_status: '',
            is_use: '',
        });
    }

    ngOnInit(): void {
        // สร้าง Reactive Form
        if (this.Id) {
            this.activatedRoute.params.subscribe((params) => {
                // console.log(params);
                const id = params.id;
                this._service.getById(id).subscribe((resp: any) => {
                    this.item = resp;
                    this.addForm.patchValue({
                        ...this.item,
                    });

                    this.addForm.patchValue({
                        image: '',
                    });

                    this.addForm.patchValue({
                        file: '',
                    });
                    // console.log(this.item.image);
                    // this.files.push(this.item.image);
                    if (this.item.image) this.uploadedImages = this.item.image;

                    if (this.item.file) this.uploadedFile = this.item.file;
                });
            });
        } else {
            this.addForm.patchValue({
                id:'',
                no: '',
                title: '',
                detail: '',
                image: '',
                file: '',
                notify_status: '1',
            });
        }
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
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มข้อมูล',
            message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
            icon: { show: false, name: 'heroicons_outline:exclamation', color: 'warning' },
            actions: {
                confirm:
                { show: true,
                    label: 'ตกลง',
                    color: 'primary' },
                cancel: { show: true, label: 'ยกเลิก' },
            },
            dismissible: true,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const formData = new FormData();
                Object.entries(this.addForm.value).forEach(([key, value]: any[]) => {
                    formData.append(key, value);
                });

                // ตรวจสอบขนาดไฟล์ก่อนการส่งข้อมูล
                if (this.files2.length > 0 && this.files2[0].size > 20 * 1024 * 1024) {
                    this._fuseConfirmationService.open({
                        title: 'ขนาดไฟล์เกินขีดจำกัด',
                        message: 'ขนาดไฟล์สูงสุดคือ 5MB',
                        icon: { show: true, name: 'heroicons_outline:exclamation', color: 'warning' },
                        actions: { confirm: { show: true, label: 'ตกลง', color: 'primary' }, cancel: { show: false } },
                        dismissible: true,
                    });
                    return;  // ไม่ทำการส่งฟอร์มหากไฟล์เกินขนาด
                }


                if (!this.Id) {
                    this._service.create(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigateByUrl('admin/journal/list');
                        },
                        error: (err: any) => {
                            this.addForm.enable();
                            if (!this.addForm.value.file) {
                                alert('กรุณาเลือกไฟล์ก่อนส่ง');
                                return;
                            }

                            this._fuseConfirmationService.open({
                                title: 'ไม่สามารถบันทึกข้อมูลได้',
                                message: err.error.message,
                                icon: { show: true, name: 'heroicons_outline:exclamation', color: 'warning' },
                                actions: { confirm: { show: false, label: 'ตกลง', color: 'primary' }, cancel: { show: false } },
                                dismissible: true,
                            });
                        },
                    });
                } else {
                    this._service.update(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigateByUrl('admin/journal/list');
                        },
                        error: (err: any) => {
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'เกิดข้อผิดพลาด',
                                message: err.error.message,
                                icon: { show: true, name: 'heroicons_outline:exclamation', color: 'warning' },
                                actions: { confirm: { show: false, label: 'ตกลง', color: 'primary' }, cancel: { show: false } },
                                dismissible: true,
                            });
                        },
                    });
                }
            }
        });
    }


    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files = [];

        // เพิ่มรูปใหม่
        const newFiles = event.addedFiles;
        this.files.push(...newFiles);
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

    files2: File[] = [];
    onSelect2(event: { addedFiles: File[] }): void {
        this.files2 = [];

        // เพิ่มรูปใหม่
        const newFiles = event.addedFiles;
        this.files2.push(...newFiles);
        const file = this.files2[0];
        this.addForm.patchValue({
            file: file,
        });
        this.uploadedFile = true;
    }

    onRemove2(file: File): void {
        const index = this.files2.indexOf(file);
        if (index >= 0) {
            this.files2.splice(index, 1);
        }
        this.uploadedFile = false;
    }

    backTo() {
        this._router.navigate(['admin/journal/list']);
    }
}
