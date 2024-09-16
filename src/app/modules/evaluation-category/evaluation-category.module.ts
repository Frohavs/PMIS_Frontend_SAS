import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationCategoryRoutingModule } from './evaluation-category-routing.module';
import { EvaluationCategoryComponent } from './evaluation-category.component';
import { OverviewComponent } from './overview/overview.component';
import { AddEvalCategoryComponent } from './add-eval-category/add-eval-category.component';


@NgModule({
  declarations: [
    EvaluationCategoryComponent,
    OverviewComponent,
    AddEvalCategoryComponent
  ],
  imports: [
    CommonModule,
    EvaluationCategoryRoutingModule
  ]
})
export class EvaluationCategoryModule { }
