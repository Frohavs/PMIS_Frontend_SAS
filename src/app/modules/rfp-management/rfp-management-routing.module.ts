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
import { InitialCheckListComponent } from './settings/initial-check-list/initial-check-list.component';
import { AddInitialCheckComponent } from './settings/initial-check-list/add-initial-check/add-initial-check.component';
import { OwnerCheckListComponent } from './settings/owner-check-list/owner-check-list.component';
import { AddOwnerCheckComponent } from './settings/owner-check-list/add-owner-check/add-owner-check.component';
import { TypesComponent } from './settings/types/types.component';
import { AddTypeComponent } from './settings/types/add-type/add-type.component';

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
      {
        path: 'initial-check-list',
        component: InitialCheckListComponent,
      },
      {
        path: 'add-initial-check',
        component: AddInitialCheckComponent,
      },
      {
        path: 'owner-check-list',
        component: OwnerCheckListComponent,
      },
      {
        path: 'add-owner-check',
        component: AddOwnerCheckComponent,
      },
      {
        path: 'types',
        component: TypesComponent,
      },
      {
        path: 'add-type',
        component: AddTypeComponent,
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
