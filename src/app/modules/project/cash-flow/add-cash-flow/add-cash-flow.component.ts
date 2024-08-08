import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { CompanyTypes } from 'src/app/modules/companies/add-company/company-types';
import { CompanyService } from 'src/app/services/company.service';
import { VendorService } from 'src/app/services/vendors.service';
import { SweetAlertOptions } from 'sweetalert2';
import { InvoiceTypes } from './invoice-types';
import { CashFlowService } from 'src/app/services/cash-flow.service';
import { TranslationService } from 'src/app/modules/i18n';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-cash-flow',
  templateUrl: './add-cash-flow.component.html',
  styleUrl: './add-cash-flow.component.scss'
})
export class AddCashFlowComponent implements OnInit, OnDestroy {

  projectId: number;
  isLoading: boolean;
  addCashForm: FormGroup;
  companyTypes: any[] = CompanyTypes;
  private unsubscribe: Subscription[] = [];

  months: any[] = [];
  yearId: number;

  invoiceTypes = InvoiceTypes;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private cashFlowService: CashFlowService,
    private translateService: TranslateService
  ) {
    this.months = [
      { name: this.translateService.instant('CASHFLOW.January'), value: 1 },
      { name: this.translateService.instant('CASHFLOW.February'), value: 2 },
      { name: this.translateService.instant('CASHFLOW.March'), value: 3 },
      { name: this.translateService.instant('CASHFLOW.April'), value: 4 },
      { name: this.translateService.instant('CASHFLOW.May'), value: 5 },
      { name: this.translateService.instant('CASHFLOW.June'), value: 6 },
      { name: this.translateService.instant('CASHFLOW.July'), value: 7 },
      { name: this.translateService.instant('CASHFLOW.August'), value: 8 },
      { name: this.translateService.instant('CASHFLOW.September'), value: 9 },
      { name: this.translateService.instant('CASHFLOW.October'), value: 10 },
      { name: this.translateService.instant('CASHFLOW.November'), value: 11 },
      { name: this.translateService.instant('CASHFLOW.December'), value: 12 },
    ]
  }

  ngOnInit() {
    this.getProjectId();

    this.addCashForm = this.formBuilder.group({
      total: [{ value: '', disabled: true }],
      estimatedCost: ['', Validators.required],
      cashflowItems: this.formBuilder.array(this.months.map(month => this.createCashflowItem(month.value)))
    });

    this.cashflowItems.valueChanges.subscribe(() => {
      this.updateTotal();
    });
  }

  updateTotal(): void {
    const total = this.cashflowItems.controls
      .map((item: any) => item.get('abstractValue').value || 0)
      .reduce((acc, value) => acc + value, 0);
    //@ts-ignore
    this.addCashForm?.get('total').setValue(total, { emitEvent: false });
  }

  createCashflowItem(month: number): FormGroup {
    return this.formBuilder.group({
      month: [month],
      yearId: [this.yearId],
      abstractValue: [false],
      abstractNumber: [''],
      abstractType: [1]
    });
  }

  get cashflowItems(): FormArray {
    return this.addCashForm.get('cashflowItems') as FormArray;
  }

  get estimatedCost(): FormControl {
    return this.addCashForm.get('estimatedCost') as FormControl;
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.yearId = +params['yearId'];
    });
  }


  saveSettings() {
    if (!this.estimatedCost.value) {
      this.addCashForm.markAllAsTouched();
      return;
    }

    const formValue = { projectId: this.projectId, ...this.addCashForm.value };
    formValue.cashflowItems.forEach((element: any) => {
      if (element.abstractValue === false) {
        element.abstractValue = 0;
      }
      if (element.abstractNumber === '') {
        element.abstractNumber = 0;
      }
    });

    // Process your form data here
    this.cashFlowService.addCashFlow(formValue).subscribe(res => {
      this.router.navigateByUrl('projects/cash-flow' + `/${this.projectId}`);
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Cash Flow Added successfully!' });
    }, (error) => {
      this.showAlert({
        icon: 'error', title: 'Error!', text:
          error.error.responseException.exceptionMessage.title || 'please try again!'
      });
    });
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
