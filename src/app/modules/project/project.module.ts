import { UploadDeliverableChecklistComponent } from './stage-gate-managment/upload-deliverable-checklist/upload-deliverable-checklist.component';
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
import { AddConsultantEvalComponent } from './partner-evaluation/consultant-evaluation/add-consultant-eval/add-consultant-eval.component';
import { AddContractorEvalComponent } from './partner-evaluation/contractor-evaluation/add-contractor-eval/add-contractor-eval.component';
import { ConsultantEvalDetailsComponent } from './partner-evaluation/consultant-evaluation/consultant-eval-details/consultant-eval-details.component';
import { ContractorEvalDetailsComponent } from './partner-evaluation/contractor-evaluation/contractor-eval-details/contractor-eval-details.component';
import { RiskManagementComponent } from './risk-management/risk-management.component';
import { AddRiskComponent } from './risk-management/add-risk/add-risk.component';
import { RiskDetailsComponent } from './risk-management/risk-details/risk-details.component';
import { InitialDeliveryListComponent } from './initial-delivery-list/initial-delivery-list.component';
import { AddDeliveryListComponent } from './initial-delivery-list/add-delivery-list/add-delivery-list.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { FactoryComponent } from './factory/factory.component';
import { AddFactoryComponent } from './factory/add-factory/add-factory.component';
import { FactoryDetailsComponent } from './factory/factory-details/factory-details.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { StageGateManagementComponent } from './stage-gate-managment/stage-gate-managment.component';
import { CreateCommitteeComponent } from './stage-gate-managment/create-commitee/create-commitee.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DeliverableChecklistComponent } from './stage-gate-managment/deliverable-checklist/deliverable-checklist.component';
import { KickoffMeetingComponent } from './stage-gate-managment/kickoff-meeting/kickoff-meeting.component';
import { KickoffMeetingSubmitComponent } from './stage-gate-managment/kickoff-meeting-submit/kickoff-meeting-submit.component';
import { KickoffPrintComponent } from './stage-gate-managment/kickoff-meeting/kickoff-print/kickoff-print.component';
import { ReviewMeetingComponent } from './stage-gate-managment/review-meeting/review-meeting.component';
import { PrintReviewComponent } from './stage-gate-managment/review-meeting/print-review/print-review.component';
import { FinalReviewComponent } from './stage-gate-managment/final-review/final-review.component';
import { CommitAcknowledgementComponent } from './stage-gate-managment/commit-acknowledgement/commit-acknowledgement.component';
import { FinalReviewPrintComponent } from './stage-gate-managment/final-review/final-review-print/final-review-print.component';
import { ProjectStatusReportComponent } from './update-project-info/project-status-report/project-status-report.component';
import { SiteStudiesDesignsDashboardComponent } from './site-studies-designs-dashboard/site-studies-designs-dashboard.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { AddProjectFilesComponent } from './project-files/add-project-files/add-project-files.component';
import { ProjectFilesTreeComponent } from './project-files/project-files-tree/project-files-tree.component';
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
import { NgApexchartsModule } from 'ng-apexcharts';
import { AddRfiComponent } from './rfi-list/add-rfi/add-rfi.component';
import { RfiDetailsComponent } from './rfi-list/rfi-details/rfi-details.component';
import { AddVisitComponent } from './visit-form/add-visit/add-visit.component';
import { VisitDetailsComponent } from './visit-form/visit-details/visit-details.component';
import { VisitFormComponent } from './visit-form/visit-form.component';
import { FormTableComponent } from './visit-form/form-table/form-table.component';


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
    ProjectStatusReportComponent,
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
    AddConsultantEvalComponent,
    ConsultantEvalDetailsComponent,

    ContractorEvaluationComponent,
    AddContractorEvalComponent,
    ContractorEvalDetailsComponent,

    RiskManagementComponent,
    AddRiskComponent,
    RiskDetailsComponent,

    InitialDeliveryListComponent,
    AddDeliveryListComponent,

    FactoryComponent,
    AddFactoryComponent,
    FactoryDetailsComponent,

    StageGateManagementComponent,
    CreateCommitteeComponent,
    DeliverableChecklistComponent,
    KickoffMeetingComponent,
    KickoffPrintComponent,
    KickoffMeetingSubmitComponent,
    UploadDeliverableChecklistComponent,
    ReviewMeetingComponent,
    PrintReviewComponent,
    FinalReviewComponent,
    FinalReviewPrintComponent,
    CommitAcknowledgementComponent,

    SiteStudiesDesignsDashboardComponent,

    ProjectFilesComponent,
    AddProjectFilesComponent,
    ProjectFilesTreeComponent,

    HseComponent,
    AddReportComponent,
    HseFindingComponent,
    HseFindingCreateComponent,
    HseFindingDetailsComponent,

    InitialDeliveryStatusComponent,
    FinalDeliveryStatusComponent,

    LibraryFileListingComponent,

    MirListComponent,
    AddMirComponent,
    MirDetailsComponent,

    ProjectSitesComponent,
    AddSiteComponent,

    MonthlyReportComponent,
    AddMonthlyReportComponent,
    MonthlyReportDetailsComponent,
    WorkProgressPictureComponent,
    MonthlyRecomendationComponent,
    MonthlyMeetingsComponent,
    ReportStepComponent,
    StepCreateComponent,
    StepDetailsComponent,
    
    RfiListComponent,
    AddRfiComponent,
    RfiDetailsComponent,

    VisitFormComponent,
    AddVisitComponent,
    VisitDetailsComponent,
    FormTableComponent
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
    NgxCurrencyDirective,
    AngularSignaturePadModule,
    GoogleMapsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgApexchartsModule

  ]
})
export class ProjectModule { }
