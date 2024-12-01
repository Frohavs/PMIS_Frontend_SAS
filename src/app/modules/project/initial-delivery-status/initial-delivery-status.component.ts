import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
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

  activeStep!: number;
  steps: any[] = [];

  createCommitteeSelectedFile: any;
  trackNotesSelectedFile: any;
  provideContractorNotesSelectedFile: any;
  completeNotesSelectedFile: any;
  signContractSelectedFile: any;

  statusModel: { status: boolean } = { status: true };
  @ViewChild('UpdateStatusModal') UpdateStatusModal!: any;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-850px',
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private attachmentService: AttachmentService,
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
      createCommitteeDate: [''],
      createCommitteeFile: [''],

      trackNotes: [{ value: null, disabled: true }],
      notApplied: [{ value: false, disabled: true }],
      trackNotesDate: [{ value: '', disabled: true },],
      trackNotesFile: [{ value: '', disabled: true },],

      provideContractorNotes: [{ value: null, disabled: true },],
      provideContractorNotesDate: [{ value: '', disabled: true },],
      provideContractorNotesFile: [{ value: '', disabled: true },],

      completeNotes: [{ value: null, disabled: true },],
      completeNotesDate: [{ value: '', disabled: true },],
      completeNotesFile: [{ value: '', disabled: true },],

      signContract: [{ value: null, disabled: true },],
      signContractDate: [{ value: '', disabled: true },],
      signContractFile: [{ value: '', disabled: true },],
    });
  }

  valueChangesListener() {
    this.updateForm.get('createCommittee')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('trackNotes')?.disable();
        this.updateForm.get('trackNotes')?.setValue(null);
        this.updateForm.get('notApplied')?.disable();
        this.updateForm.get('notApplied')?.setValue(false);
        this.updateForm.get('trackNotesDate')?.disable();
        this.updateForm.get('trackNotesDate')?.setValue(null);
        this.updateForm.get('trackNotesFile')?.disable();
        this.updateForm.get('trackNotesFile')?.setValue(null);
        this.updateForm.get('createCommitteeDate')?.clearValidators();
        this.updateForm.get('createCommitteeFile')?.clearValidators();
        this.updateForm.get('createCommitteeDate')?.updateValueAndValidity();
        this.updateForm.get('createCommitteeFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('createCommitteeDate')?.setValidators([Validators.required]);
        this.updateForm.get('createCommitteeFile')?.setValidators([Validators.required]);
        this.updateForm.get('createCommitteeDate')?.updateValueAndValidity();
        this.updateForm.get('createCommitteeFile')?.updateValueAndValidity();
        this.updateForm.get('notApplied')?.enable();
        this.updateForm.get('notApplied')?.setValue(false);
        this.updateForm.get('trackNotes')?.enable();
        this.updateForm.get('trackNotesDate')?.enable();
        this.updateForm.get('trackNotesFile')?.enable();
      }
    });
    this.updateForm.get('trackNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('provideContractorNotes')?.disable();
        this.updateForm.get('provideContractorNotes')?.setValue(null);
        this.updateForm.get('provideContractorNotesDate')?.disable();
        this.updateForm.get('provideContractorNotesDate')?.setValue(null);
        this.updateForm.get('provideContractorNotesFile')?.disable();
        this.updateForm.get('provideContractorNotesFile')?.setValue(null);
        this.updateForm.get('trackNotesDate')?.clearValidators();
        this.updateForm.get('trackNotesFile')?.clearValidators();
        this.updateForm.get('trackNotesDate')?.updateValueAndValidity();
        this.updateForm.get('trackNotesFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('trackNotesDate')?.setValidators([Validators.required]);
        this.updateForm.get('trackNotesFile')?.setValidators([Validators.required]);
        this.updateForm.get('trackNotesDate')?.updateValueAndValidity();
        this.updateForm.get('trackNotesFile')?.updateValueAndValidity();
        this.updateForm.get('provideContractorNotes')?.enable();
        this.updateForm.get('provideContractorNotesDate')?.enable();
        this.updateForm.get('provideContractorNotesFile')?.enable();
      }
    });
    this.updateForm.get('notApplied')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('completeNotes')?.disable();
        this.updateForm.get('completeNotes')?.setValue(null);
        this.updateForm.get('completeNotesDate')?.disable();
        this.updateForm.get('completeNotesDate')?.setValue(null);
        this.updateForm.get('completeNotesFile')?.disable();
        this.updateForm.get('completeNotesFile')?.setValue(null);

        this.updateForm.get('provideContractorNotes')?.disable();
        this.updateForm.get('provideContractorNotes')?.setValue(null);
        this.updateForm.get('provideContractorNotesDate')?.disable();
        this.updateForm.get('provideContractorNotesDate')?.setValue(null);
        this.updateForm.get('provideContractorNotesFile')?.disable();
        this.updateForm.get('provideContractorNotesFile')?.setValue(null);

        this.updateForm.get('signContract')?.disable();
        this.updateForm.get('signContract')?.setValue(null);
        this.updateForm.get('signContractDate')?.disable();
        this.updateForm.get('signContractDate')?.setValue(null);
        this.updateForm.get('signContractFile')?.disable();
        this.updateForm.get('signContractFile')?.setValue(null);

      } else {
        this.updateForm.get('trackNotes')?.setValue(false);
        this.updateForm.get('completeNotes')?.disable();
        this.updateForm.get('completeNotes')?.setValue(null);
        this.updateForm.get('completeNotesDate')?.disable();
        this.updateForm.get('completeNotesDate')?.setValue(null);
        this.updateForm.get('completeNotesFile')?.disable();
        this.updateForm.get('completeNotesFile')?.setValue(null);

        this.updateForm.get('provideContractorNotes')?.disable();
        this.updateForm.get('provideContractorNotes')?.setValue(null);
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
        this.updateForm.get('completeNotes')?.setValue(null);
        this.updateForm.get('completeNotesDate')?.disable();
        this.updateForm.get('completeNotesDate')?.setValue(null);
        this.updateForm.get('completeNotesFile')?.disable();
        this.updateForm.get('completeNotesFile')?.setValue(null);
        this.updateForm.get('provideContractorNotesDate')?.clearValidators();
        this.updateForm.get('provideContractorNotesFile')?.clearValidators();
        this.updateForm.get('provideContractorNotesDate')?.updateValueAndValidity();
        this.updateForm.get('provideContractorNotesFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('provideContractorNotesDate')?.enable();
        this.updateForm.get('provideContractorNotesFile')?.enable();
        this.updateForm.get('provideContractorNotesDate')?.setValidators([Validators.required]);
        this.updateForm.get('provideContractorNotesFile')?.setValidators([Validators.required]);
        this.updateForm.get('provideContractorNotesDate')?.updateValueAndValidity();
        this.updateForm.get('provideContractorNotesFile')?.updateValueAndValidity();
        this.updateForm.get('completeNotes')?.enable();
        this.updateForm.get('completeNotesDate')?.enable();
        this.updateForm.get('completeNotesFile')?.enable();
      }
    });
    this.updateForm.get('completeNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('signContract')?.disable();
        this.updateForm.get('signContract')?.setValue(null);
        this.updateForm.get('signContractDate')?.disable();
        this.updateForm.get('signContractDate')?.setValue(null);
        this.updateForm.get('signContractFile')?.disable();
        this.updateForm.get('signContractFile')?.setValue(null);
        this.updateForm.get('completeNotesDate')?.clearValidators();
        this.updateForm.get('completeNotesFile')?.clearValidators();
        this.updateForm.get('completeNotesDate')?.updateValueAndValidity();
        this.updateForm.get('completeNotesFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('completeNotesDate')?.setValidators([Validators.required]);
        this.updateForm.get('completeNotesFile')?.setValidators([Validators.required]);
        this.updateForm.get('completeNotesDate')?.updateValueAndValidity();
        this.updateForm.get('completeNotesFile')?.updateValueAndValidity();
        this.updateForm.get('signContract')?.enable();
        this.updateForm.get('signContractDate')?.enable();
        this.updateForm.get('signContractFile')?.enable();
      }
    });
    this.updateForm.get('signContract')?.valueChanges.subscribe((value) => {
      if (!value) {

        this.updateForm.get('signContractDate')?.clearValidators();
        this.updateForm.get('signContractFile')?.clearValidators();
        this.updateForm.get('signContractDate')?.updateValueAndValidity();
        this.updateForm.get('signContractFile')?.updateValueAndValidity();
      } else {
        this.updateForm.get('signContractDate')?.setValidators([Validators.required]);
        this.updateForm.get('signContractFile')?.setValidators([Validators.required]);
        this.updateForm.get('signContractDate')?.updateValueAndValidity();
        this.updateForm.get('signContractFile')?.updateValueAndValidity();
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
      this.statusDetails = res.data;
      this.activeStep = this.statusDetails?.items.length ? this.statusDetails?.items[this.statusDetails?.items.length - 1]?.step : 0;
      for (const element of this.statusDetails?.items) {
        if (element.step === 1) {
          this.createCommitteeSelectedFile = { name: element.attachment };
          this.updateForm.get('createCommittee')?.setValue(element.checked);
          this.updateForm.get('createCommittee')?.disable();
          this.updateForm.get('createCommitteeDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('createCommitteeDate')?.disable();
          this.updateForm.get('createCommitteeFile')?.setValue({ name: element.attachment });
          this.updateForm.get('createCommitteeFile')?.disable();
          this.updateForm.get('trackNotes')?.enable();
          this.cdr.detectChanges();

        }
        if (element.step === 2) {
          this.trackNotesSelectedFile = { name: element.attachment };
          this.updateForm.get('trackNotes')?.setValue(element.checked);
          this.updateForm.get('trackNotes')?.disable();
          this.updateForm.get('notApplied')?.setValue(element.applied);
          this.updateForm.get('notApplied')?.disable();
          this.updateForm.get('trackNotesDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('trackNotesDate')?.disable();
          this.updateForm.get('trackNotesFile')?.setValue({ name: element.attachment });
          this.updateForm.get('trackNotesFile')?.disable();
          this.updateForm.get('completeNotes')?.enable();
          this.updateForm.get('provideContractorNotes')?.enable();

          this.cdr.detectChanges();
        }
        if (element.step === 3) {
          this.provideContractorNotesSelectedFile = { name: element.attachment };
          this.updateForm.get('provideContractorNotes')?.setValue(element.checked);
          this.updateForm.get('provideContractorNotes')?.disable();
          this.updateForm.get('provideContractorNotesDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('provideContractorNotesDate')?.disable();
          this.updateForm.get('provideContractorNotesFile')?.setValue({ name: element.attachment });
          this.updateForm.get('provideContractorNotesFile')?.disable();
          this.updateForm.get('completeNotes')?.enable();
          this.cdr.detectChanges();
        }
        if (element.step === 4) {
          this.completeNotesSelectedFile = { name: element.attachment };
          this.updateForm.get('completeNotes')?.setValue(element.checked);
          this.updateForm.get('completeNotes')?.disable();
          this.updateForm.get('completeNotesDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('completeNotesDate')?.disable();
          this.updateForm.get('completeNotesFile')?.setValue({ name: element.attachment });
          this.updateForm.get('signContract')?.enable();
        }
        if (element.step === 5) {
          this.signContractSelectedFile = { name: element.attachment };
          this.updateForm.get('signContract')?.setValue(element.checked);
          this.updateForm.get('signContract')?.disable();
          this.updateForm.get('signContractDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('signContractDate')?.disable();
          this.updateForm.get('signContractFile')?.setValue({ name: element.attachment });
        }
      }
      // this.cdr.detectChanges();
      // if (this.statusDetails.items[0] && this.statusDetails.items[0].step === 1) {
      // }
      // if (this.statusDetails.items[1] && this.statusDetails.items[1].step === 2) {
      //   this.trackNotesSelectedFile = { name: this.statusDetails.items[1].attachment };
      //   this.updateForm.get('trackNotes')?.setValue(this.statusDetails.items[1].checked);
      //   this.updateForm.get('trackNotes')?.disable();
      //   this.updateForm.get('notApplied')?.setValue(this.statusDetails.items[1].applied || null);
      //   this.updateForm.get('notApplied')?.disable();
      //   this.updateForm.get('trackNotesDate')?.setValue(this.statusDetails.items[1].createdAt.slice(0, 10));
      //   this.updateForm.get('trackNotesDate')?.disable();
      //   this.updateForm.get('trackNotesFile')?.setValue({ name: this.statusDetails.items[1].attachment });
      //   this.updateForm.get('trackNotesFile')?.disable();
      //   this.updateForm.get('provideContractorNotes')?.enable();
      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[2] && this.statusDetails.items[2].step === 3) {
      //   this.provideContractorNotesSelectedFile = { name: this.statusDetails.items[2].attachment };
      //   this.updateForm.get('provideContractorNotes')?.setValue(this.statusDetails.items[2].checked);
      //   this.updateForm.get('provideContractorNotes')?.disable();
      //   this.updateForm.get('provideContractorNotesDate')?.setValue(this.statusDetails.items[2].createdAt.slice(0, 10));
      //   this.updateForm.get('provideContractorNotesDate')?.disable();
      //   this.updateForm.get('provideContractorNotesFile')?.setValue({ name: this.statusDetails.items[2].attachment });
      //   this.updateForm.get('provideContractorNotesFile')?.disable();
      //   this.updateForm.get('completeNotes')?.enable();
      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[3] && this.statusDetails.items[3].step === 4) {
      //   this.completeNotesSelectedFile = { name: this.statusDetails.items[3].attachment };
      //   this.updateForm.get('completeNotes')?.setValue(this.statusDetails.items[3].checked);
      //   this.updateForm.get('completeNotes')?.disable();
      //   this.updateForm.get('completeNotesDate')?.setValue(this.statusDetails.items[3].createdAt.slice(0, 10));
      //   this.updateForm.get('completeNotesDate')?.disable();
      //   this.updateForm.get('completeNotesFile')?.setValue({ name: this.statusDetails.items[3].attachment });
      //   this.updateForm.get('completeNotesFile')?.disable();
      //   this.cdr.detectChanges();
      // }

      // if (this.statusDetails.items[4] && this.statusDetails.items[4].step === 5) {
      //   this.signContractSelectedFile = { name: this.statusDetails.items[4].attachment };
      //   this.updateForm.get('signContract')?.setValue(this.statusDetails.items[4].checked);
      //   this.updateForm.get('signContract')?.disable();
      //   this.updateForm.get('signContractDate')?.setValue(this.statusDetails.items[4].createdAt.slice(0, 10));
      //   this.updateForm.get('signContractDate')?.disable();
      //   this.updateForm.get('signContractFile')?.setValue({ name: this.statusDetails.items[4].attachment });
      //   this.updateForm.get('signContractFile')?.disable();
      //   this.cdr.detectChanges();
      // }

    });
  }

  onCreateCommitteeFileSelected(event: any) {
    this.createCommitteeSelectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.createCommitteeSelectedFile, this.createCommitteeSelectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        createCommitteeFile: res.data
      });
    });
  }

  onTrackNotesFileSelected(event: any) {
    this.trackNotesSelectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.trackNotesSelectedFile, this.trackNotesSelectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        trackNotesFile: res.data
      });
    });
  }

  onProvideContractorNotesFileSelected(event: any) {
    this.provideContractorNotesSelectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.provideContractorNotesSelectedFile, this.provideContractorNotesSelectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        provideContractorNotesFile: res.data
      });
    });
  }

  onCompleteNotesFileSelected(event: any) {
    this.completeNotesSelectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.completeNotesSelectedFile, this.completeNotesSelectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        completeNotesFile: res.data
      });
    });
  }

  onSignContractFileSelected(event: any) {
    this.signContractSelectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.signContractSelectedFile, this.signContractSelectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        signContractFile: res.data
      });
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
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }
    let payload = []
    payload[0] = {
      "checked": this.updateForm.get('createCommittee')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('createCommitteeDate')?.value,
      "attachment": this.updateForm.get('createCommitteeFile')?.value,
      "intialStep": 1,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[1] = {
      "checked": this.updateForm.get('trackNotes')?.value,
      "applied": this.updateForm.get('notApplied')?.value,
      "createdAt": this.updateForm.get('trackNotesDate')?.value,
      "attachment": this.updateForm.get('trackNotesFile')?.value,
      "intialStep": 2,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[2] = {
      "checked": this.updateForm.get('provideContractorNotes')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('provideContractorNotesDate')?.value,
      "attachment": this.updateForm.get('provideContractorNotesFile')?.value,
      "intialStep": 3,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[3] = {
      "checked": this.updateForm.get('completeNotes')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('completeNotesDate')?.value,
      "attachment": this.updateForm.get('completeNotesFile')?.value,
      "intialStep": 4,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[4] = {
      "checked": this.updateForm.get('signContract')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('signContractDate')?.value,
      "attachment": this.updateForm.get('signContractFile')?.value,
      "intialStep": 5,
      "deliveryStatusId": this.deliveryStatusId
    }
    const checkedItems = payload.filter(item => {
      return (item.checked === true || item.applied === true);
    });

    const filteredData = checkedItems.filter((item) => {
      // Check if there's a match for intialStep in backendData.items
      return !this.statusDetails?.items.some(
        (backendItem: any) => backendItem.step === item.intialStep
      );
    });
    this.deliveryStatusService.createDeliveryStatusItems({ items: this.statusDetails?.items.length ? filteredData : checkedItems }).subscribe(res => {
      this.getByID();
      this.modalService.dismissAll();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Status Updated successfully!' });

      this.cdr.detectChanges();
    }, (error) => {
      this.modalService.dismissAll()
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  downloadFile(attachment: string) {
    this.attachmentService.downloadAttachment(attachment).subscribe(res => {
      window.open(res.data, '_blank');
    });
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

