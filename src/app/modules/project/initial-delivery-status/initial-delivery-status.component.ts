import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-initial-delivery-status',
  templateUrl: './initial-delivery-status.component.html',
  styleUrl: './initial-delivery-status.component.scss'
})
export class InitialDeliveryStatusComponent implements OnInit {

  projectId: number;

  projectDetails: any;
  subPhaseId: number;
  isLoading: boolean;

  updateForm: FormGroup;

  activeStep: number = 1;
  steps: any[] = [
    {
      "id": 1,
      "name": "Create Committee"
    },
    {
      "id": 2,
      "name": "Track Notes"
    },
    {
      "id": 3,
      "name": "Provide Contractor with notes"
    },
    {
      "id": 4,
      "name": "Complete Notes"
    },
    {
      "id": 5,
      "name": "Sign Contract"
    }
  ];

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
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.initStatusForm();
    this.getInitialData();
    this.valueChangesListener();
  }
  initStatusForm() {
    this.updateForm = this.fb.group({
      id: this.projectId,
      createCommittee: [false],
      createCommitteeDate: ['', [Validators.required]],
      createCommitteeFile: ['', [Validators.required]],
      trackNotes: [false],
      trackNotesDate: ['', [Validators.required]],
      trackNotesFile: ['', [Validators.required]],
      provideContractorNotes: [false],
      provideContractorNotesDate: ['', [Validators.required]],
      provideContractorNotesFile: ['', [Validators.required]],
      completeNotes: [false],
      completeNotesDate: ['', [Validators.required]],
      completeNotesFile: ['', [Validators.required]],
      signContract: [false],
      signContractDate: ['', [Validators.required]],
      signContractFile: ['', [Validators.required]],
    });
  }

  valueChangesListener() {
    this.updateForm.get('claimCheck')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('approved')?.disable();
        this.updateForm.get('approved')?.setValue(false);
        this.updateForm.get('approvedDate')?.disable();
        this.updateForm.get('claimCheckDate')?.setValue(null);
        this.updateForm.get('approvedDate')?.setValue(null);
      } else {
        this.updateForm.get('approved')?.enable();
        this.updateForm.get('approvedDate')?.enable();
      }
    });
    this.updateForm.get('approved')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('isExchangeorder')?.disable();
        this.updateForm.get('isExchangeorder')?.setValue(false);
        this.updateForm.get('exchangeOrderReferenceNumber')?.disable();
        this.updateForm.get('exchangeOrderReferenceNumber')?.setValue(null);
      } else {
        this.updateForm.get('isExchangeorder')?.enable();
        this.updateForm.get('exchangeOrderReferenceNumber')?.enable();
        this.updateForm.get('exchangeOrderReferenceNumber')?.setValue(null);
      }
    });
    this.updateForm.get('isExchangeorder')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('isPaymentOrderRef')?.disable();
        this.updateForm.get('isPaymentOrderRef')?.setValue(false);
        this.updateForm.get('paymentOrderReferenceNumber')?.disable();
        this.updateForm.get('paymentOrderReferenceNumber')?.setValue(null);
      } else {
        this.updateForm.get('isPaymentOrderRef')?.enable();
        this.updateForm.get('paymentOrderReferenceNumber')?.enable();
        this.updateForm.get('paymentOrderReferenceNumber')?.setValue(null);
      }
    });
    this.updateForm.get('isPaymentOrderRef')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('isPaymentOrder')?.disable();
        this.updateForm.get('isPaymentOrder')?.setValue(false);
        this.updateForm.get('paymentOrder')?.disable();
        this.updateForm.get('paymentOrder')?.setValue(null);
      } else {
        this.updateForm.get('isPaymentOrder')?.enable();
        this.updateForm.get('paymentOrder')?.enable();
        this.updateForm.get('paymentOrder')?.setValue(null);
      }
    });
    this.updateForm.get('isPaymentOrder')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('completed')?.disable();
        this.updateForm.get('completed')?.setValue(false);
      } else {
        this.updateForm.get('completed')?.enable();
        this.updateForm.get('completed')?.setValue(false);
      }
    });
  }

  getInitialData() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.getByID();
    });
  }

  getByID() {
    this.stageGateManagementService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      debugger
      // this.subPhaseId = this.projectDetails?.subPhaseId;
      // if (this.projectDetails?.status == 'DeliverableChecklist') {
      //   this.activeStep = 1;
      // }
      // switch (this.projectDetails?.status) {
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

