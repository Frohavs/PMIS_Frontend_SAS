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
import { DailyReportComponent } from './daily-report/daily-report.component';
import { AddDailyReportComponent } from './daily-report/add-daily-report/add-daily-report.component';
import { SCurveComponent } from './s-curve/s-curve.component';
import { ResourcePlanListComponent } from './resource-plan-list/resource-plan-list.component';
import { ProjectLettersComponent } from './project-letters/project-letters.component';
import { AddLetterComponent } from './project-letters/add-letter/add-letter.component';
import { SubContractorsComponent } from './sub-contractors/sub-contractors.component';
import { AddSubContractorComponent } from './sub-contractors/add-sub-contractor/add-sub-contractor.component';
import { TimeScheduleManagementComponent } from './time-schedule-management/time-schedule-management.component';
import { AddFloodComponent } from './time-schedule-management/add-flood/add-flood.component';
import { FloodDetailsComponent } from './time-schedule-management/flood-details/flood-details.component';
import { ProjectSiteLocationComponent } from './project-site-location/project-site-location.component';
import { ObsListComponent } from './obs-list/obs-list.component';
import { AddObsComponent } from './obs-list/add-obs/add-obs.component';
import { ObsDetailsComponent } from './obs-list/obs-details/obs-details.component';
import { ContractorEvaluationComponent } from './partner-evaluation/contractor-evaluation/contractor-evaluation.component';
import { ConsultantEvaluationComponent } from './partner-evaluation/consultant-evaluation/consultant-evaluation.component';


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
    AddCriticalPathComponent,

    DailyReportComponent,
    AddDailyReportComponent,

    SCurveComponent,
    ResourcePlanListComponent,

    ProjectLettersComponent,
    AddLetterComponent,

    SubContractorsComponent,
    AddSubContractorComponent,

    TimeScheduleManagementComponent,
    FloodDetailsComponent,
    AddFloodComponent,

    ProjectSiteLocationComponent,

    ObsListComponent,
    AddObsComponent,
    ObsDetailsComponent,

    ConsultantEvaluationComponent,
    ContractorEvaluationComponent
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
