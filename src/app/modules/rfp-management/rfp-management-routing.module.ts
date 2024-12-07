import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { RfpManagementComponent } from './rfp-management.component';

const routes: Routes = [
  {
    path: '',
    component: RfpManagementComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
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
