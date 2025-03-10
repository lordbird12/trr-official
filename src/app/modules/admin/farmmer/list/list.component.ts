import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Route, Router } from '@angular/router';
import { NewsService } from '../service/news.service';
import { DataTableDirective } from 'angular-datatables';
import { EditComponent } from '../edit/edit.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PictureComponent } from '../picture/picture.component';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { co } from '@fullcalendar/core/internal-common';
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

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
    selector: 'app-list-news',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isLoading: boolean = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dataRow: any = [];
    numbers: number[] = [];
    selectedProvince: string = ''; // ค่าที่เลือกใน Dropdown
    // ตัวอย่างข้อมูล Dropdown
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
    flashMessage: null;
    flashErrorMessage: null;
    private _matDialog: any;
    province: any[] = [];
    farmmer: any[] = []
    data = new FormControl('1');
    searchTerm: string = '';
    yearTerm: string = '';
    row: number = 10;
    currentPage: number = 1;
    totalPages: number = 1;
    quotas: any[] = []
    months: any[] = []
    totalrecord: number;
    year: any[] = []

    totalRows = 25; // จำนวนแถวทั้งหมด
    rowsPerPage = 10; // จำนวนแถวที่แสดงต่อหน้า

    constructor(
        private dialog: MatDialog,
        private _liveAnnouncer: LiveAnnouncer,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _Service: NewsService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this._Service.getProvince().subscribe((resp: any) => {
            this.province = resp;
            this._changeDetectorRef.markForCheck();
        });
        this._Service.getAPIFarmmer(this.searchTerm, this.currentPage, this.row, +this.yearTerm).subscribe((resp: any) => {
            this.farmmer = resp.data;
            this.totalrecord = +resp.total
            this.totalPages = Math.ceil(this.totalrecord / this.row);
            this.quotas = [];
            this.farmmer.forEach(element => {
                this.quotas.push(element.Quota_id);
            });

            this._Service.getEvents(this.quotas).subscribe((resp: any) => {
                this.months = [];
                this.months = resp;
            });
            this._changeDetectorRef.markForCheck();
        });
        this.numbers = Array.from({ length: 12 }, (_, i) => i); // Creates an array [0, 1, 2, ..., 12]

    }

    ngOnInit(): void {
        this._Service.groupyear(null).subscribe((resp: any) => {
            console.log(resp);

        })
        // this.loadTable();
        // this.searchFarmers();
        // this.loadFarmers();
    }

    // ฟังก์ชันที่เรียกใช้เมื่อต้องการค้นหา
    searchFarmers(): void {

        this.currentPage = 1;
        this._Service.getAPIFarmmer(this.searchTerm, this.currentPage, this.row, +this.yearTerm, this.selectedProvince).subscribe((resp: any) => {
            this.farmmer = resp.data;
            this.totalrecord = +resp.total
            this.totalPages = Math.ceil(this.totalrecord / this.row);
            this.quotas = [];
            this.farmmer.forEach(element => {
                this.quotas.push(element.Quota_id);

            });

            this._Service.getEvents(this.quotas).subscribe((resp: any) => {
                this.months = [];
                this.months = resp;
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    // ฟังก์ชันที่เรียกใช้เมื่อมีการเปลี่ยนแปลงข้อความใน input
    onSearchChange(searchValue: string): void {
        this.searchTerm = searchValue;
        this.currentPage = 1;
        this.searchFarmers();
    }

    onSearchYear(): void {

        this.currentPage = 1;
        this.searchFarmers();
    }


    monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    isMonthActive(item: any, monthKey: string): boolean {
        return this.months.some(
            (month) => month.quota_id === item.Quota_id && month?.months?.[monthKey] === true
        );
    }

    trackByQuotaId(index: number, item: any): string {
        return item.Quota_id;
    }

    loadFarmers(): void {
        this.quotas = [];
        this._Service.getAPIFarmmer(this.searchTerm, this.currentPage, this.row, +this.yearTerm, this.selectedProvince).subscribe((resp: any) => {
            this.farmmer = resp.data;
            this.totalrecord = +resp.total
            this.totalPages = Math.ceil(this.totalrecord / this.row);
            this.farmmer.forEach(element => {
                this.quotas.push(element.Quota_id);

            });

            this._Service.getEvents(this.quotas).subscribe((resp: any) => {
                this.months = [];
                this.months = resp;
            });
            // console.log(this.quotas);
            // console.log("เปลี่ยนหน้า page, this.farmmer", this.farmmer);
            // this.totalPages = resp.length
            console.log("เปลี่ยนหน้า page, this.farmmer", this.totalPages);

            this._changeDetectorRef.markForCheck();
        });
    }

    changePage(page: number): void {
        if (page >= 1) {
            this.currentPage = page;
            this.months = [];
            this.loadFarmers();
        }
    }



    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    hiddenEdit() {
        // const getpermission = JSON.parse(localStorage.getItem('permission'));
        // const menu = getpermission.find((e) => e.menu_id == 4);
        // return menu.edit == 0;
    }
    hiddenDelete() {
        // const getpermission = JSON.parse(localStorage.getItem('permission'));
        // const menu = getpermission.find((e) => e.menu_id == 4);
        // return menu.delete == 0;
    }
    hiddenSave() {
        // const getpermission = JSON.parse(localStorage.getItem('permission'));
        // const menu = getpermission.find((e) => e.menu_id == 4);
        // return menu.save == 0;
    }
    addElement(element: any) {
        // this._router.navigate(['employee/form'])
        const dialogRef = this.dialog.open(FormDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            height: 'auto',
            data: element, // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.rerender();
        });
    }
    nextpage() {
        this._router.navigate(['news/form']);
    }

    goToProfile(id: string) {
        this._router.navigate(['profile/page/edit/' + id]);
    }
    goToDelete(id: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'การลบข้อมูลจะมีผลทำให้ข้อมูลการยอมรับ PDPA และกิจกรรมหายไปจากระบบ ยืนยันใช่หรือไม่',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'warn',
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
                this._Service.delete(id).subscribe((resp) => {
                    this._Service.getAPIFarmmer(this.searchTerm, this.currentPage, this.row).subscribe((resp: any) => {
                        this.farmmer = resp.data;
                        this.totalrecord = +resp.total - 210
                        this.totalPages = Math.ceil(this.totalrecord / this.row);
                        this.quotas = [];
                        this.farmmer.forEach(element => {
                            this.quotas.push(element.Quota_id);

                        });

                        this._Service.getEvents(this.quotas).subscribe((resp: any) => {
                            this.months = [];
                            this.months = resp;
                        });
                        this._changeDetectorRef.markForCheck();
                    });
                });
            }
            error: (err: any) => { };
        });
    }
    editElement(element: any) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '400px', // กำหนดความกว้างของ Dialog
            height: 'auto',
            data: element, // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                alert(1);
                // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
            }
        });
    }
    editDailog(id: any): void {
        this.dialog
            .open(EditDialogComponent, {
                width: '500px', // กำหนดความกว้างของ Dialog
                height: 'auto',

                disableClose: false,
                autoFocus: false,

                data: id,
            })
            .afterClosed()
            .subscribe((res) => {
                //console.log('Product', res);
                this.rerender();
                // this.rerender();

                /**ถ้าส่ง successfull มาจะทำการรีโหลดตาราง */
            });
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
    edit(Id: any) {
        this._router.navigate(['news/edit/' + Id]);
    }
    // this._Service.getById(this.data).subscribe((resp: any) => {
    //     this.itemData = resp;

    //     this.editForm.patchValue({
    //         id: this.itemData.id,
    //         title: this.itemData.title,
    //         detail: this.itemData.detail,
    //         image: this.itemData.image,
    //         notify_status: this.itemData.notify_status,
    //         status: this.itemData.status,
    //     });
    //     console.log(this.editForm.value);
    //     this.url_pro = this.itemData.image;
    // });
    // delete(itemid: any) {
    //     this._Service.delete(itemid).subscribe();
    // }
    delete(itemid: any) {
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
                this._Service.delete(itemid).subscribe((resp) => {
                    this.rerender();
                });
            }
            error: (err: any) => { };
        });
    }
    dataTablesParameters: any
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };


    onPageLengthChange(event: Event): void {
        console.log(event.target, this.row)
        this._Service.getAPIFarmmer(this.searchTerm, this.currentPage, this.row).subscribe((resp: any) => {
            this.farmmer = resp.data;
            this.totalrecord = +resp.total

            this.totalPages = Math.ceil(this.totalrecord / this.row);
            this.quotas = [];
            this.farmmer.forEach(element => {
                this.quotas.push(element.Quota_id);

            });

            this._Service.getEvents(this.quotas).subscribe((resp: any) => {
                this.months = [];
                this.months = resp;
            });
            this._changeDetectorRef.markForCheck();
        });
    }
    // loadTable(): void {
    //     const that = this;
    //     this.dtOptions = {
    //         pagingType: 'full_numbers',
    //         pageLength: 10, // ค่าเริ่มต้น 10f
    //         serverSide: true,
    //         processing: true,
    //         order: [[0, 'desc']],
    //         searching: false,
    //         language: {
    //             url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
    //         },
    //         ajax: (dataTablesParameters: any, callback) => {
    //             that._Service
    //                 .getAPIFarmmer(this.searchTerm, this.currentPage,this.row)
    //                 .subscribe((resp) => {
    //                     this.pages.current_page = resp.current_page;
    //                     this.pages.last_page = resp.last_page;
    //                     this.pages.per_page = resp.per_page;
    //                     if (parseInt(resp.current_page) > 1) {
    //                         this.pages.begin =
    //                             parseInt(resp.per_page) *
    //                             (parseInt(resp.current_page) - 1);
    //                     } else {
    //                         this.pages.begin = 0;
    //                     }
    //                     that.farmmer = resp.data;
    //                     callback({
    //                         recordsTotal: resp.total,
    //                         recordsFiltered: resp.total,
    //                         data: [],
    //                     });
    //                 });
    //         },
    //         columns: [
    //             { data: 'id_card_number', orderable: false },
    //             { data: 'name', orderable: false },
    //             { data: 'qouta', orderable: false },
    //             { data: 'phone', orderable: false },
    //             { data: 'no', orderable: false },
    //             { data: 'area', orderable: false },
    //             { data: 'count_area', orderable: false },
    //             { data: 'action', orderable: false },
    //         ],
    //     };
    // }



    // loadTable(): void {
    //     const that = this;
    //     this.dtOptions = {
    //         pagingType: "full_numbers",
    //         pageLength: 10,
    //         serverSide: true,
    //         processing: true,
    //         language: {
    //             url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
    //         },
    //         ajax: (dataTablesParameters: any, callback) => {
    //             dataTablesParameters.status = null;
    //              that._Service.getPage(dataTablesParameters).subscribe((resp: any) => {
    //                  this.dataRow = resp.data;
    //                  console.log('111',this.dataRow)
    //                  this.pages.current_page = resp.current_page;
    //                  this.pages.last_page = resp.last_page;
    //                  this.pages.per_page = resp.per_page;
    //                  if (resp.currentPage > 1) {
    //                      this.pages.begin =
    //                          parseInt(resp.itemsPerPage) * (parseInt(resp.currentPage) - 1);
    //                  } else {
    //                      this.pages.begin = 0;
    //                  }

    //                  callback({
    //                      recordsTotal: resp.data.total,
    //                      recordsFiltered: resp.data.total,
    //                      data: [],
    //                  });
    //                  this._changeDetectorRef.markForCheck();
    //                  console.log(resp)
    //              });
    //         },
    //     };
    // }

    showPicture(imgObject: any): void {
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => { });
    }

    getMonthClass(data: any): string {
        console.log(data);
        return data === false ? 'bg-red' : 'bg-green';
    }

    get startRow() {
        return (this.currentPage - 1) * this.rowsPerPage + 1;
    }

    get endRow() {
        return Math.min(this.currentPage * this.rowsPerPage, this.totalRows);
    }
    sortOrder: boolean = true; // true = Ascending, false = Descending
    sortData(column: string): void {
        this.sortOrder = !this.sortOrder; // สลับระหว่าง Ascending และ Descending
        this.farmmer.sort((a, b) => {
            const valueA = a[column] || ''; // ตรวจสอบค่าที่ null หรือ undefined
            const valueB = b[column] || '';

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return this.sortOrder
                    ? valueA.localeCompare(valueB) // Ascending
                    : valueB.localeCompare(valueA); // Descending
            }

            return this.sortOrder ? valueA - valueB : valueB - valueA; // สำหรับตัวเลข
        });
    }



}
