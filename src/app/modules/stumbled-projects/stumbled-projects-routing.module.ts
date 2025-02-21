import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StumbledProjectsComponent } from './stumbled-projects.component';
import { OverviewComponent } from './overview/overview.component';
import { StumbledProjectDetailsComponent } from './stumbled-project-details/stumbled-project-details.component';
import { AddStumbledProjectComponent } from './add-stumbled-project/add-stumbled-project.component';
import { ViewStumbledComponent } from './view-stumbled/view-stumbled.component';

const routes: Routes = [
  {
    path: '',
    component: StumbledProjectsComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'create/:id',
        component: AddStumbledProjectComponent,
      },
      {
        path: 'view/:id',
        component: ViewStumbledComponent,
      },
      {
        path: 'details/:id',
        component: StumbledProjectDetailsComponent,
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
export class StumbledProjectsRoutingModule { }
