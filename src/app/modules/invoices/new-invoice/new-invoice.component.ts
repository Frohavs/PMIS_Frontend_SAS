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

  projectId: any;
  invoiceId: any;
  invoiceDetails: any;
  etimadNumber: any;

  isLoading: boolean;
  addInvoiceForm: FormGroup;
  private unsubscribe: Subscription[] = [];

  invoiceTypes: any[] = [
    { id: 1, name: 'on going' },
    { id: 2, name: 'final' },
    { id: 3, name: 'supervision fine' },
    { id: 4, name: 'advanced payment' }
  ]

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
    this.initAddForm();
    this.activatedRoute.params.subscribe(params => {
      this.invoiceId = +params['id'];
      if (this.invoiceId) {
        this.invoiceService.getInvoiceById(this.invoiceId).subscribe(res => {
          this.invoiceDetails = res.data;

          this.initEditForm(res.data);
        })
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.projectId = params['projectId'];
      this.etimadNumber = params['etimadNumber'];
    });
  }

  initAddForm() {
    this.addInvoiceForm = this.formBuilder.group({
      partiallyPaid: [false],
      reference: ['', Validators.required],
      value: [0],
      type: [null, Validators.required],
      mofNumber: ['', Validators.required],
      etimadSubmitDate: ['', Validators.required]
    });
  }
  initEditForm(data: any) {

    this.addInvoiceForm.patchValue({
      partiallyPaid: data?.partiallyPaid,
      reference: data?.reference,
      value: data?.value,
      type: data?.type,
      mofNumber: data?.mofNumber,
      etimadSubmitDate: data?.etimadSubmitDate?.slice(0, 10)
    });
  }

  saveSettings() {
    let payload = {
      projectId: +this.projectId,
      ...this.addInvoiceForm.value,
      type: +this.addInvoiceForm.value.type
    }
    if (!this.invoiceId) {
      this.invoiceService.createInvoice(payload).subscribe(res => {
        this.router.navigate(['invoices/expenditure'], {
          queryParams: { etimadId: this.etimadNumber }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Invoice Added successfully!' });
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);

    } else {
      payload.id = this.invoiceDetails.id;

      this.invoiceService.updateInvoice(payload).subscribe(res => {
        this.router.navigate(['invoices/expenditure'], {
          queryParams: { etimadId: this.etimadNumber }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Invoice Updated successfully!' });
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
