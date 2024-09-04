import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DataTablesModule } from 'angular-datatables';
import { FuseCardComponent } from '@fuse/components/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NewChatComponent } from './modules/admin/chat/chat.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressBarModule,
        DataTablesModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatTableModule,
        MatInputModule,
        MatRadioModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        DataTablesModule,
        OverlayModule,
        MatDialogModule,
        FuseCardComponent,
        MatCardModule,
        MatDividerModule,
        MatListModule,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        MatProgressBarModule,
        DataTablesModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatTableModule,
        MatInputModule,
        MatRadioModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        DataTablesModule,
        OverlayModule,
        MatDialogModule,
        FuseCardComponent,
        MatCheckboxModule,
        MatCardModule,
        MatDividerModule,
        MatListModule
    ],
})
export class ShareModule {}
