import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
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

  activeStep!: number;
  steps: any[] = [];

  finalDeliveryFile: any;
  finalDeliveryNotesFile: any;
  finishNotesFile: any;
  supplyContractorFile: any;
  signNotesFile: any;
  warrantyReleaseFile: any;

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
      finalDeliveryDate: [''],
      finalDeliveryFile: [''],

      finalDeliveryNotes: [{ value: null, disabled: true }],
      notApplied: [{ value: false, disabled: true }],
      finalDeliveryNotesDate: [{ value: '', disabled: true }],
      finalDeliveryNotesFile: [{ value: '', disabled: true }],

      supplyContractor: [{ value: null, disabled: true }],
      supplyContractorDate: [{ value: '', disabled: true }],
      supplyContractorFile: [{ value: '', disabled: true }],

      finishNote: [{ value: null, disabled: true }],
      finishNoteDate: [{ value: '', disabled: true }],
      finishNoteFile: [{ value: '', disabled: true }],

      signNote: [{ value: null, disabled: true }],
      signNoteDate: [{ value: '', disabled: true }],
      signNoteFile: [{ value: '', disabled: true }],

      warrantyRelease: [{ value: null, disabled: true }],
      warrantyReleaseDate: [{ value: '', disabled: true }],
      warrantyReleaseFile: [{ value: '', disabled: true }],
    });
  }

  valueChangesListener() {
    this.updateForm.get('finalDelivery')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('finalDeliveryNotes')?.disable();
        this.updateForm.get('finalDeliveryNotes')?.setValue(null);
        this.updateForm.get('notApplied')?.disable();
        this.updateForm.get('notApplied')?.setValue(false);
        this.updateForm.get('finalDeliveryNotesDate')?.disable();
        this.updateForm.get('finalDeliveryNotesDate')?.setValue(null);
        this.updateForm.get('finalDeliveryNotesFile')?.disable();
        this.updateForm.get('finalDeliveryNotesFile')?.setValue(null);
        this.updateForm.get('finalDeliveryDate')?.clearValidators();
        this.updateForm.get('finalDeliveryFile')?.clearValidators();
        this.updateForm.get('finalDeliveryDate')?.updateValueAndValidity();
        this.updateForm.get('finalDeliveryFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('finalDeliveryDate')?.setValidators([Validators.required]);
        this.updateForm.get('finalDeliveryFile')?.setValidators([Validators.required]);
        this.updateForm.get('finalDeliveryDate')?.updateValueAndValidity();
        this.updateForm.get('finalDeliveryFile')?.updateValueAndValidity();
        this.updateForm.get('finalDeliveryNotes')?.enable();
        this.updateForm.get('notApplied')?.enable();
        this.updateForm.get('finalDeliveryNotesDate')?.enable();
        this.updateForm.get('finalDeliveryNotesFile')?.enable();
      }
    });
    this.updateForm.get('finalDeliveryNotes')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('supplyContractor')?.disable();
        this.updateForm.get('supplyContractor')?.setValue(null);
        this.updateForm.get('supplyContractorDate')?.disable();
        this.updateForm.get('supplyContractorDate')?.setValue(null);
        this.updateForm.get('supplyContractorFile')?.disable();
        this.updateForm.get('supplyContractorFile')?.setValue(null);
        this.updateForm.get('finalDeliveryNotesDate')?.clearValidators();
        this.updateForm.get('finalDeliveryNotesFile')?.clearValidators();
        this.updateForm.get('finalDeliveryNotesDate')?.updateValueAndValidity();
        this.updateForm.get('finalDeliveryNotesFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('finalDeliveryNotesDate')?.setValidators([Validators.required]);
        this.updateForm.get('finalDeliveryNotesFile')?.setValidators([Validators.required]);
        this.updateForm.get('finalDeliveryNotesDate')?.updateValueAndValidity();
        this.updateForm.get('finalDeliveryNotesFile')?.updateValueAndValidity();
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
        this.updateForm.get('supplyContractor')?.setValue(null);
        this.updateForm.get('supplyContractorDate')?.disable();
        this.updateForm.get('supplyContractorDate')?.setValue(null);
        this.updateForm.get('supplyContractorFile')?.disable();
        this.updateForm.get('supplyContractorFile')?.setValue(null);

        this.updateForm.get('finishNote')?.disable();
        this.updateForm.get('finishNote')?.setValue(null);
        this.updateForm.get('finishNoteDate')?.disable();
        this.updateForm.get('finishNoteDate')?.setValue(null);
        this.updateForm.get('finishNoteFile')?.disable();
        this.updateForm.get('finishNoteFile')?.setValue(null);

        this.updateForm.get('warrantyRelease')?.disable();
        this.updateForm.get('warrantyRelease')?.setValue(null);
        this.updateForm.get('warrantyReleaseDate')?.disable();
        this.updateForm.get('warrantyReleaseDate')?.setValue(null);
        this.updateForm.get('warrantyReleaseFile')?.disable();
        this.updateForm.get('warrantyReleaseFile')?.setValue(null);
      } else {
        this.updateForm.get('finalDeliveryNotes')?.setValue(false);
        this.updateForm.get('supplyContractor')?.disable();
        this.updateForm.get('supplyContractor')?.setValue(null);
        this.updateForm.get('supplyContractorDate')?.disable();
        this.updateForm.get('supplyContractorDate')?.setValue(null);
        this.updateForm.get('supplyContractorFile')?.disable();
        this.updateForm.get('supplyContractorFile')?.setValue(null);

        this.updateForm.get('finishNote')?.disable();
        this.updateForm.get('finishNote')?.setValue(null);
        this.updateForm.get('finishNoteDate')?.disable();
        this.updateForm.get('finishNoteDate')?.setValue(null);
        this.updateForm.get('finishNoteFile')?.disable();
        this.updateForm.get('finishNoteFile')?.setValue(null);

        this.updateForm.get('finalDeliveryNotesDate')?.disable();
        this.updateForm.get('finalDeliveryNotesDate')?.setValue(null);
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
        this.updateForm.get('finishNote')?.setValue(null);
        this.updateForm.get('finishNoteDate')?.disable();
        this.updateForm.get('finishNoteDate')?.setValue(null);
        this.updateForm.get('finishNoteFile')?.disable();
        this.updateForm.get('finishNoteFile')?.setValue(null);
        this.updateForm.get('supplyContractorDate')?.clearValidators();
        this.updateForm.get('supplyContractorFile')?.clearValidators();
        this.updateForm.get('supplyContractorDate')?.updateValueAndValidity();
        this.updateForm.get('supplyContractorFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('supplyContractorDate')?.setValidators([Validators.required]);
        this.updateForm.get('supplyContractorFile')?.setValidators([Validators.required]);
        this.updateForm.get('supplyContractorDate')?.updateValueAndValidity();
        this.updateForm.get('supplyContractorFile')?.updateValueAndValidity();
        this.updateForm.get('finishNote')?.enable();
        this.updateForm.get('finishNoteDate')?.enable();
        this.updateForm.get('finishNoteFile')?.enable();
      }
    });
    this.updateForm.get('finishNote')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('signNote')?.disable();
        this.updateForm.get('signNote')?.setValue(null);
        this.updateForm.get('signNoteDate')?.disable();
        this.updateForm.get('signNoteDate')?.setValue(null);
        this.updateForm.get('signNoteFile')?.disable();
        this.updateForm.get('signNoteFile')?.setValue(null);
        this.updateForm.get('finishNoteDate')?.clearValidators();
        this.updateForm.get('finishNoteFile')?.clearValidators();
        this.updateForm.get('finishNoteDate')?.updateValueAndValidity();
        this.updateForm.get('finishNoteFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('finishNoteDate')?.setValidators([Validators.required]);
        this.updateForm.get('finishNoteFile')?.setValidators([Validators.required]);
        this.updateForm.get('finishNoteDate')?.updateValueAndValidity();
        this.updateForm.get('finishNoteFile')?.updateValueAndValidity();
        this.updateForm.get('signNote')?.enable();
        this.updateForm.get('signNoteDate')?.enable();
        this.updateForm.get('signNoteFile')?.enable();
      }
    });
    this.updateForm.get('signNote')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.updateForm.get('warrantyRelease')?.disable();
        this.updateForm.get('warrantyRelease')?.setValue(null);
        this.updateForm.get('warrantyReleaseDate')?.disable();
        this.updateForm.get('warrantyReleaseDate')?.setValue(null);
        this.updateForm.get('warrantyReleaseFile')?.disable();
        this.updateForm.get('warrantyReleaseFile')?.setValue(null);
        this.updateForm.get('signNoteDate')?.clearValidators();
        this.updateForm.get('signNoteFile')?.clearValidators();
        this.updateForm.get('signNoteDate')?.updateValueAndValidity();
        this.updateForm.get('signNoteFile')?.updateValueAndValidity();
      } else {

        this.updateForm.get('signNoteDate')?.setValidators([Validators.required]);
        this.updateForm.get('signNoteFile')?.setValidators([Validators.required]);
        this.updateForm.get('signNoteDate')?.updateValueAndValidity();
        this.updateForm.get('signNoteFile')?.updateValueAndValidity();
        this.updateForm.get('warrantyRelease')?.enable();
        this.updateForm.get('warrantyReleaseDate')?.enable();
        this.updateForm.get('warrantyReleaseFile')?.enable();
      }
    });
    this.updateForm.get('warrantyRelease')?.valueChanges.subscribe((value) => {
      if (!value) {

        this.updateForm.get('warrantyReleaseDate')?.clearValidators();
        this.updateForm.get('warrantyReleaseFile')?.clearValidators();
        this.updateForm.get('warrantyReleaseDate')?.updateValueAndValidity();
        this.updateForm.get('warrantyReleaseFile')?.updateValueAndValidity();
      } else {
        this.updateForm.get('warrantyReleaseDate')?.setValidators([Validators.required]);
        this.updateForm.get('warrantyReleaseFile')?.setValidators([Validators.required]);
        this.updateForm.get('warrantyReleaseDate')?.updateValueAndValidity();
        this.updateForm.get('warrantyReleaseFile')?.updateValueAndValidity();
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
    this.deliveryStatusService.getDeliveryStatusById(this.projectId, 2).subscribe(res => {
      this.statusDetails = res.data;
      this.activeStep = this.statusDetails?.items.length ? this.statusDetails?.items[this.statusDetails?.items.length - 1]?.step : 0;

      for (const element of this.statusDetails?.items) {
        if (element.step === 1) {
          this.finalDeliveryFile = { name: element.attachment };
          this.updateForm.get('finalDelivery')?.setValue(element.checked);
          this.updateForm.get('finalDelivery')?.disable();
          this.updateForm.get('finalDeliveryDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('finalDeliveryDate')?.disable();
          this.updateForm.get('finalDeliveryFile')?.setValue({ name: element.attachment });
          this.updateForm.get('finalDeliveryFile')?.disable();
          this.updateForm.get('finalDeliveryNotes')?.enable();
          this.cdr.detectChanges();
        }
        if (element.step === 2) {
          this.finalDeliveryNotesFile = { name: element.attachment };
          this.updateForm.get('finalDeliveryNotes')?.setValue(element.checked);
          this.updateForm.get('finalDeliveryNotes')?.disable();
          this.updateForm.get('notApplied')?.setValue(element.applied);
          this.updateForm.get('notApplied')?.disable();
          this.updateForm.get('finalDeliveryNotesDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('finalDeliveryNotesDate')?.disable();
          this.updateForm.get('finalDeliveryNotesFile')?.setValue({ name: element.attachment });
          this.updateForm.get('finalDeliveryNotesFile')?.disable();
          this.updateForm.get('supplyContractor')?.enable();
          this.cdr.detectChanges();
        }
        if (element.step === 3) {
          this.supplyContractorFile = { name: element.attachment };
          this.updateForm.get('supplyContractor')?.setValue(element.checked);
          this.updateForm.get('supplyContractor')?.disable();
          this.updateForm.get('supplyContractorDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('supplyContractorDate')?.disable();
          this.updateForm.get('supplyContractorFile')?.setValue({ name: element.attachment });
          this.updateForm.get('supplyContractorFile')?.disable();
          this.updateForm.get('finishNote')?.enable();
          this.cdr.detectChanges();
        }
        if (element.step === 4) {
          this.finishNotesFile = { name: element.attachment };
          this.updateForm.get('finishNote')?.setValue(element.checked);
          this.updateForm.get('finishNote')?.disable();
          this.updateForm.get('finishNoteDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('finishNoteDate')?.disable();
          this.updateForm.get('finishNoteFile')?.setValue({ name: element.attachment });
          this.updateForm.get('finishNoteFile')?.disable();
          this.updateForm.get('signNote')?.enable();
          this.cdr.detectChanges();
        }
        if (element.step === 5) {
          this.signNotesFile = { name: element.attachment };
          this.updateForm.get('signNote')?.setValue(element.checked);
          this.updateForm.get('signNote')?.disable();
          this.updateForm.get('signNoteDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('signNoteDate')?.disable();
          this.updateForm.get('signNoteFile')?.setValue({ name: element.attachment });
          this.updateForm.get('signNoteFile')?.disable();
          this.updateForm.get('warrantyRelease')?.enable();
          this.cdr.detectChanges();
        }
        if (element.step === 6) {
          this.warrantyReleaseFile = { name: element.attachment };
          this.updateForm.get('warrantyRelease')?.setValue(element.checked);
          this.updateForm.get('warrantyRelease')?.disable();
          this.updateForm.get('warrantyReleaseDate')?.setValue(element.createdAt.slice(0, 10));
          this.updateForm.get('warrantyReleaseDate')?.disable();
          this.updateForm.get('warrantyReleaseFile')?.setValue({ name: element.attachment });
          this.updateForm.get('warrantyReleaseFile')?.disable();
          this.cdr.detectChanges();
        }
      }

      // if (this.statusDetails.items[0] && this.statusDetails.items[0].step === 1) {
      //   this.finalDeliveryFile = { name: this.statusDetails.items[0].attachment };
      //   this.updateForm.get('finalDelivery')?.setValue(this.statusDetails.items[0].checked);
      //   this.updateForm.get('finalDelivery')?.disable();
      //   this.updateForm.get('finalDeliveryDate')?.setValue(this.statusDetails.items[0].createdAt.slice(0, 10));
      //   this.updateForm.get('finalDeliveryDate')?.disable();
      //   this.updateForm.get('finalDeliveryFile')?.setValue({ name: this.statusDetails.items[0].attachment });
      //   this.updateForm.get('finalDeliveryFile')?.disable();
      //   this.updateForm.get('finalDeliveryNotes')?.enable();
      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[1] && this.statusDetails.items[1].step === 2) {
      //   this.finalDeliveryNotesFile = { name: this.statusDetails.items[0].attachment };
      //   this.updateForm.get('finalDeliveryNotes')?.setValue(this.statusDetails.items[0].checked);
      //   this.updateForm.get('finalDeliveryNotes')?.disable();
      //   this.updateForm.get('notApplied')?.setValue(this.statusDetails.items[1].applied || null);
      //   this.updateForm.get('notApplied')?.disable();
      //   this.updateForm.get('finalDeliveryNotesDate')?.setValue(this.statusDetails.items[0].createdAt.slice(0, 10));
      //   this.updateForm.get('finalDeliveryNotesDate')?.disable();
      //   this.updateForm.get('finalDeliveryNotesFile')?.setValue({ name: this.statusDetails.items[0].attachment });
      //   this.updateForm.get('finalDeliveryNotesFile')?.disable();
      //   this.updateForm.get('supplyContractor')?.enable();

      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[2] && this.statusDetails.items[2].step === 3) {
      //   this.supplyContractorFile = { name: this.statusDetails.items[0].attachment };
      //   this.updateForm.get('supplyContractor')?.setValue(this.statusDetails.items[0].checked);
      //   this.updateForm.get('supplyContractor')?.disable();
      //   this.updateForm.get('supplyContractorDate')?.setValue(this.statusDetails.items[0].createdAt.slice(0, 10));
      //   this.updateForm.get('supplyContractorDate')?.disable();
      //   this.updateForm.get('supplyContractorFile')?.setValue({ name: this.statusDetails.items[0].attachment });
      //   this.updateForm.get('supplyContractorFile')?.disable();
      //   this.updateForm.get('finishNote')?.enable();
      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[3] && this.statusDetails.items[3].step === 4) {
      //   this.finishNotesFile = { name: this.statusDetails.items[0].attachment };
      //   this.updateForm.get('finishNote')?.setValue(this.statusDetails.items[0].checked);
      //   this.updateForm.get('finishNote')?.disable();
      //   this.updateForm.get('finishNoteDate')?.setValue(this.statusDetails.items[0].createdAt.slice(0, 10));
      //   this.updateForm.get('finishNoteDate')?.disable();
      //   this.updateForm.get('finishNoteFile')?.setValue({ name: this.statusDetails.items[0].attachment });
      //   this.updateForm.get('finishNoteFile')?.disable();
      //   this.updateForm.get('signNote')?.enable();
      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[4] && this.statusDetails.items[4].step === 5) {
      //   this.signNotesFile = { name: this.statusDetails.items[0].attachment };
      //   this.updateForm.get('signNote')?.setValue(this.statusDetails.items[0].checked);
      //   this.updateForm.get('signNote')?.disable();
      //   this.updateForm.get('signNoteDate')?.setValue(this.statusDetails.items[0].createdAt.slice(0, 10));
      //   this.updateForm.get('signNoteDate')?.disable();
      //   this.updateForm.get('signNoteFile')?.setValue({ name: this.statusDetails.items[0].attachment });
      //   this.updateForm.get('signNoteFile')?.disable();
      //   this.updateForm.get('warrantyRelease')?.enable();
      //   this.cdr.detectChanges();
      // }
      // if (this.statusDetails.items[5] && this.statusDetails.items[5].step === 6) {
      //   this.warrantyReleaseFile = { name: this.statusDetails.items[4].attachment };
      //   this.updateForm.get('warrantyRelease')?.setValue(this.statusDetails.items[4].checked);
      //   this.updateForm.get('warrantyRelease')?.disable();
      //   this.updateForm.get('warrantyReleaseDate')?.setValue(this.statusDetails.items[4].createdAt.slice(0, 10));
      //   this.updateForm.get('warrantyReleaseDate')?.disable();
      //   this.updateForm.get('warrantyReleaseFile')?.setValue({ name: this.statusDetails.items[4].attachment });
      //   this.updateForm.get('warrantyReleaseFile')?.disable();
      //   this.cdr.detectChanges();
      // }
    });
  }

  onFinalDeliveryFileSelected(event: any) {
    this.finalDeliveryFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.finalDeliveryFile, this.finalDeliveryFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        finalDeliveryFile: res.data
      });
    });
  }

  onFinalDeliveryNotesFileSelected($event: any) {
    this.finalDeliveryNotesFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.finalDeliveryNotesFile, this.finalDeliveryNotesFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        finalDeliveryNotesFile: res.data
      });
    });
  }

  onSupplyContractorFileSelected($event: any) {
    this.supplyContractorFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.supplyContractorFile, this.supplyContractorFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        supplyContractorFile: res.data
      });
    });
  }

  onFinishNotesFileSelected($event: any) {
    this.finishNotesFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.finishNotesFile, this.finishNotesFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        finishNoteFile: res.data
      });
    });
  }

  onSignNoteFileSelected($event: any) {
    this.signNotesFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.signNotesFile, this.signNotesFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        signNoteFile: res.data
      });
    });
  }

  onWarrantyReleaseFileSelected($event: any) {
    this.warrantyReleaseFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.warrantyReleaseFile, this.warrantyReleaseFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.updateForm.patchValue({
        warrantyReleaseFile: res.data
      });
    });
  }

  downloadFile(attachment: string) {
    this.attachmentService.downloadAttachment(attachment).subscribe(res => {
      window.open(res.data, '_blank');
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
      "checked": this.updateForm.get('finalDelivery')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('finalDeliveryDate')?.value,
      "attachment": this.updateForm.get('finalDeliveryFile')?.value,
      "finalStep": 1,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[1] = {
      "checked": this.updateForm.get('finalDeliveryNotes')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('finalDeliveryNotesDate')?.value,
      "attachment": this.updateForm.get('finalDeliveryNotesFile')?.value,
      "finalStep": 2,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[2] = {
      "checked": this.updateForm.get('supplyContractor')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('supplyContractorDate')?.value,
      "attachment": this.updateForm.get('supplyContractorFile')?.value,
      "finalStep": 3,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[3] = {
      "checked": this.updateForm.get('finishNote')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('finishNoteDate')?.value,
      "attachment": this.updateForm.get('finishNoteFile')?.value,
      "finalStep": 4,
      "deliveryStatusId": this.deliveryStatusId
    }

    payload[4] = {
      "checked": this.updateForm.get('signNote')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('signNoteDate')?.value,
      "attachment": this.updateForm.get('signNoteFile')?.value,
      "finalStep": 5,
      "deliveryStatusId": this.deliveryStatusId
    }
    payload[5] = {
      "checked": this.updateForm.get('warrantyRelease')?.value,
      "applied": false,
      "createdAt": this.updateForm.get('warrantyReleaseDate')?.value,
      "attachment": this.updateForm.get('warrantyReleaseFile')?.value,
      "finalStep": 6,
      "deliveryStatusId": this.deliveryStatusId
    }
    const checkedItems = payload.filter(item => {
      return (item.checked === true || item.applied === true);
    });
    const filteredData = checkedItems.filter((item) => {
      // Check if there's a match for intialStep in backendData.items
      return !this.statusDetails?.items.some(
        (backendItem: any) => backendItem.step === item.finalStep
      );
    });

    this.deliveryStatusService.createDeliveryStatusItems({ items: this.statusDetails?.items.length ? filteredData : checkedItems }).subscribe(res => {
      this.getByID();
      this.modalService.dismissAll();
      this.cdr.detectChanges();
    }, (error) => {
      this.modalService.dismissAll()
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
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

