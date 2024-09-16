import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationCategoryRoutingModule } from './evaluation-category-routing.module';
import { EvaluationCategoryComponent } from './evaluation-category.component';
import { OverviewComponent } from './overview/overview.component';
import { AddEvalCategoryComponent } from './add-eval-category/add-eval-category.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { EvalCategoryDetailsComponent } from './eval-category-details/eval-category-details.component';


@NgModule({
  declarations: [
    EvaluationCategoryComponent,
    OverviewComponent,
    AddEvalCategoryComponent,
    EvalCategoryDetailsComponent
  ],
  imports: [
    CommonModule,
    EvaluationCategoryRoutingModule,
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
  ]
})
export class EvaluationCategoryModule { }
