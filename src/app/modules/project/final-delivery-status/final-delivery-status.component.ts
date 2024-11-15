import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DeliveryStatusService } from 'src/app/services/delivery-status.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-final-delivery-status',
  templateUrl: './final-delivery-status.component.html',
  styleUrl: './final-delivery-status.component.scss'
})
export class FinalDeliveryStatusComponent implements OnInit {

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
    this.lookupService.getFinalDeliveryStatusSteps().subscribe(res => {
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

      finalDelivery: [false],
      finalDeliveryDate: [{ value: '', disabled: true }, [Validators.required]],
      finalDeliveryFile: [{ value: '', disabled: true }, [Validators.required]],

      finalDeliveryNotes: [{ value: false, disabled: true }],
      notApplied: [{ value: false, disabled: true }],
      finalDeliveryNotesDate: [{ value: '', disabled: true }, [Validators.required]],
      finalDeliveryNotesFile: [{ value: '', disabled: true }, [Validators.required]],

      supplyContractor: [{ value: false, disabled: true }],
      supplyContractorDate: [{ value: '', disabled: true }, [Validators.required]],
      supplyContractorFile: [{ value: '', disabled: true }, [Validators.required]],

      finishNote: [{ value: false, disabled: true }],
      finishNoteDate: [{ value: '', disabled: true }, [Validators.required]],
      finishNoteFile: [{ value: '', disabled: true }, [Validators.required]],

      signNote: [{ value: false, disabled: true }],
      signNoteDate: [{ value: '', disabled: true }, [Validators.required]],
      signNoteFile: [{ value: '', disabled: true }, [Validators.required]],

      warrantyRelease: [{ value: false, disabled: true }],
      warrantyReleaseDate: [{ value: '', disabled: true }, [Validators.required]],
      warrantyReleaseFile: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  valueChangesListener() {
    this.updateForm.get('finalDelivery')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('finalDeliveryNotes')?.disable();
        this.updateForm.get('finalDeliveryNotes')?.setValue(false);
        this.updateForm.get('notApplied')?.disable();
        this.updateForm.get('notApplied')?.setValue(false);
        this.updateForm.get('finalDeliveryNotesDate')?.disable();
        this.updateForm.get('finalDeliveryNotesDate')?.setValue(null);
        this.updateForm.get('finalDeliveryNotesFile')?.disable();
        this.updateForm.get('finalDeliveryNotesFile')?.setValue(null);
      } else {
        this.updateForm.get('finalDeliveryNotes')?.enable();
        this.updateForm.get('notApplied')?.enable();
        this.updateForm.get('finalDeliveryNotesDate')?.enable();
        this.updateForm.get('finalDeliveryNotesFile')?.enable();
      }
    });
    this.updateForm.get('finalDeliveryNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('supplyContractor')?.disable();
        this.updateForm.get('supplyContractor')?.setValue(false);
        this.updateForm.get('supplyContractorDate')?.disable();
        this.updateForm.get('supplyContractorDate')?.setValue(null);
        this.updateForm.get('supplyContractorFile')?.disable();
        this.updateForm.get('supplyContractorFile')?.setValue(null);
      } else {
        this.updateForm.get('supplyContractor')?.enable();
        this.updateForm.get('supplyContractorDate')?.enable();
        this.updateForm.get('supplyContractorFile')?.enable();
      }
    });
    this.updateForm.get('notApplied')?.valueChanges.subscribe((value) => {
      if (!value) {

        this.updateForm.get('finalDeliveryNotesDate')?.enable();
        this.updateForm.get('finalDeliveryNotesDate')?.setValue(null);
        this.updateForm.get('finalDeliveryNotesFile')?.enable();
        this.updateForm.get('finalDeliveryNotesFile')?.setValue(null);

        this.updateForm.get('supplyContractor')?.disable();
        this.updateForm.get('supplyContractor')?.setValue(false);
        this.updateForm.get('supplyContractorDate')?.disable();
        this.updateForm.get('supplyContractorDate')?.setValue(null);
        this.updateForm.get('supplyContractorFile')?.disable();
        this.updateForm.get('supplyContractorFile')?.setValue(null);

        this.updateForm.get('finishNote')?.disable();
        this.updateForm.get('finishNote')?.setValue(false);
        this.updateForm.get('finishNoteDate')?.disable();
        this.updateForm.get('finishNoteDate')?.setValue(null);
        this.updateForm.get('finishNoteFile')?.disable();
        this.updateForm.get('finishNoteFile')?.setValue(null);

        this.updateForm.get('warrantyRelease')?.disable();
        this.updateForm.get('warrantyRelease')?.setValue(false);
        this.updateForm.get('warrantyReleaseDate')?.disable();
        this.updateForm.get('warrantyReleaseDate')?.setValue(null);
        this.updateForm.get('warrantyReleaseFile')?.disable();
        this.updateForm.get('warrantyReleaseFile')?.setValue(null);
      } else {
        this.updateForm.get('supplyContractor')?.disable();
        this.updateForm.get('supplyContractor')?.setValue(false);
        this.updateForm.get('supplyContractorDate')?.disable();
        this.updateForm.get('supplyContractorDate')?.setValue(null);
        this.updateForm.get('supplyContractorFile')?.disable();
        this.updateForm.get('supplyContractorFile')?.setValue(null);

        this.updateForm.get('finishNote')?.disable();
        this.updateForm.get('finishNote')?.setValue(false);
        this.updateForm.get('finishNoteDate')?.disable();
        this.updateForm.get('finishNoteDate')?.setValue(null);
        this.updateForm.get('finishNoteFile')?.disable();
        this.updateForm.get('finishNoteFile')?.setValue(null);

        this.updateForm.get('finalDeliveryNotesDate')?.disable();
        this.updateForm.get('finalDeliveryNotesDate')?.setValue(false);
        this.updateForm.get('finalDeliveryNotesFile')?.disable();
        this.updateForm.get('finalDeliveryNotesFile')?.setValue(null);

        this.updateForm.get('signNote')?.enable();
        this.updateForm.get('signNoteDate')?.enable();
        this.updateForm.get('signNoteFile')?.enable();

        this.updateForm.get('warrantyRelease')?.enable();
        this.updateForm.get('warrantyReleaseDate')?.enable();
        this.updateForm.get('warrantyReleaseFile')?.enable();

      }
    });
    this.updateForm.get('supplyContractor')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('finishNote')?.disable();
        this.updateForm.get('finishNote')?.setValue(false);
        this.updateForm.get('finishNoteDate')?.disable();
        this.updateForm.get('finishNoteDate')?.setValue(null);
        this.updateForm.get('finishNoteFile')?.disable();
        this.updateForm.get('finishNoteFile')?.setValue(null);
      } else {
        this.updateForm.get('finishNote')?.enable();
        this.updateForm.get('finishNoteDate')?.enable();
        this.updateForm.get('finishNoteFile')?.enable();
      }
    });
    this.updateForm.get('finishNote')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('signNote')?.disable();
        this.updateForm.get('signNote')?.setValue(false);
        this.updateForm.get('signNoteDate')?.disable();
        this.updateForm.get('signNoteDate')?.setValue(null);
        this.updateForm.get('signNoteFile')?.disable();
        this.updateForm.get('signNoteFile')?.setValue(null);
      } else {
        this.updateForm.get('signNote')?.enable();
        this.updateForm.get('signNoteDate')?.enable();
        this.updateForm.get('signNoteFile')?.enable();
      }
    });
    this.updateForm.get('signNote')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('warrantyRelease')?.disable();
        this.updateForm.get('warrantyRelease')?.setValue(false);
        this.updateForm.get('warrantyReleaseDate')?.disable();
        this.updateForm.get('warrantyReleaseDate')?.setValue(null);
        this.updateForm.get('warrantyReleaseFile')?.disable();
        this.updateForm.get('warrantyReleaseFile')?.setValue(null);
      } else {
        this.updateForm.get('warrantyRelease')?.enable();
        this.updateForm.get('warrantyReleaseDate')?.enable();
        this.updateForm.get('warrantyReleaseFile')?.enable();
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

