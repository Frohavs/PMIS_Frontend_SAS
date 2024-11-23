import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StumbledProjectsRoutingModule } from './stumbled-projects-routing.module';
import { StumbledProjectsComponent } from './stumbled-projects.component';
import { OverviewComponent } from './overview/overview.component';
import { StumbledProjectDetailsComponent } from './stumbled-project-details/stumbled-project-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { AddStumbledProjectComponent } from './add-stumbled-project/add-stumbled-project.component';


@NgModule({
  declarations: [
    OverviewComponent,
    StumbledProjectsComponent,
    AddStumbledProjectComponent,
    StumbledProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    StumbledProjectsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    WidgetsModule,
    NgMultiSelectDropDownModule.forRoot(),
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class StumbledProjectsModule { }
