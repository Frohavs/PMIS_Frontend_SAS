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
import { ConsultantEvaluationComponent } from './partner-evaluation/consultant-evaluation/consultant-evaluation.component';
import { ContractorEvaluationComponent } from './partner-evaluation/contractor-evaluation/contractor-evaluation.component';
import { AddConsultantEvalComponent } from './partner-evaluation/consultant-evaluation/add-consultant-eval/add-consultant-eval.component';
import { AddContractorEvalComponent } from './partner-evaluation/contractor-evaluation/add-contractor-eval/add-contractor-eval.component';
import { ConsultantEvalDetailsComponent } from './partner-evaluation/consultant-evaluation/consultant-eval-details/consultant-eval-details.component';
import { ContractorEvalDetailsComponent } from './partner-evaluation/contractor-evaluation/contractor-eval-details/contractor-eval-details.component';
import { RiskManagementComponent } from './risk-management/risk-management.component';
import { AddRiskComponent } from './risk-management/add-risk/add-risk.component';
import { RiskDetailsComponent } from './risk-management/risk-details/risk-details.component';
import { InitialDeliveryListComponent } from './initial-delivery-list/initial-delivery-list.component';
import { AddDeliveryListComponent } from './initial-delivery-list/add-delivery-list/add-delivery-list.component';
import { FactoryComponent } from './factory/factory.component';
import { AddFactoryComponent } from './factory/add-factory/add-factory.component';
import { FactoryDetailsComponent } from './factory/factory-details/factory-details.component';
import { StageGateManagementComponent } from './stage-gate-managment/stage-gate-managment.component';
import { CreateCommitteeComponent } from './stage-gate-managment/create-commitee/create-commitee.component';
import { DeliverableChecklistComponent } from './stage-gate-managment/deliverable-checklist/deliverable-checklist.component';
import { KickoffMeetingComponent } from './stage-gate-managment/kickoff-meeting/kickoff-meeting.component';
import { KickoffMeetingSubmitComponent } from './stage-gate-managment/kickoff-meeting-submit/kickoff-meeting-submit.component';
import { KickoffPrintComponent } from './stage-gate-managment/kickoff-meeting/kickoff-print/kickoff-print.component';
import { UploadDeliverableChecklistComponent } from './stage-gate-managment/upload-deliverable-checklist/upload-deliverable-checklist.component';
import { ReviewMeetingComponent } from './stage-gate-managment/review-meeting/review-meeting.component';
import { PrintReviewComponent } from './stage-gate-managment/review-meeting/print-review/print-review.component';
import { FinalReviewComponent } from './stage-gate-managment/final-review/final-review.component';
import { CommitAcknowledgementComponent } from './stage-gate-managment/commit-acknowledgement/commit-acknowledgement.component';
import { FinalReviewPrintComponent } from './stage-gate-managment/final-review/final-review-print/final-review-print.component';

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

      {
        path: 'consultant-evaluation/:id',
        component: ConsultantEvaluationComponent,
      },
      {
        path: 'add-consultant-evaluation/:id',
        component: AddConsultantEvalComponent,
      },
      {
        path: 'consultant-eval-details/:id',
        component: ConsultantEvalDetailsComponent,
      },
      {
        path: 'contractor-evaluation/:id',
        component: ContractorEvaluationComponent,
      },
      {
        path: 'add-contractor-evaluation/:id',
        component: AddContractorEvalComponent,
      },
      {
        path: 'contractor-eval-details/:id',
        component: ContractorEvalDetailsComponent,
      },

      {
        path: 'risk-management/:id',
        component: RiskManagementComponent,
      },
      {
        path: 'add-risk/:id',
        component: AddRiskComponent,
      },
      {
        path: 'risk-management-details/:id',
        component: RiskDetailsComponent,
      },

      {
        path: 'initial-delivery-list/:id',
        component: InitialDeliveryListComponent,
      },
      {
        path: 'add-delivery-list/:id',
        component: AddDeliveryListComponent,
      },
      {
        path: 'edit-delivery-list/:id',
        component: AddDeliveryListComponent,
      },

      {
        path: 'factory-list/:id',
        component: FactoryComponent,
      },
      {
        path: 'add-factory/:id',
        component: AddFactoryComponent,
      },
      {
        path: 'factory-details/:id',
        component: FactoryDetailsComponent,
      },

      {
        path: 'stage-gate-management/:id',
        component: StageGateManagementComponent,
      },
      {
        path: 'stage-gate-committees/:id',
        component: CreateCommitteeComponent,
      },
      {
        path: 'stage-deliverable-checklist/:id',
        component: DeliverableChecklistComponent,
      },
      {
        path: 'stage-kickoff/:id',
        component: KickoffMeetingComponent,
      },
      {
        path: 'stage-kickoff-print/:id',
        component: KickoffPrintComponent,
      },
      {
        path: 'stage-kickoff-submit/:id',
        component: KickoffMeetingSubmitComponent,
      },
      {
        path: 'stage-upload-deliverable-checklist/:id',
        component: UploadDeliverableChecklistComponent,
      },
      {
        path: 'stage-review-meeting/:id',
        component: ReviewMeetingComponent,
      },
      {
        path: 'stage-review-meeting-print/:id',
        component: PrintReviewComponent,
      },
      {
        path: 'stage-final-review/:id',
        component: FinalReviewComponent,
      },
      {
        path: 'stage-final-review-print/:id',
        component: FinalReviewPrintComponent,
      },
      {
        path: 'stage-commit-acknowledgement/:id',
        component: CommitAcknowledgementComponent,
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
