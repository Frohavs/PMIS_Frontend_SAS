import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
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
  projectDetails: any;
  isLoading: boolean;

  activeStep: number = 0;
  steps: string[] = [
    'Create Committees',
    'Deliverable Checklist',
    'Kickoff Meeting',
    'Kickoff Meeting Submit',
    'Upload Deliverable Checklist',
    'Review Meeting',
    'Final Review'
  ];

  kickOffModel: { notes: string } = { notes: '' };
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('kickOffSubmitModal') kickOffSubmitModal!: any;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
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
        this.getByID();
      }
    });
  }

  getByID() {
    this.stageGateManagementService.getByID(this.stageId).subscribe(res => {
      this.projectDetails = res.data;
      if (this.projectDetails?.status == 'DeliverableChecklist') {
        this.activeStep = 1;
      }
      switch (this.projectDetails?.status) {
        case 'CreateCommittees':
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


        default:
          break;
      }
      debugger
      this.cdr.detectChanges();
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
    this.router.navigate(['projects/stage-deliverable-checklist' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateKickOffMeeting() {
    this.router.navigate(['projects/stage-kickoff' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateKickOffStepPrint() {
    this.router.navigate(['projects/stage-kickoff-print' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateKickoffMeetingSubmit() {
    this.modalService.open(this.kickOffSubmitModal, this.modalConfig);
  }
  navigateUploadDeliverableChecklist() {
    this.router.navigate(['projects/stage-upload-deliverable-checklist' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateReview() {
    this.router.navigate(['projects/stage-review' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  navigateFinalReview() {
    this.router.navigate(['projects/stage-final-review' + `/${this.projectId}`], {
      queryParams: { stageId: this.stageId }
    });
  }
  // Method to check if a step is active
  isStepActive(stepNumber: number): boolean {
    return stepNumber <= this.activeStep;
  }

  onKickOffSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      myForm.controls['notes'].markAsTouched();
      return;
    }
    debugger
    this.isLoading = true;
    this.stageGateManagementService.submitKickOff({ id: this.stageId,note: this.kickOffModel.notes }).subscribe((res) => {
      this.isLoading = false;
      this.modalService.dismissAll();
      this.getByID();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Submitted successfully!' });
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
