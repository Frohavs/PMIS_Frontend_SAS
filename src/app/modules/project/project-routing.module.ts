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
import { ProjectStatusReportComponent } from './update-project-info/project-status-report/project-status-report.component';
import { SiteStudiesDesignsDashboardComponent } from './site-studies-designs-dashboard/site-studies-designs-dashboard.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { AddProjectFilesComponent } from './project-files/add-project-files/add-project-files.component';
import { HseComponent } from './hse/hse.component';
import { AddReportComponent } from './hse/add-report/add-report.component';
import { HseFindingComponent } from './hse/hse-finding/hse-finding.component';
import { HseFindingCreateComponent } from './hse/hse-finding-create/hse-finding-create.component';
import { HseFindingDetailsComponent } from './hse/hse-finding/hse-finding-details/hse-finding-details.component';
import { InitialDeliveryStatusComponent } from './initial-delivery-status/initial-delivery-status.component';
import { FinalDeliveryStatusComponent } from './final-delivery-status/final-delivery-status.component';
import { LibraryFileListingComponent } from './library-file-listing/library-file-listing.component';
import { MirListComponent } from './mir-list/mir-list.component';
import { AddMirComponent } from './mir-list/add-mir/add-mir.component';
import { MirDetailsComponent } from './mir-list/mir-details/mir-details.component';
import { ProjectSitesComponent } from './project-sites/project-sites.component';
import { AddSiteComponent } from './project-sites/add-site/add-site.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { MonthlyReportDetailsComponent } from './monthly-report/monthly-report-details/monthly-report-details.component';
import { AddMonthlyReportComponent } from './monthly-report/add-monthly-report/add-monthly-report.component';
import { WorkProgressPictureComponent } from './monthly-report/work-progress-picture/work-progress-picture.component';
import { MonthlyRecomendationComponent } from './monthly-report/monthly-recomendation/monthly-recomendation.component';
import { MonthlyMeetingsComponent } from './monthly-report/monthly-meetings/monthly-meetings.component';
import { ReportStepComponent } from './monthly-report/report-step/report-step.component';
import { RfiListComponent } from './rfi-list/rfi-list.component';
import { StepDetailsComponent } from './monthly-report/report-step/step-details/step-details.component';
import { StepCreateComponent } from './monthly-report/report-step/step-create/step-create.component';

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
        path: 'project-status-report/:id',
        component: ProjectStatusReportComponent,
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
      {
        path: 'site_studies_designs_dashboard/:id',
        component: SiteStudiesDesignsDashboardComponent,
      },

      {
        path: 'project-files/:id',
        component: ProjectFilesComponent,
      },
      {
        path: 'add-files/:id',
        component: AddProjectFilesComponent,
      },
      {
        path: 'edit-files/:id',
        component: AddProjectFilesComponent,
      },

      {
        path: 'hse/:id',
        component: HseComponent,
      },
      {
        path: 'hse-create/:id',
        component: AddReportComponent,
      },
      {
        path: 'hse-edit/:id',
        component: AddReportComponent,
      },
      {
        path: 'hse-finding/:id',
        component: HseFindingComponent,
      },
      {
        path: 'hse-finding-create/:id',
        component: HseFindingCreateComponent,
      },
      {
        path: 'finding-details/:id',
        component: HseFindingDetailsComponent,
      },

      {
        path: 'initial-delivery-status/:id',
        component: InitialDeliveryStatusComponent,
      },
      {
        path: 'final-delivery-status/:id',
        component: FinalDeliveryStatusComponent,
      },

      {
        path: 'library-file-listing/:id',
        component: LibraryFileListingComponent,
      },

      {
        path: 'mir-list/:id',
        component: MirListComponent,
      },
      {
        path: 'add-mir/:id',
        component: AddMirComponent,
      },
      {
        path: 'mir-derails/:id',
        component: MirDetailsComponent,
      },

      {
        path: 'project-sites/:id',
        component: ProjectSitesComponent,
      },
      {
        path: 'add-project-site/:id',
        component: AddSiteComponent,
      },
      {
        path: 'edit-project-site/:id',
        component: AddSiteComponent,
      },

      {
        path: 'monthly_reports/:id',
        component: MonthlyReportComponent,
      },
      {
        path: 'add_monthly_report/:id',
        component: AddMonthlyReportComponent,
      },
      {
        path: 'monthly_report_details/:id',
        component: MonthlyReportDetailsComponent,
      },
      {
        path: 'monthly_work_progress/:id',
        component: WorkProgressPictureComponent,
      },
      {
        path: 'monthly_recommendation/:id',
        component: MonthlyRecomendationComponent,
      },
      {
        path: 'monthly_meetings/:id',
        component: MonthlyMeetingsComponent,
      },
      {
        path: 'monthly_report_step/:id',
        component: ReportStepComponent,
      },
      {
        path: 'rfi-list/:id',
        component: RfiListComponent,
      },
      {
        path: 'monthly_report_step_add/:id',
        component: StepCreateComponent,
      },
      {
        path: 'monthly_report_step_details/:id',
        component: StepDetailsComponent,
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
