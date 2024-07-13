import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { CompanyTypeService } from 'src/app/services/company-type.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent implements OnInit, OnDestroy {

  companyId: number;
  isLoading: boolean;
  addCompanyForm: FormGroup;
  companyTypes: any[] = [];
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private companyTypeService: CompanyTypeService
  ) {
  }

  ngOnInit() {
    this.getCompanyId();
    this.initializeCompanyForm();
    this.companyTypeService.getAll().subscribe(res => {
      this.companyTypes = res.data;
      this.cdr.detectChanges();
    });
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
      companyTypeId: ['', Validators.required],
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
      companyTypeId: data?.companyTypeId,
    });
  }

  getCompanyId() {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = +params['id'];
      if (this.companyId) {
        this.companyService.getByID(this.companyId).subscribe(res => {
          setTimeout(() => {
            this.editCompanyForm(res.data);
          }, 500);
        });
      }
    });
  }

  saveSettings() {
    console.log(this.addCompanyForm.value);
    if (!this.companyId) {
      this.companyService.addCompany(this.addCompanyForm.value).subscribe(res => {
        this.router.navigateByUrl('companies')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Company Added successfully!' });
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      this.companyService.updateCompany({id: this.companyId, ...this.addCompanyForm.value}).subscribe(res => {
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
