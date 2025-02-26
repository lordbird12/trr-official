import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfignotiService } from './setting.service';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { yearsPerPage } from '@angular/material/datepicker';

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
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
    dataRow: any = [];
    displayedColumns: string[] = [
        'manage',
        'no',
        'name',
        'email',
        'position',
        'phoneNumber',
        'status',
    ];
    // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    @ViewChild(MatSort) sort: MatSort;
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
            date: ['', Validators.required],
            time: ['', Validators.required],
            year: ['', Validators.required],
        });


    }

    ngOnInit(): void {
     
        this.loadTable();
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
                that._service
                    .getPage(dataTablesParameters)
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
                { data: 'action', orderable: false },
                { data: 'id', orderable: false },
                { data: 'title', orderable: false },
                { data: 'views', orderable: false },
                { data: 'status', orderable: false },
            ],
        };
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
               
            }
            error: (err: any) => { };
        });
    }
   
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
 
    Submit(): void {

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

            if (result === 'confirmed') {
                const formData = new FormData();
                Object.entries(this.addForm.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                        
                    }
                );
                // this._service.create(formData).subscribe({
                //     next: (resp: any) => {
                //         this.onCancelClick();
                //     },

                //     error: (err: any) => {
                //         console.log(err);
                //         this.addForm.enable();
                //         this._fuseConfirmationService.open({
                //             title: 'เกิดข้อผิดพลาด',
                //             message: err.error.message,
                //             icon: {
                //                 show: true,
                //                 name: 'heroicons_outline:exclamation-triangle',
                //                 color: 'warning',
                //             },
                //             actions: {
                //                 confirm: {
                //                     show: false,
                //                     label: 'Confirm',
                //                     color: 'primary',
                //                 },
                //                 cancel: {
                //                     show: false,
                //                     label: 'Cancel',
                //                 },
                //             },
                //             dismissible: true,
                //         });
                //         console.log(err.error.message);
                //     },
                // });
            }
        });

    }
   

}
