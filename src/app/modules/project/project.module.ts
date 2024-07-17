import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectsComponent } from './projects.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TranslationModule } from '../i18n';


@NgModule({
  declarations: [
    ProjectsComponent,
    OverviewComponent,
    CreateProjectComponent,
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    TranslateModule,
    TranslationModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class ProjectModule { }
