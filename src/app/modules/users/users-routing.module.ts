import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
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
export class UsersRoutingModule { }
