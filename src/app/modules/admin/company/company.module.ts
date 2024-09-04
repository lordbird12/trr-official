import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { CompanyRoute } from './company-routing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ShareModule } from 'app/share.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DetailComponent } from './detail/detail.component';
// import moment from 'moment';


@NgModule({
    declarations: [
        ListComponent,
        EditDialogComponent,
        FormDialogComponent,
        // DetailComponent
    ],
    imports: [
        RouterModule.forChild(CompanyRoute),
        ShareModule,
        NgxDropzoneModule
    ]
})
export class CompanyModule { }