import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { VendorTypes } from 'src/app/pages/vendors/add-vendor/vendor-types';
import { VendorService } from 'src/app/services/vendors.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-project-files',
  templateUrl: './add-project-files.component.html',
  styleUrl: './add-project-files.component.scss'
})
export class AddProjectFilesComponent implements OnInit {
  vendorId: number;
  isLoading: boolean;
  addAttachmentForm: FormGroup;
  vendorTypes: any[] = VendorTypes;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private vendorService: VendorService,
  ) { }

  ngOnInit(): void {
    this.getVendorId();

    this.initProjectFilesForm();
  }

  initProjectFilesForm() {
    this.addAttachmentForm = this.formBuilder.group({
      projectId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      title: ['', Validators.required],
      revision: ['', Validators.required],
      revisionDate: ['', Validators.required],
      receivedDate: ['', Validators.required],
      referenceNo: ['', Validators.required],
      comments: ['', Validators.required],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      typeId: ['', Validators.required],
    });
  }

  getVendorId() {
    this.activatedRoute.params.subscribe(params => {
      this.vendorId = params['id'];
      if (this.vendorId) {
        this.vendorService.getVendor(this.vendorId).subscribe(res => {
          setTimeout(() => {
            this.editVendorForm(res.data);
            this.cdr.detectChanges();
          }, 1000);
        });
      }
    });
  }

  editVendorForm(data: any) {
    this.addAttachmentForm.patchValue({
      crNumber: data?.crNumber,
      email: data?.email,
      nameAr: data?.nameAr,
      name: data?.name,
      address: data?.address,
      description: data?.description,
      phone: data?.phone,
      typeId: data?.typeId,
    });
  }

  saveChanges() {
    if(this.addAttachmentForm.invalid) {
      this.addAttachmentForm.markAllAsTouched();
      return;
    }
    if (!this.vendorId) {
      const payload = { ...this.addAttachmentForm.value, typeId: +this.addAttachmentForm.value.typeId };
      this.vendorService.addVendor(payload).subscribe(res => {
        this.router.navigateByUrl('vendors');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Vendor Added successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    } else {
      const payload = { id: this.vendorId, ...this.addAttachmentForm.value, typeId: +this.addAttachmentForm.value.typeId };
      this.vendorService.updateVendor(payload).subscribe(res => {
        this.router.navigateByUrl('vendors');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Vendor Updated successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    }
  }

  back() {
    this._location.back();
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
