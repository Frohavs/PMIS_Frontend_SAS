import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffEvaluationComponent } from './staff-evaluation.component';
import { OverviewComponent } from './overview/overview.component';
import { AddEvaluationComponent } from './add-evaluation/add-evaluation.component';
import { EvaluationDetailsComponent } from './evaluation-details/evaluation-details.component';
import { PrintEvaluationComponent } from './print-evaluation/print-evaluation.component';

const routes: Routes = [
  {
    path: '',
    component: StaffEvaluationComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'add',
        component: AddEvaluationComponent,
      },
      {
        path: 'details',
        component: EvaluationDetailsComponent,
      },
      {
        path: 'print',
        component: PrintEvaluationComponent,
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
export class StaffEvaluationRoutingModule { }
