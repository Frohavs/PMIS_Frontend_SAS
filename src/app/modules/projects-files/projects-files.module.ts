import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsFilesRoutingModule } from './projects-files-routing.module';
import { ProjectsFilesComponent } from './projects-files.component';
import { OverviewComponent } from './overview/overview.component';
import { AddProjectFilesComponent } from './add-project-files/add-project-files.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';


@NgModule({
  declarations: [
    ProjectsFilesComponent,
    OverviewComponent,
    AddProjectFilesComponent
  ],
  imports: [
    CommonModule,
    ProjectsFilesRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    TranslateModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class ProjectsFilesModule { }
