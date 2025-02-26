import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfignotiService } from './setting.service';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],
    providers: [DatePipe],
})
export class SettingComponent implements OnInit {
    isLoading: boolean = false;
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    permissiondata: any[];
    item: any;
    selectTitle: any;
    factory: any[] = [
    ];
    imageUrls: string[] = [];
    datenoti: string[] = [];
    config = {
        placeholder: '',
        tabsize: 2,
        height: '200px',
        uploadImagePath: '/api/upload',
        toolbar: [
            ['misc', ['codeview', 'undo', 'redo']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontname', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph', 'height']],
            ['insert'],
        ],
        fontNames: [
            'Helvetica',
            'Arial',
            'Arial Black',
            'Comic Sans MS',
            'Courier New',
            'Roboto',
            'Times',
        ],
    };
    constructor(
        private _router: Router,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: ConfignotiService,
        public activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private datePipe: DatePipe,
        private cdr: ChangeDetectorRef,
    ) {
        this.addForm = this.formBuilder.group({
            title: ['', Validators.required],
            body: ['', Validators.required],
            date: this.formBuilder.array([]),
            factories: this.formBuilder.array([]),
        });

        this._service.get_factory().subscribe((resp: any) => {
            this.factory = resp;
        })
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            // console.log(params);
            const id = params.id;

        });
        // สร้าง Reactive Form
    }
    get date() {
        return this.addForm.get("date") as FormArray;
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
    onSelectNoti(event: any) {
        this.selectTitle = event;
        this._service.getDate(event).subscribe((resp: any) => {
            this.datenoti = resp

        })
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

    addDate(data?: any) {
        const d = this.formBuilder.group({
            day: '',
            time: this.formBuilder.array([]),
        });

        if (data) {
            d.patchValue({
                ...data,
            });
        }

        this.date.push(d);
    }
    addTime(data?: any) {
        const formvalueday = data.get("time") as FormArray;
        const t = this.formBuilder.group({
            hour: '',
        });

        if (data) {
            t.patchValue({
                ...data,
            });
        }
        formvalueday.push(t);
    }
    delete(date: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Remove',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.delete({ title: this.selectTitle, date: date }).subscribe((resp) => {
                    this.refreshTable();
                });
            }
            error: (err: any) => { };
        });
    }
    deletesub(itemid: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลแจ้งเตือนย่อยใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Remove',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.deletesub(itemid).subscribe((resp) => {
                    this.refreshTable();
                });
            }
            error: (err: any) => { };
        });
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
    removeDate(index: number) {
        this.date.removeAt(index);
    }
    removeTime(form: FormGroup, index: number) {
        console.log(form, index)
        const f = form.get("time") as FormArray;

        f.removeAt(index);
    }
    Submit(): void {
        // ตรวจสอบว่า form ถูกต้องหรือไม่
        if (this.addForm.invalid) {
            // แสดงข้อความผิดพลาดสำหรับฟิลด์ที่ไม่ถูกต้อง
            let errorMessage = "กรุณากรอกข้อมูลให้ครบถ้วน:";

            // ตรวจสอบฟิลด์แต่ละฟิลด์และเพิ่มข้อความผิดพลาดที่เกี่ยวข้อง
            if (this.addForm.get('title').hasError('required')) {
                errorMessage += "\n- กรุณาระบุประเภทการแจ้งเตือน";
            }
            if (this.addForm.get('body').hasError('required')) {
                errorMessage += "\n- กรุณาระบุรายละเอียดการแจ้งเตือน";
            }
            // if (this.addForm.get('date').invalid || this.addForm.get('date').value.length === 0) {
            //     errorMessage += "\n- กรุณาระบุวันที่";
            // }

            // แสดงข้อความผิดพลาดโดยใช้ FuseConfirmationService
            this._fuseConfirmationService.open({
                title: 'ข้อมูลไม่ครบถ้วน',
                message: errorMessage,
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle-circle',
                    color: 'accent',
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

            return; // หยุดการส่งข้อมูลถ้าฟอร์มไม่ถูกต้อง
        }

        // หากฟอร์มถูกต้อง ให้ทำการบันทึกข้อมูล
        const formattedData = this.addForm.value.date.map((group: any) => {
            return {
                ...group,
                day: this.datePipe.transform(group.day, 'yyyy-MM-dd')  // แปลงวันที่เป็นรูปแบบ yyyy-MM-dd
            };
        });

        const formData = {
            ...this.addForm.value,
            date: formattedData  // ใช้ข้อมูลที่แปลงแล้ว
        };

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

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.Savedata(formData).subscribe({
                    next: (resp: any) => {
                        this.refreshTable(); // Refresh the table or list
                        this.addForm.reset(); // Reset the form
                        this._fuseConfirmationService.open({
                            title: 'สำเร็จ',
                            message: "บันทึกข้อมูลสำเร็จ",
                            icon: {
                                show: true,
                                name: 'heroicons_outline:check-circle',
                                color: 'success',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ตกลง',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: true,
                                    label: 'ตกลง',
                                }
                            },
                            dismissible: true,
                        });
                    },
                    error: (err: any) => {
                        const errorMessage = "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาระบุวันที่และเวลา"; // ข้อความกำกัย

                        this._fuseConfirmationService.open({
                            title: 'เกิดข้อผิดพลาด',
                            message: errorMessage,  // ใช้ข้อความกำกัยแทนข้อความที่ได้จาก error
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation-triangle-circle',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ตกลง',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: true,
                                    label: 'ตกลง',
                                },
                            },
                            dismissible: true,
                        });
                    },

                });
            }
        });
    }


    refreshTable() {
        this._service.getDate(this.addForm.value.title).subscribe((data) => {
            this.datenoti = data; // อัปเดต dataSource
            this.cdr.detectChanges(); // แจ้งให้ Angular อัปเดตตาราง
        });
    }

    data(data: any, formData: FormData) {
        throw new Error('Method not implemented.');
    }

    Cancel(): void {
        this._router.navigateByUrl('config/edit/1').then(() => { });
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);
        this.imageUrls = [];
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
    backTo() {
        this._router.navigate(['config/edit/1']);
    }

}
