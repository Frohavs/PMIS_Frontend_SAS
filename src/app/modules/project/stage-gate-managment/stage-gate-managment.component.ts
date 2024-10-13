import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-stage-gate-managment',
  templateUrl: './stage-gate-managment.component.html',
  styleUrl: './stage-gate-managment.component.scss'
})
export class StageGateManagementComponent implements OnInit {

  updateInfo: boolean;
  projectId: number;
  projectDetails: any;
  isLoading: boolean;

  // Current active step (for example, step 3 is active)
  activeStep: number = 1;

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
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.projectsService.getByID(this.projectId).subscribe(res => {
          this.projectDetails = res.data;
          this.cdr.detectChanges();
        });
      }
    });
  }

  updateProjectInfo() {
    this.updateInfo = !this.updateInfo;
  }
  navigateCreateCommittee() {
    this.router.navigateByUrl('projects/stage-gate-committees' + `/${this.projectId}`);
  }
  navigateDeliverableChecklist() {
    this.router.navigateByUrl('projects/stage-deliverable-checklist' + `/${this.projectId}`);
  }
  navigateKickOffMeeting() {
    this.router.navigateByUrl('projects/stage-kickoff' + `/${this.projectId}`);
  }
  navigateKickoffMeetingSubmit() {
    this.router.navigateByUrl('projects/stage-kickoff-submit' + `/${this.projectId}`);
  }
  navigateUploadDeliverableChecklist() {
    this.router.navigateByUrl('projects/stage-upload-deliverable-checklist' + `/${this.projectId}`);
  }
  navigateReview() {
    this.router.navigateByUrl('projects/stage-review' + `/${this.projectId}`);
  }
  navigateFinalReview() {
    this.router.navigateByUrl('projects/stage-final-review' + `/${this.projectId}`);
  }
  // Method to check if a step is active
  isStepActive(stepNumber: number): boolean {
    return stepNumber <= this.activeStep;
  }
}
