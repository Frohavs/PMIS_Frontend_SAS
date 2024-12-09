import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { RfpManagementComponent } from './rfp-management.component';
import { ClassificationComponent } from './settings/classification/classification.component';
import { AddClassificationComponent } from './settings/classification/add-classification/add-classification.component';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { AddDepartmentComponent } from './settings/departments/add-department/add-department.component';
import { PositionsComponent } from './settings/positions/positions.component';
import { AddPositionComponent } from './settings/positions/add-position/add-position.component';
import { SectionsComponent } from './settings/sections/sections.component';
import { AddSectionComponent } from './settings/sections/add-section/add-section.component';

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
        path: 'add-department',
        component: AddDepartmentComponent,
      },
      {
        path: 'positions',
        component: PositionsComponent,
      },
      {
        path: 'add-position',
        component: AddPositionComponent,
      },
      {
        path: 'sections',
        component: SectionsComponent,
      },
      {
        path: 'add-section',
        component: AddSectionComponent,
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
