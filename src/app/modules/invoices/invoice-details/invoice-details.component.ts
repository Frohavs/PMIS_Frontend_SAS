import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss'
})
export class InvoiceDetailsComponent implements OnInit, OnDestroy {

  etimadNumber: any;
  invoiceId: any;
  invoiceDetails: any;
  currentStep = 1;
  updateForm: FormGroup;

  // modal configs
  isLoading = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  statusModel: { status: boolean } = { status: true };
  @ViewChild('UpdateStatusModal') UpdateStatusModal!: any;
  resetDataModel: { id: any, isClaimRegistration: boolean, claimRegistrationCheckDate: string } = { id: 0, isClaimRegistration: true, claimRegistrationCheckDate: '' };
  @ViewChild('resetModal') resetModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;


  constructor(
    private modalService: NgbModal,
    private router: Router,
    private _location: Location,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this.initStatusForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.invoiceId = +params['invoiceId'];
      this.etimadNumber = +params['etimadNumber'];
      if (this.invoiceId) {
        this.getInvoiceDetails();
      }
    });
  }

  initStatusForm() {
    this.updateForm = this.fb.group({
      id: this.invoiceId,
      isClaimRegistration: [{ value: false, disabled: true }],
      claimRegistrationCheckDate: ['', [Validators.required, Validators.minLength(4)]],
      claimCheck: [false],
      claimCheckDate: ['', [Validators.required, Validators.minLength(4)]],
      approved: [false],
      approvedDate: ['', [Validators.required, Validators.minLength(4)]],
      isExchangeorder: [false],
      exchangeOrderReferenceNumber: ['', [Validators.required, Validators.minLength(4)]],
      isPaymentOrderRef: [false],
      paymentOrderReferenceNumber: ['', [Validators.required, Validators.minLength(4)]],
      isPaymentOrder: [false],
      paymentOrder: ['', [Validators.required, Validators.minLength(4)]],
      completed: [false],
    });
  }
  getInvoiceDetails() {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe(res => {
      this.invoiceDetails = res.data;
      this.updateForm.patchValue({
        isClaimRegistration: true,
        claimRegistrationCheckDate: this.invoiceDetails.etimadSubmitDate?.slice(0, 10) || null,
        claimCheck: this.invoiceDetails.claimCheck,
        claimCheckDate: this.invoiceDetails.claimCheckDate?.slice(0, 10) || null,
        approved: this.invoiceDetails.approved,
        approvedDate: this.invoiceDetails.approvedDate?.slice(0, 10) || null,
        isExchangeorder: this.invoiceDetails.isExchangeorder,
        exchangeOrderReferenceNumber: this.invoiceDetails.exchangeOrderReferenceNumber,
        isPaymentOrderRef: this.invoiceDetails.isPaymentOrderRef,
        paymentOrderReferenceNumber: this.invoiceDetails.paymentOrderReferenceNumber,
        isPaymentOrder: this.invoiceDetails.isPaymentOrder,
        paymentOrder: this.invoiceDetails.paymentOrder,
        completed: this.invoiceDetails.completed
      })
      this.cdr.detectChanges();


      this.resetDataModel.id = this.invoiceDetails.id;
    })
  }

  openStatusModal() {
    this.modalService.open(this.UpdateStatusModal, this.modalConfig);
  }

  resetInvoiceModal() {
    this.modalService.open(this.resetModal, this.modalConfig);
  }

  cancelInvoice() {
    if (confirm('Are you sure you want to cancel this?') == true) {


      this.invoiceService.cancelInvoice(this.invoiceDetails.id).subscribe(res => {
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Invoice Canceled successfully!' });
        this.router.navigate(['invoices/expenditure'], {
          queryParams: { etimadId: this.etimadNumber }
        });
      });
    }
  }



  onResetSubmit(event: Event, myForm: NgForm) {
    if (!this.resetDataModel.claimRegistrationCheckDate) {
      alert('Please select date');
      return;
    }
    const payload = {
      ...this.resetDataModel
    }


    this.invoiceService.UpdateInvoiceClamRegisteration(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Invoice reset successfully!' });
      this.resetDataModel = { id: 0, isClaimRegistration: true, claimRegistrationCheckDate: '' };
      this.getInvoiceDetails();
    });
  }

  onSubmitStatus() {
    // const val = this.updateForm.value
    const payload = {
      ...this.updateForm.value
    }
    delete payload.isClaimRegistration
    delete payload.claimRegistrationCheckDate
    this.invoiceService.UpdateInvoiceStatus(payload).subscribe(res => {


      // this.modalService.dismissAll();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Status Updated successfully!' });
      this.getInvoiceDetails();
    }, error => {


      this.modalService.dismissAll()
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });

    });
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

  ngOnDestroy(): void {

  }
}
