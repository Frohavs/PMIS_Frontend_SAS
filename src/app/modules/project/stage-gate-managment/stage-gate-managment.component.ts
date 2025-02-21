import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-stage-gate-managment',
  templateUrl: './stage-gate-managment.component.html',
  styleUrl: './stage-gate-managment.component.scss'
})
export class StageGateManagementComponent implements OnInit {

  updateInfo: boolean;
  projectId: number;
  stageId: number;
  currentPhases: any[] = [];
  projectDetails: any;
  subPhaseId: number;
  isLoading: boolean;

  activeStep: number = 0;
  steps: any[] = [];

  kickOffModel: { notes: string } = { notes: '' };
  @ViewChild('kickOffSubmitModal') kickOffSubmitModal!: any;
  finalSubmitModel: { id: number, approvedNote: string } = { id: 0, approvedNote: '' };
  @ViewChild('finalSubmitModal') finalSubmitModal!: any;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.getInitialData();
  }

  getInitialData() {
    this.getInitialDeliverableSteps();
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      if (this.projectId) {
        this.getByID();
        this.getSubPhases();
      }
    });
  }


  getInitialDeliverableSteps() {
    this.lookupService.getInitialDeliverableSteps().subscribe(res => {
      this.steps = res.data;
      this.cdr.detectChanges();
    });
  }

  getByID() {
    this.stageGateManagementService.getByID(this.stageId).subscribe(res => {
      this.projectDetails = res.data;
      this.subPhaseId = this.projectDetails?.subPhaseId;
      if (this.projectDetails?.status == 'DeliverableChecklist') {
        this.activeStep = 1;
      }
      switch (this.projectDetails?.status) {
        case 'CreateCommittee':
          this.activeStep = 0;
          break;
        case 'DeliverableChecklist':
          this.activeStep = 1;
          break;
        case 'KickoffMeeting':
          this.activeStep = 2;
          break;
        case 'KickoffMeetingSubmit':
          this.activeStep = 3;
          break;
        case 'UploadDeliverableChecklist':
          this.activeStep = 4;
          break;
        case 'ReviewMeeting':
          this.activeStep = 5;
          break;
        case 'FinalReview':
          this.activeStep = 6;
          break;
        case 'CommitAcknowledgement':
          this.activeStep = 7;
          break;
        case 'FinalSubmit':
          this.activeStep = 8;
          break;
        case 'Completed':
          this.activeStep = 9;
          break;


        default:
          break;
      }
      this.cdr.detectChanges();
    });
  }

  getSubPhases() {
    if(this.currentPhases.length) return;
    this.stageGateManagementService.getSubPhases(this.projectId).subscribe(res => {
      this.currentPhases = res.data;
      this.cdr.detectChanges();
    });
  }

  getActiveClass(step: any) {
    if (this.activeStep >= step.id) {
      return 'active'

    }
    return '';
  }

  navigateTo(step: any) {
    if (this.activeStep < step.id) {
      if (step.id == 1) {
        this.navigateCreateCommittee();
      } else if (step.id == 2) {
        this.navigateDeliverableChecklist();
      } else if (step.id == 3) {
        this.navigateKickOffMeeting();
      } else if (step.id == 4) {
        this.navigateKickoffMeetingSubmit();
      } else if (step.id == 5) {
        this.navigateUploadDeliverableChecklist();
      } else if (step.id == 6) {
        this.navigateReview();
      } else if (step.id == 7) {
        this.navigateFinalReview();
      } else if (step.id == 8) {
        this.navigateCommitAcknowledgement();
      } else if (step.id == 9) {
        this.navigateFinalSubmit();
      }
    }
  }

  updateProjectInfo() {
    this.updateInfo = !this.updateInfo;
  }
  navigateCreateCommittee() {
    if (this.activeStep !== 0) {
      return
    }
    this.router.navigate([`projects/stage-gate-committees/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateDeliverableChecklist() {
    if (this.activeStep !== 1) {
      return
    }
    this.router.navigate(['projects/stage-deliverable-checklist' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId }
    });
  }
  navigateKickOffMeeting() {
    if (this.activeStep !== 2) {
      return
    }
    this.router.navigate(['projects/stage-kickoff' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId, coordinatorId: this.projectDetails?.coordinatorId }
    });
  }
  navigateKickOffStepPrint() {
    this.router.navigate(['projects/stage-kickoff-print' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateKickoffMeetingSubmit() {
    if (this.activeStep !== 3) {
      return
    }
    this.modalService.open(this.kickOffSubmitModal, this.modalConfig);
  }
  navigateUploadDeliverableChecklist() {
    if (this.activeStep !== 4) {
      return
    }
    this.router.navigate(['projects/stage-upload-deliverable-checklist' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId, coordinatorId: this.projectDetails?.coordinatorId }
    });
  }
  navigateReview() {
    if (this.activeStep !== 5) {
      return
    }
    this.router.navigate(['projects/stage-review-meeting' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId }
    });
  }
  navigateReviewPrint() {
    this.router.navigate(['projects/stage-review-meeting-print' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId }
    });
  }
  navigateFinalReview() {
    if (this.activeStep !== 6) {
      return
    }
    this.router.navigate(['projects/stage-final-review' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId }
    });
  }
  navigateFinalReviewPrint() {
    this.router.navigate(['projects/stage-final-review-print' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId }
    });
  }
  navigateCommitAcknowledgement() {
    if (this.activeStep !== 7) {
      return
    }
    this.router.navigate(['projects/stage-commit-acknowledgement' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId, subPhaseId: this.subPhaseId }
    });
  }
  navigateFinalSubmit() {
    if (this.activeStep !== 8) {
      return
    }
    this.modalService.open(this.finalSubmitModal, this.modalConfig);

  }
  // Method to check if a step is active
  isStepActive(stepNumber: number): boolean {
    return stepNumber <= this.activeStep;
  }

  navigatePhase(id: number) {
    const url = `projects/stage-gate-management/${this.projectId}?stageId=${id}`;
    this.router.navigateByUrl(url);
  }

  onKickOffSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      myForm.controls['notes'].markAsTouched();
      return;
    }
    this.isLoading = true;
    this.stageGateManagementService.submitKickOff({ id: this.stageId, note: this.kickOffModel.notes }).subscribe((res) => {
      this.isLoading = false;
      this.modalService.dismissAll();
      this.getByID();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Submitted successfully!' });
    }, () => {
      this.isLoading = false;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  onFinalSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      myForm.controls['approvedNote'].markAsTouched();
      return;
    }
    this.isLoading = true;
    this.stageGateManagementService.postFinalSubmit({ id: +this.stageId, approvedNote: this.finalSubmitModel.approvedNote }).subscribe((res) => {
      this.isLoading = false;
      this.modalService.dismissAll();
      this.getByID();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Submitted successfully!' });
      setTimeout(() => {
        this.router.navigate(['stage-gate-management/overview']);
      }, 1500);
      setTimeout(() => {
      }, 1000);
    }, () => {
      this.isLoading = false;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
