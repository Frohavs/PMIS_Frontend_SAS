import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { RfpService } from 'src/app/services/rfp.service';


@Component({
  selector: 'app-add-rfp',
  templateUrl: './add-rfp.component.html',
  styleUrl: './add-rfp.component.scss'
})
export class AddRfpComponent implements OnInit {
  projectId: number;
  boqId: number;
  isLoading: boolean;
  addRFPForm: FormGroup;

  users: any[] = [];
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 8,
    allowSearchFilter: true,
  };

  administrators: any[] = [];
  selectedFile: any;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  subCategoryList: any = [];

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private rfpService: RfpService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getBoqId();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.boqId = params['boqId'];
    });
  }

  initAddBoqForm() {
    this.addRFPForm = this.formBuilder.group({
      nameAr: ['', Validators.required],
      name: ['', Validators.required],
      receivedDate: ['', Validators.required],
      requestedWayDocument: ['Scurve-1', Validators.required],
      administrator: [null, Validators.required],
      reviewerIds: [null, Validators.required],
      approverId: [null, Validators.required],
      subCategoryIds: [null, Validators.required],
    });

  }

  getLookups() {
    this.lookupService.getAdministrators().subscribe(res => {
      this.administrators = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRfpSignatureSubCategories().subscribe(res => {
      this.subCategoryList = res.data;
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addRFPForm.patchValue({
        requestedWayDocument: this.selectedFile.name
      });
    });

  }

  editVendorForm(data: any) {
    this.addRFPForm.patchValue({

      nameAr: data?.nameAr,
      name: data?.name,
      receivedDate: data?.receivedDate,
      requestedWayDocument: data?.requestedWayDocument?.slice(0, 10) || null,
      administrator: data?.administrator,
      reviewerIds: data?.reviewerIds,
      approverId: data?.approverId,
      subCategoryIds: data?.subCategoryIds,
    });
    this.cdr.detectChanges()
  }

  saveChanges() {
    if (!this.addRFPForm.valid) {
      this.addRFPForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.addRFPForm.value,
      subCategoryIds: this.addRFPForm.value.subCategoryIds?.map((item: any) => item.id),
      administrator: +this.addRFPForm.value.administrator,
      reviewerIds: this.addRFPForm.value.reviewerIds?.map((item: any) => +item.id),
      approverId: +this.addRFPForm.value.approverId,
    }
    this.rfpService.addRFPSignature(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl(`rfp_signature`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'RFP Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        this.isLoading = false;
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
    this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`);
  }
  back() {
    this._location.back();
  }
}
