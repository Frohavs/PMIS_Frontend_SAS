import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss'
})
export class NewInvoiceComponent implements OnInit, OnDestroy {

  isLoading: boolean;
  addInvoiceForm: FormGroup;
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
  ) {
  }

  ngOnInit(): void {
    this.initializeCompanyForm();
  }

  initializeCompanyForm() {
    this.addInvoiceForm = this.formBuilder.group({
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

  saveSettings() {
    this.router.navigateByUrl('invoices/expenditure')

    // const payload = { ...this.addInvoiceForm.value }
    // this.invoiceService.addInvoice(payload).subscribe(res => {
    //   this.router.navigateByUrl('invoices/expenditure')
    //   this.showAlert({ icon: 'success', title: 'Success!', text: 'Company Updated successfully!' });
    // })
    // setTimeout(() => {
    //   this.isLoading = false;
    //   this.cdr.detectChanges();
    // }, 500);
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
