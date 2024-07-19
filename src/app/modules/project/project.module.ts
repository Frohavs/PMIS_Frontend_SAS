import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { DropdownMenusModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ProjectsComponent } from './projects.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { UpdateProjectInfoComponent } from './update-project-info/update-project-info.component';
import { UpdateProjectStaffComponent } from './update-project-info/update-project-staff/update-project-staff.component';
import { UpdateProgressInfoComponent } from './update-project-info/update-progress-info/update-progress-info.component';
import { ProjectStageUpdateComponent } from './update-project-info/project-stage-update/project-stage-update.component';


@NgModule({
  declarations: [
    ProjectsComponent,
    OverviewComponent,
    CreateProjectComponent,
    ProjectDetailsComponent,
    UpdateProjectInfoComponent,
    UpdateProjectStaffComponent,
    UpdateProgressInfoComponent,
    ProjectStageUpdateComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    TranslateModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    DropdownMenusModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class ProjectModule { }
