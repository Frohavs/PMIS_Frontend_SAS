import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DeliveryStatusService } from 'src/app/services/delivery-status.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-initial-delivery-status',
  templateUrl: './initial-delivery-status.component.html',
  styleUrl: './initial-delivery-status.component.scss'
})
export class InitialDeliveryStatusComponent implements OnInit {

  projectId: number;
  deliveryStatusId: number;

  statusDetails: any;
  subPhaseId: number;
  isLoading: boolean;

  updateForm: FormGroup;

  activeStep: number = 1;
  steps: any[] = [];

  statusModel: { status: boolean } = { status: true };
  @ViewChild('UpdateStatusModal') UpdateStatusModal!: any;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-850px',
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private fb: FormBuilder,
    private deliveryStatusService: DeliveryStatusService,
  ) { }

  ngOnInit(): void {
    this.lookupService.getIntialDeliveryStatusSteps().subscribe(res => {
      this.steps = res.data;
      this.cdr.detectChanges();
    });
    this.getInitialData();
    this.initStatusForm();
    this.valueChangesListener();
  }
  initStatusForm() {
    this.updateForm = this.fb.group({
      id: this.projectId,

      createCommittee: [false],
      createCommitteeDate: [{value: '', disabled: true}, [Validators.required]],
      createCommitteeFile: [{value: '', disabled: true}, [Validators.required]],

      trackNotes: [{value: false, disabled: true}],
      notApplied: [{value: false, disabled: true}],
      trackNotesDate: [{value: '', disabled: true}, [Validators.required]],
      trackNotesFile: [{value: '', disabled: true}, [Validators.required]],

      provideContractorNotes: [{value: false, disabled: true}],
      provideContractorNotesDate: [{value: '', disabled: true}, [Validators.required]],
      provideContractorNotesFile: [{value: '', disabled: true}, [Validators.required]],

      completeNotes: [{value: false, disabled: true}],
      completeNotesDate: [{value: '', disabled: true}, [Validators.required]],
      completeNotesFile: [{value: '', disabled: true}, [Validators.required]],

      signContract: [{value: false, disabled: true}],
      signContractDate: [{value: '', disabled: true}, [Validators.required]],
      signContractFile: [{value: '', disabled: true}, [Validators.required]],
    });
  }

  valueChangesListener() {
    this.updateForm.get('createCommittee')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('trackNotes')?.disable();
        this.updateForm.get('trackNotes')?.setValue(false);
        this.updateForm.get('notApplied')?.disable();
        this.updateForm.get('notApplied')?.setValue(false);
        this.updateForm.get('trackNotesDate')?.disable();
        this.updateForm.get('trackNotesDate')?.setValue(null);
        this.updateForm.get('trackNotesFile')?.disable();
        this.updateForm.get('trackNotesFile')?.setValue(null);
      } else {
        this.updateForm.get('trackNotes')?.enable();
        this.updateForm.get('notApplied')?.enable();
        this.updateForm.get('trackNotesDate')?.enable();
        this.updateForm.get('trackNotesFile')?.enable();
      }
    });
    this.updateForm.get('trackNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('provideContractorNotes')?.disable();
        this.updateForm.get('provideContractorNotes')?.setValue(false);
        this.updateForm.get('provideContractorNotesDate')?.disable();
        this.updateForm.get('provideContractorNotesDate')?.setValue(null);
        this.updateForm.get('provideContractorNotesFile')?.disable();
        this.updateForm.get('provideContractorNotesFile')?.setValue(null);
      } else {
        this.updateForm.get('provideContractorNotes')?.enable();
        this.updateForm.get('provideContractorNotesDate')?.enable();
        this.updateForm.get('provideContractorNotesFile')?.enable();
      }
    });
    this.updateForm.get('notApplied')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('completeNotes')?.disable();
        this.updateForm.get('completeNotes')?.setValue(false);
        this.updateForm.get('completeNotesDate')?.disable();
        this.updateForm.get('completeNotesDate')?.setValue(null);
        this.updateForm.get('completeNotesFile')?.disable();
        this.updateForm.get('completeNotesFile')?.setValue(null);

        this.updateForm.get('provideContractorNotes')?.disable();
        this.updateForm.get('provideContractorNotes')?.setValue(false);
        this.updateForm.get('provideContractorNotesDate')?.disable();
        this.updateForm.get('provideContractorNotesDate')?.setValue(null);
        this.updateForm.get('provideContractorNotesFile')?.disable();
        this.updateForm.get('provideContractorNotesFile')?.setValue(null);

        this.updateForm.get('signContract')?.disable();
        this.updateForm.get('signContract')?.setValue(false);
        this.updateForm.get('signContractDate')?.disable();
        this.updateForm.get('signContractDate')?.setValue(null);
        this.updateForm.get('signContractFile')?.disable();
        this.updateForm.get('signContractFile')?.setValue(null);

      } else {
        this.updateForm.get('completeNotes')?.disable();
        this.updateForm.get('completeNotes')?.setValue(false);
        this.updateForm.get('completeNotesDate')?.disable();
        this.updateForm.get('completeNotesDate')?.setValue(null);
        this.updateForm.get('completeNotesFile')?.disable();
        this.updateForm.get('completeNotesFile')?.setValue(null);

        this.updateForm.get('provideContractorNotes')?.disable();
        this.updateForm.get('provideContractorNotes')?.setValue(false);
        this.updateForm.get('provideContractorNotesDate')?.disable();
        this.updateForm.get('provideContractorNotesDate')?.setValue(null);
        this.updateForm.get('provideContractorNotesFile')?.disable();
        this.updateForm.get('provideContractorNotesFile')?.setValue(null);

        this.updateForm.get('signContract')?.enable();
        this.updateForm.get('signContractDate')?.enable();
        this.updateForm.get('signContractFile')?.enable();
      }
    });
    this.updateForm.get('provideContractorNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('completeNotes')?.disable();
        this.updateForm.get('completeNotes')?.setValue(false);
        this.updateForm.get('completeNotesDate')?.disable();
        this.updateForm.get('completeNotesDate')?.setValue(null);
        this.updateForm.get('completeNotesFile')?.disable();
        this.updateForm.get('completeNotesFile')?.setValue(null);
      } else {
        this.updateForm.get('completeNotes')?.enable();
        this.updateForm.get('completeNotesDate')?.enable();
        this.updateForm.get('completeNotesFile')?.enable();
      }
    });
    this.updateForm.get('completeNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('signContract')?.disable();
        this.updateForm.get('signContract')?.setValue(false);
        this.updateForm.get('signContractDate')?.disable();
        this.updateForm.get('signContractDate')?.setValue(null);
        this.updateForm.get('signContractFile')?.disable();
        this.updateForm.get('signContractFile')?.setValue(null);
      } else {
        this.updateForm.get('signContract')?.enable();
        this.updateForm.get('signContractDate')?.enable();
        this.updateForm.get('signContractFile')?.enable();
      }
    });
  }

  getInitialData() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.deliveryStatusId = +params['statusId'];
      setTimeout(() => {
        this.getByID();
      }, 1000);
    });
  }

  getByID() {
    this.deliveryStatusService.getDeliveryStatusById(this.projectId, 1).subscribe(res => {
      debugger
      this.statusDetails = res.data;
      // this.subPhaseId = this.statusDetails?.subPhaseId;
      // if (this.statusDetails?.status == 'DeliverableChecklist') {
      //   this.activeStep = 1;
      // }
      // switch (this.statusDetails?.status) {
      //   case 'formCommittee':
      //     this.activeStep = 0;
      //     break;
      //   case 'trackNotes':
      //     this.activeStep = 1;
      //     break;
      //   case 'provideContractorNotes':
      //     this.activeStep = 2;
      //     break;
      //   case 'finishNotes':
      //     this.activeStep = 3;
      //     break;
      //   case 'SignContract':
      //     this.activeStep = 4;
      //     break;
      //   default:
      //     break;
      // }
      this.cdr.detectChanges();
    });
  }

  getActiveClass(step: any) {
    if (this.activeStep >= step.id) {
      return 'active'

    }
    return '';
  }

  openStatusModal() {
    this.modalService.open(this.UpdateStatusModal, this.modalConfig);
  }
  onSubmitStatus() {
    // const val = this.updateForm.value
    const payload = {
      ...this.updateForm.value
    }
    delete payload.isClaimRegistration
    delete payload.claimRegistrationCheckDate
    // this.invoiceService.UpdateInvoiceStatus(payload).subscribe(res => {

    //   this.modalService.dismissAll();
    //   this.showAlert({ icon: 'success', title: 'Success!', text: 'Status Updated successfully!' });
    //   this.getInvoiceDetails();
    //   this.cdr.detectChanges();
    // }, (error) => {
    //   this.modalService.dismissAll()
    //   this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    // });
  }


  navigateCreateCommittee() {
    if (this.activeStep !== 0) {
      return
    }

  }
  navigateDeliverableChecklist() {
    if (this.activeStep !== 1) {
      return
    }

  }
  navigateKickOffMeeting() {
    if (this.activeStep !== 2) {
      return
    }

  }
  navigateKickOffStepPrint() {

  }
  navigateKickoffMeetingSubmit() {
    if (this.activeStep !== 3) {
      return
    }
  }
  navigateUploadDeliverableChecklist() {
    if (this.activeStep !== 4) {
      return
    }

  }
  navigateReview() {
    if (this.activeStep !== 5) {
      return
    }
  }

  navigateFinalReview() {
    if (this.activeStep !== 6) {
      return
    }
  }
  navigateFinalReviewPrint() {

  }
  navigateCommitAcknowledgement() {
    if (this.activeStep !== 7) {
      return
    }

  }
  navigateFinalSubmit() {
    if (this.activeStep !== 8) {
      return
    }


  }
  // Method to check if a step is active
  isStepActive(stepNumber: number): boolean {
    return stepNumber <= this.activeStep;
  }

  navigatePhase(id: number) {

  }

  onKickOffSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      myForm.controls['notes'].markAsTouched();
      return;
    }

  }

  onFinalSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      myForm.controls['approvedNote'].markAsTouched();
      return;
    }
    this.isLoading = true;

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

