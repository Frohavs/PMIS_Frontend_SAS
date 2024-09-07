import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.invoiceId = +params['invoiceId'];
      this.etimadNumber = +params['etimadNumber'];
      if (this.invoiceId) {
        this.getInvoiceDetails();
      }
    });
  }

  getInvoiceDetails() {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe(res => {
      this.invoiceDetails = res.data;
      this.resetDataModel.id = this.invoiceDetails.id;
      debugger
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
      debugger
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
    debugger
    this.invoiceService.UpdateInvoiceClamRegisteration(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Invoice reset successfully!' });
      this.resetDataModel = { id: 0, isClaimRegistration: true, claimRegistrationCheckDate: '' };
      this.getInvoiceDetails();
    });
  }

  onSubmit(event: Event, myForm: NgForm) {

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
