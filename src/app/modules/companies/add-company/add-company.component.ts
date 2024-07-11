import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent implements OnInit, OnDestroy {

  companyId: number;
  isLoading: boolean;
  addCompanyForm: FormGroup;
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService
  ) {
  }

  ngOnInit() {
    this.initializeCompanyForm();
    this.getCompanyId();
  }

  initializeCompanyForm() {
    this.addCompanyForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      // type: ['', Validators.required],
      crNumber: ['', Validators.required],
      // usersNo: ['', Validators.required],
      themeColor: ['#e66465', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      smsNotification: [true, Validators.required],
      mailNotification: [false, Validators.required],
    });
  }

  getCompanyId() {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = +params['id'];
      console.log('Company ID:', this.companyId);
    });
  }

  saveSettings() {
    console.log(this.addCompanyForm.value);
    this.companyService.addCompany(this.addCompanyForm.value).subscribe(res => {
      console.log(res);
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Company Added successfully!' });
      this.router.navigateByUrl('companies')
    })
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 1500);
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
