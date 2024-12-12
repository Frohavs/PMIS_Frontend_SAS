import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';


@Component({
  selector: 'app-add-rfp',
  templateUrl: './add-rfp.component.html',
  styleUrl: './add-rfp.component.scss'
})
export class AddRfpComponent implements OnInit {
  rfpId: number;
  isLoading: boolean;
  addRfpForm: FormGroup;
  users: any[] = [];
  types: any[] = [];
  classifications: any[] = [];
  ways: any[] = [];
  selectedFile: any;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private rfpManagementService: RfpManagementService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private attachmentService: AttachmentService,

  ) { }

  ngOnInit(): void {
    this.getLookups();
    this.initRfpForm();
    this.getClassificationId();
  }

  getClassificationId() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.rfpId = params['rfpId'];
      if (this.rfpId) {
        this.rfpManagementService.getRFPClassificationById(this.rfpId).subscribe(res => {
          this.editVendorForm(res.data);
          this.cdr.detectChanges();
        });
      }
    });
  }

  onFileSelected($event: any) {
    this.selectedFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addRfpForm.patchValue({
        requestedWayDocument: res.data
      });
    });
  }

  initRfpForm() {
    this.addRfpForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      administratorId: [null, Validators.required],
      receivedDate: ['', Validators.required],
      typeId: [null, Validators.required],
      classificationId: [null, Validators.required],
      requestWayId: [null, Validators.required],
      value: ['', Validators.required],
      note: ['', Validators.required],
      requestedWayDocument: [''],
    });
  }

  getLookups() {
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRfpTypes().subscribe(res => {
      this.types = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRfpClassifications().subscribe(res => {
      this.classifications = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRfpRequestWays().subscribe(res => {
      this.ways = res.data;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addRfpForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
      administratorId: data?.administratorId,
      receivedDate: data?.receivedDate.slice(0, 10),
      typeId: data?.typeId,
      requestWayId: data?.requestWayId,
      classificationId: data?.classificationId,
      value: data?.value,
      note: data?.note,
      requestedWayDocument: data?.requestedWayDocument
    });
    this.cdr.detectChanges()
  }

  saveChanges() {
    if (!this.addRfpForm.valid) {
      this.addRfpForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.addRfpForm.value,
      administratorId: +this.addRfpForm.value.administratorId,
      typeId: +this.addRfpForm.value.typeId,
      requestWayId: +this.addRfpForm.value.requestWayId,
      classificationId: +this.addRfpForm.value.classificationId,
      value: +this.addRfpForm.value.value,
    };
    this.rfpManagementService.addRFPManagement(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl(`rfp_management/overview`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Rfp Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
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
  navigateBoqTable() {
    this.router.navigateByUrl('rfp_management/classification');
  }
  back() {
    this._location.back();
  }
}
