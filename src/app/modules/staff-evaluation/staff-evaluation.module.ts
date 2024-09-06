import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffEvaluationRoutingModule } from './staff-evaluation-routing.module';
import { StaffEvaluationComponent } from './staff-evaluation.component';
import { OverviewComponent } from './overview/overview.component';
import { AddEvaluationComponent } from './add-evaluation/add-evaluation.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxCurrencyDirective } from 'ngx-currency';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { EvaluationDetailsComponent } from './evaluation-details/evaluation-details.component';
import { PrintEvaluationComponent } from './print-evaluation/print-evaluation.component';


@NgModule({
  declarations: [
    StaffEvaluationComponent,
    OverviewComponent,
    AddEvaluationComponent,
    EvaluationDetailsComponent,
    PrintEvaluationComponent
  ],
  imports: [
    CommonModule,
    StaffEvaluationRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    WidgetsModule,
    SweetAlert2Module.forChild(),
    SharedModule,
    NgxCurrencyDirective
  ]
})
export class StaffEvaluationModule { }
