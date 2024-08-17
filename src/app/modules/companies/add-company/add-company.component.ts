import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { CompanyTypes } from './company-types';
import { VendorService } from 'src/app/services/vendors.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent implements OnInit, OnDestroy {

  companyId: number;
  isLoading: boolean;
  addCompanyForm: FormGroup;
  companyTypes: any[] = CompanyTypes;
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  vendorList: any = [];
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 8,
    allowSearchFilter: true,
  };

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private vendorService: VendorService
  ) {
  }

  ngOnInit() {
    this.getCompanyId();
    this.initializeCompanyForm();
    this.vendorService.getAll().subscribe(res => {
      // console.log('vendorService', res.data.items);
      this.vendorList = res.data.items;
      this.cdr.detectChanges();
    })
  }

  onItemSelect(item: any) {
    // console.log(item);

  }
  onItemDeselect(item: any) {
    // console.log(item);

  }
  onSelectAll(items: any) {
    // console.log(items);
  }

  initializeCompanyForm() {
    this.addCompanyForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      crNumber: ['', Validators.required],
      // usersNo: ['', Validators.required],
      themeColor: ['#e66465', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      smsNotification: [true, Validators.required],
      mailNotification: [false, Validators.required],
      companyType: ['', Validators.required],
      vendorIds: [[], Validators.required],
    });
  }
  editCompanyForm(data: any) {
    this.addCompanyForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
      crNumber: data?.crNumber,
      // usersNo: data?.name,
      themeColor: data?.themeColor,
      address: data?.address,
      description: data?.description,
      phone: data?.phone,
      email: data?.email,
      smsNotification: data?.smsNotification,
      mailNotification: data?.mailNotification,
      companyType: data?.companyTypeId,

    });
  }

  getSelectedVendors(ids: number[]) {
    let result: any = [];
    result = this.vendorList.filter((item: any) => ids?.includes(item.id));
    this.addCompanyForm.patchValue({
      vendorIds: result
    });
  }

  getCompanyId() {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = +params['id'];
      if (this.companyId) {
        this.companyService.getByID(this.companyId).subscribe(res => {
          setTimeout(() => {
            this.editCompanyForm(res.data);
            this.getSelectedVendors(res.data?.vendorIds);
          }, 500);
        });
      }
    });
  }

  saveSettings() {
    if (!this.companyId) {
      let formatVendors = []
      for (const iterator of this.addCompanyForm.value.vendorIds) {
        formatVendors.push(iterator.id)
      }
      const payload =
        { ...this.addCompanyForm.value, companyType: Number(this.addCompanyForm.value.companyType), vendorIds: formatVendors }
      this.companyService.addCompany(payload).subscribe(res => {
        this.router.navigateByUrl('companies')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Company Added successfully!' });
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      let formatVendors = []
      for (const iterator of this.addCompanyForm.value.vendorIds) {
        formatVendors.push(iterator.id)
      }
      const payload =
        { id: this.companyId, ...this.addCompanyForm.value, vendorIds: formatVendors }
      this.companyService.updateCompany(payload).subscribe(res => {
        this.router.navigateByUrl('companies')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Company Updated successfully!' });
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
