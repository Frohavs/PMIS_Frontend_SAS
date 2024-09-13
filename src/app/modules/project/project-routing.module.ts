import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AddCriticalPathComponent } from './critical-path/add-critical-path/add-critical-path.component';
import { CriticalPathComponent } from './critical-path/critical-path.component';
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

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'create',
        component: CreateProjectComponent,
      },
      {
        path: 'boq-list/:id',
        component: BoqListComponent,
      },
      {
        path: 'add-boq/:id',
        component: AddBoqComponent,
      },
      {
        path: 'edit/:id',
        component: CreateProjectComponent,
      },
      {
        path: 'update-project-info/:id',
        component: UpdateProjectInfoComponent,
      },
      {
        path: 'update-project-staff/:id',
        component: UpdateProjectStaffComponent,
      },
      {
        path: 'update-info/:id',
        component: UpdateInfoComponent,
      },
      {
        path: 'update-progress-info/:id',
        component: UpdateProgressInfoComponent,
      },
      {
        path: 'project-stage-update/:id',
        component: ProjectStageUpdateComponent,
      },
      {
        path: 'update-eot/:id',
        component: UpdateEotComponent,
      },
      {
        path: 'update-variation/:id',
        component: UpdateVariationOrderComponent,
      },

      {
        path: 'cash-flow/:id',
        component: CashFlowComponent,
      },
      {
        path: 'add-cash-flow/:id',
        component: AddCashFlowComponent,
      },
      {
        path: 'cash-details/:id',
        component: CashFlowDetailsComponent,
      },

      {
        path: 'milestone_list/:id',
        component: MilestoneListComponent,
      },
      {
        path: 'add-milestone/:id',
        component: AddMilestoneComponent,
      },
      {
        path: 'edit-milestone/:id',
        component: AddMilestoneComponent,
      },

      {
        path: 'critical_path/:id',
        component: CriticalPathComponent,
      },
      {
        path: 'add-critical_path/:id',
        component: AddCriticalPathComponent,
      },
      {
        path: 'edit-critical_path/:id',
        component: AddCriticalPathComponent,
      },

      {
        path: 'daily-report/:id',
        component: DailyReportComponent,
      },
      {
        path: 'add-daily-report/:id',
        component: AddDailyReportComponent,
      },
      {
        path: 'edit-daily-report/:id',
        component: AddDailyReportComponent,
      },
      {
        path: 's-curve/:id',
        component: SCurveComponent,
      },
      {
        path: 'resource-plan-list/:id',
        component: ResourcePlanListComponent,
      },

      {
        path: 'project-letter/:id',
        component: ProjectLettersComponent,
      },
      {
        path: 'add-project-letter/:id',
        component: AddLetterComponent,
      },
      {
        path: 'project-letter-details/:id',
        component: AddLetterComponent,
      },

      {
        path: 'sub-contractors/:id',
        component: SubContractorsComponent,
      },
      {
        path: 'add-sub-contractor/:id',
        component: AddSubContractorComponent,
      },
      {
        path: 'sub-contractor-details/:id',
        component: AddSubContractorComponent,
      },

      {
        path: 'flood-management/:id',
        component: TimeScheduleManagementComponent,
      },
      {
        path: 'flood-details/:id',
        component: FloodDetailsComponent,
      },
      {
        path: 'add-flood/:id',
        component: AddFloodComponent,
      },
      {
        path: 'edit-flood/:id',
        component: AddFloodComponent,
      },

      {
        path: 'project-site-location/:id',
        component: ProjectSiteLocationComponent,
      },

      {
        path: 'obs-list/:id',
        component: ObsListComponent,
      },
      {
        path: 'obs-details/:id',
        component: ObsDetailsComponent,
      },
      {
        path: 'add-obs/:id',
        component: AddObsComponent,
      },
      {
        path: 'edit-obs/:id',
        component: AddObsComponent,
      },

      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
