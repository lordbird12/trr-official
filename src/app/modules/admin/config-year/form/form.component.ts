import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PdpaService } from '../service/config-year.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
declare var jQuery: any;
export interface PeriodicElement {
    no: number;
    name: string;
    email: string;
    position: string;
    phoneNumber: string;
    status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
    selector: 'app-form-pdpa',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dataRow: any = [];
    addForm: FormGroup;
    permissiondata: any[];
    Id: any;
    item: any;
    editorContent = '';
    uploadedImages: any;
    isLoading: boolean = false;
    user: any
    displayedColumns: string[] = [
        'manage',
        'no',
        'name',
        'email',
        'position',
        'phoneNumber',
        'status',
    ];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _router: Router,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PdpaService,
        public activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.Id = params.id;
        });
        this.addForm = this.formBuilder.group({
            id: '',
            year: '',
            date: '..',
            time: '',
        });
        this.user = JSON.parse(localStorage.getItem('user'))
    }

    ngOnInit(): void {
        this.loadTable();
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
                });
            });
        } else {
            this.addForm.patchValue({
                id: '',
                year: '',
                date: '',
                time: '',
            });
        }
    }
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };

    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[0, 'desc']],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.pdpa_id = this.Id;
                that._service
                    .getPageRegister(dataTablesParameters)
                    .subscribe((resp) => {
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (parseInt(resp.current_page) > 1) {
                            this.pages.begin =
                                parseInt(resp.per_page) *
                                (parseInt(resp.current_page) - 1);
                        } else {
                            this.pages.begin = 0;
                        }
                        that.dataRow = resp.data;
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                    });
            },
            columns: [
                { data: 'actioon', orderable: false },
                { data: 'no', orderable: false },
                { data: 'code', orderable: false },
                { data: 'name', orderable: false },
            ],
        };
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
        // console.log(this.addForm.value);
        // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
        // console.log(end)
        // this.addForm.patchValue({
        //   register_date:end
        // })
        let title = "";
        if (this.Id) {
            title = 'แก้ไขข้อมูล';
        } else {
            title = 'บันทึกข้อมูล';
        }

        const confirmation = this._fuseConfirmationService.open({
            title: title,
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

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                if (!this.Id) {
                    this._service.create(this.addForm.value).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/config-year/list')
                                .then(() => { });
                        },

                        error: (err: any) => {
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'ไม่สามารถบันทึกข้อมูลได้',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation-triangle',
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
                    this._service.update(this.addForm.value,this.Id).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/config-year/list')
                                .then(() => { });
                        },

                        error: (err: any) => {
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

    backTo() {
        this._router.navigate(['admin/config-year/list']);
    }
}
