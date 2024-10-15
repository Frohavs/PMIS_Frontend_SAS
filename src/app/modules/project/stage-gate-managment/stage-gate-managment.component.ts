import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';

@Component({
  selector: 'app-stage-gate-managment',
  templateUrl: './stage-gate-managment.component.html',
  styleUrl: './stage-gate-managment.component.scss'
})
export class StageGateManagementComponent implements OnInit {

  updateInfo: boolean;
  projectId: number;
  stageId: number;
  projectDetails: any;
  isLoading: boolean;

  // Current active step (for example, step 3 is active)
  activeStep: number = 0;

  // Define your steps
  steps: string[] = [
    'Create Committees',
    'Deliverable Checklist',
    'Kickoff Meeting',
    'Kickoff Meeting Submit',
    'Upload Deliverable Checklist',
    'Review Meeting',
    'Final Review'
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      if (this.projectId) {
        this.stageGateManagementService.getByID(this.projectId).subscribe(res => {
          this.projectDetails = res.data;
          if (this.projectDetails?.status == 'DeliverableChecklist') {
            this.activeStep = 1;
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  updateProjectInfo() {
    this.updateInfo = !this.updateInfo;
  }
  navigateCreateCommittee() {
    this.router.navigate([`projects/stage-gate-committees/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateDeliverableChecklist() {
    this.router.navigate(['projects/stage-deliverable-checklist' + `/${this.projectId}`],{
      queryParams: { stageId: this.stageId }
    });
  }
  navigateKickOffMeeting() {
    this.router.navigate(['projects/stage-kickoff' + `/${this.projectId}`],{
      queryParams: { stageId: this.stageId }
    });
  }
  navigateKickoffMeetingSubmit() {
    this.router.navigate(['projects/stage-kickoff-submit' + `/${this.projectId}`],{
      queryParams: { stageId: this.stageId }
    });
  }
  navigateUploadDeliverableChecklist() {
    this.router.navigate(['projects/stage-upload-deliverable-checklist' + `/${this.projectId}`],{
      queryParams: { stageId: this.stageId }
    });
  }
  navigateReview() {
    this.router.navigate(['projects/stage-review' + `/${this.projectId}`],{
      queryParams: { stageId: this.stageId }
    });
  }
  navigateFinalReview() {
    this.router.navigate(['projects/stage-final-review' + `/${this.projectId}`],{
      queryParams: { stageId: this.stageId }
    });
  }
  // Method to check if a step is active
  isStepActive(stepNumber: number): boolean {
    return stepNumber <= this.activeStep;
  }
}
