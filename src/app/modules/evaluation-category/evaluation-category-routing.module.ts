import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEvalCategoryComponent } from './add-eval-category/add-eval-category.component';
import { OverviewComponent } from './overview/overview.component';
import { EvaluationCategoryComponent } from './evaluation-category.component';
import { EvalCategoryDetailsComponent } from './eval-category-details/eval-category-details.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationCategoryComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'add',
        component: AddEvalCategoryComponent,
      },
      {
        path: 'details/:id',
        component: EvalCategoryDetailsComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationCategoryRoutingModule { }
