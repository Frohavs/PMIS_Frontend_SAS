import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss'
})
export class InvoiceDetailsComponent implements OnInit, OnDestroy {

  currentStep = 1;

  // modal configs
  isLoading = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  statusModel: { status: boolean } = { status: true };
  @ViewChild('UpdateStatusModal') UpdateStatusModal!: any;
  resetModel: { date: string, reason: string } = { date: '', reason: '' };
  @ViewChild('resetModal') resetModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;


  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {

  }

  openStatusModal() {
    this.modalService.open(this.UpdateStatusModal, this.modalConfig);
  }

  resetInvoiceModal() {
    this.modalService.open(this.resetModal, this.modalConfig);
  }

  cancelInvoice() {
    if (confirm('Are you sure you want to cancel this?') == true) {
      console.log('canceled');

    }
  }



  onResetSubmit(event: Event, myForm: NgForm) {

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
