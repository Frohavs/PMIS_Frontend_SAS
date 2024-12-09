import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { RfpManagementComponent } from './rfp-management.component';
import { ClassificationComponent } from './settings/classification/classification.component';
import { AddClassificationComponent } from './settings/classification/add-classification/add-classification.component';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { PositionsComponent } from './settings/positions/positions.component';

const routes: Routes = [
  {
    path: '',
    component: RfpManagementComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'classification',
        component: ClassificationComponent,
      },
      {
        path: 'add-classification',
        component: AddClassificationComponent,
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
      },
      {
        path: 'positions',
        component: PositionsComponent,
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
export class RfpManagementRoutingModule { }
