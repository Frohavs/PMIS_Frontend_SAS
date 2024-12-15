import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-rfp-position-details',
  templateUrl: './rfp-position-details.component.html',
  styleUrl: './rfp-position-details.component.scss'
})
export class RfpPositionDetailsComponent implements OnInit {

  positionName!: string;
  recordID: number;
  positionId: number;
  rfpDetails: any;
  rfpPositions: any;
  logsDetails: any;
  isLoading: boolean;

  statusId: any = '';
  noteType: any = '';
  note = '';
  addRfpPositionForm: FormGroup;
  selectedFile: File;

  userId: any;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private rfpManagementService: RfpManagementService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      // this.recordID = params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {

      this.positionName = params['positionName'];
      this.positionId = +params['positionId'];
      if (this.positionId) {
        this.getRfpLogsDetails()
      }
    });
    this.initRfpPositionForm();
    this.getLookups();
  }

  initRfpPositionForm() {
    this.addRfpPositionForm = this.formBuilder.group({
      positionName: [{ value: this.positionName, disabled: true }],
      pageNo: ['', Validators.required],
      clause: ['', Validators.required],
      item: ['', Validators.required],
      notes: ['', Validators.required],
      attachment: [null, Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addRfpPositionForm.patchValue({
        attachment: res.data
      });
    });
  }

  getRfpLogsDetails() {
    this.rfpManagementService.getPositionsRfp(this.positionId).subscribe(res => {
      this.rfpPositions = res.data;
      this.cdr.detectChanges();
    });
    this.rfpManagementService.positionsRfpLog(this.positionId).subscribe(res => {
      this.logsDetails = res.data;
      this.cdr.detectChanges();
    });
  }
  getLookups() {
    // this.lookupService.getMIRNoteTypes().subscribe(res => {
    //   this.noteTypes = res.data;
    //   this.cdr.detectChanges();
    // });
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  saveChanges() {
    if (!this.addRfpPositionForm.valid) {
      this.addRfpPositionForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (!this.recordID) {
      this.rfpManagementService.createRfpPositions(
        {
          positionRfpId: this.positionId,
          ...this.addRfpPositionForm.value,
          pageNo: +this.addRfpPositionForm.value.pageNo
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.addRfpPositionForm.reset();
          this.getRfpLogsDetails();
          this.addRfpPositionForm.patchValue({
            positionName: this.positionName
          })
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Note Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });

    } else {
      this.rfpManagementService.updateRfpPositions(
        {
          id: this.recordID,
          ...this.addRfpPositionForm.value,
          pageNo: +this.addRfpPositionForm.value.pageNo

        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.addRfpPositionForm.reset();
          this.getRfpLogsDetails();
          this.addRfpPositionForm.patchValue({
            positionName: this.positionName
          })
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Note Updated successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });
    }
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

  back() {
    this._location.back();
  }
}
