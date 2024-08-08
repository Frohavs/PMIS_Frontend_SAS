import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { DropdownMenusModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxCurrencyDirective } from "ngx-currency";

import { ProjectsComponent } from './projects.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectInfoComponent } from './update-project-info/update-project-info.component';
import { UpdateProjectStaffComponent } from './update-project-info/update-project-staff/update-project-staff.component';
import { UpdateProgressInfoComponent } from './update-project-info/update-progress-info/update-progress-info.component';
import { ProjectStageUpdateComponent } from './update-project-info/project-stage-update/project-stage-update.component';
import { UpdateInfoComponent } from './update-project-info/update-info/update-info.component';
import { UpdateEotComponent } from './update-project-info/update-info/update-eot/update-eot.component';
import { UpdateVariationOrderComponent } from './update-project-info/update-info/update-variation-order/update-variation-order.component';
import { AddBoqComponent } from './add-boq/add-boq.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import { CashFlowComponent } from './cash-flow/cash-flow.component';
import { AddCashFlowComponent } from './cash-flow/add-cash-flow/add-cash-flow.component';
import { CashFlowDetailsComponent } from './cash-flow/cash-flow-details/cash-flow-details.component';
import { MilestoneListComponent } from './milestone-list/milestone-list.component';
import { AddMilestoneComponent } from './milestone-list/add-milestone/add-milestone.component';
import { CriticalPathComponent } from './critical-path/critical-path.component';
import { AddCriticalPathComponent } from './critical-path/add-critical-path/add-critical-path.component';


@NgModule({
  declarations: [
    ProjectsComponent,
    OverviewComponent,
    CreateProjectComponent,

    BoqListComponent,
    AddBoqComponent,

    UpdateProjectInfoComponent,
    UpdateProjectStaffComponent,
    UpdateProgressInfoComponent,
    ProjectStageUpdateComponent,
    UpdateInfoComponent,
    UpdateEotComponent,
    UpdateVariationOrderComponent,

    CashFlowComponent,
    AddCashFlowComponent,
    CashFlowDetailsComponent,

    MilestoneListComponent,
    AddMilestoneComponent,

    CriticalPathComponent,
    AddCriticalPathComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    WidgetsModule,
    TranslateModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    DropdownMenusModule,
    SweetAlert2Module.forChild(),
    SharedModule,
    NgxCurrencyDirective
  ]
})
export class ProjectModule { }
