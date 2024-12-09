import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfpManagementRoutingModule } from './rfp-management-routing.module';
import { RfpManagementComponent } from './rfp-management.component';
import { OverviewComponent } from './overview/overview.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxCurrencyDirective } from 'ngx-currency';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ClassificationComponent } from './settings/classification/classification.component';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { AddDepartmentComponent } from './settings/departments/add-department/add-department.component';
import { PositionsComponent } from './settings/positions/positions.component';
import { AddClassificationComponent } from './settings/classification/add-classification/add-classification.component';


@NgModule({
  declarations: [
    RfpManagementComponent,
    OverviewComponent,
    ClassificationComponent,
    AddClassificationComponent,
    DepartmentsComponent,
    AddDepartmentComponent,
    PositionsComponent
  ],
  imports: [
    CommonModule,
    RfpManagementRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    WidgetsModule,
    NgMultiSelectDropDownModule.forRoot(),
    SweetAlert2Module.forChild(),
    SharedModule,
    NgxCurrencyDirective,
    AngularSignaturePadModule
  ]
})
export class RfpManagementModule { }
