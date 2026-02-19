import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { VendorTypes } from './vendor-types';
import { VendorService } from 'src/app/services/vendors.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.scss'
})
export class AddVendorComponent implements OnInit {
  vendorId: number;
  isLoading: boolean;
  addVendorForm: FormGroup;
  vendorTypes: any[] = VendorTypes;
  activeTab: 'general' | 'contact' = 'general';
  private readonly requiredFields: string[] = ['crNumber', 'email', 'nameAr', 'name', 'address', 'description', 'phone', 'typeId'];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    public router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private vendorService: VendorService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.getVendorId();

    this.initAddVendorForm();
  }

  initAddVendorForm() {
    this.addVendorForm = this.formBuilder.group({
      crNumber: ['', Validators.required],
      email: ['', Validators.required],
      nameAr: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
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
    this.addVendorForm.patchValue({
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
    if (!this.vendorId) {
      const payload = { ...this.addVendorForm.value, typeId: +this.addVendorForm.value.typeId };
      this.vendorService.addVendor(payload).subscribe(res => {
        this.router.navigateByUrl('vendors');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Vendor Added successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    } else {
      const payload = { id: this.vendorId, ...this.addVendorForm.value, typeId: +this.addVendorForm.value.typeId };
      this.vendorService.updateVendor(payload).subscribe(res => {
        this.router.navigateByUrl('vendors');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Vendor Updated successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    }
  }
   setActiveTab(tab: 'general' | 'contact') {
    this.activeTab = tab;
  }

  isActiveTab(tab: 'general' | 'contact'): boolean {
    return this.activeTab === tab;
  }

  get completedRequiredCount(): number {
    if (!this.addVendorForm) return 0;
    return this.requiredFields.filter((field) => {
      const value = this.addVendorForm.get(field)?.value;
      return value !== null && value !== undefined && value !== '';
    }).length;
  }

  get completionPercentage(): number {
    return Math.round((this.completedRequiredCount / this.requiredFields.length) * 100);
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
