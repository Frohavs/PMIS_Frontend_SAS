import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoqComponent } from './boq.component';
import { OverviewComponent } from './overview/overview.component';
import { AddBoqComponent } from './add-boq/add-boq.component';

const routes: Routes = [
  {
    path: '',
    component: BoqComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'add',
        component: AddBoqComponent,
      },
      {
        path: 'edit/:id',
        component: AddBoqComponent,
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
export class BoqRoutingModule { }
