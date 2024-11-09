import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsFilesComponent } from './projects-files.component';
import { OverviewComponent } from './overview/overview.component';
import { AddProjectFilesComponent } from './add-project-files/add-project-files.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsFilesComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'add',
        component: AddProjectFilesComponent,
      },
      {
        path: 'edit/:id',
        component: AddProjectFilesComponent,
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
export class ProjectsFilesRoutingModule { }
