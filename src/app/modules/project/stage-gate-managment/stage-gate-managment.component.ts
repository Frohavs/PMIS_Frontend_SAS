import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
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

  kickOffModel: { notes: string } = { notes: '' };
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('kickOffSubmitModal') kickOffSubmitModal!: any;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * @constructor
   *
   * @param {Router} router - Angular's Router to navigate between pages
   * @param {ChangeDetectorRef} cdr - Angular's ChangeDetectorRef to detect changes and update the component
   * @param {NgbModal} modalService - Angular's NgbModal service to open modals
   * @param {ActivatedRoute} activatedRoute - Angular's ActivatedRoute to get route parameters and query params
   * @param {StageGateManagementService} stageGateManagementService - Service to interact with the stage gate management API
   */
  /******  ebc4ca84-2223-4707-8876-24b46d8d35c3  *******/
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
    this.stageGateManagementService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      if (this.projectDetails?.status == 'DeliverableChecklist') {
        this.activeStep = 1;
      }
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
  navigateKickoffMeetingSubmit() {
    // this.router.navigate(['projects/stage-kickoff-submit' + `/${this.projectId}`],{
    //   queryParams: { stageId: this.stageId }
    // });
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

    this.stageGateManagementService.submitKickOff({ notes: this.kickOffModel.notes }).subscribe((res) => {
      this.isLoading = false;
      this.modalService.dismissAll();
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
