import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { fromEvent, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  activeTab: number = 0;
  etimadNumber: string = '';
  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  invoiceStatistics: any;

  exchangeForm: FormGroup;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('exchangeDataModal') exchangeDataModal: TemplateRef<any>;
  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initInvoicesList();
    this.getInvoiceStatistics();
    this.initDetailsForm();
  }

  initDetailsForm() {
    this.exchangeForm = this.fb.group({

      createCommittee: [false],
      createCommitteeDate: [''],

    });
  }

  getInvoiceStatistics() {
    this.invoiceService.getInvoiceStatistics().subscribe(res => {
      this.invoiceStatistics = res.data;
      this.cdr.detectChanges();
    });
  }

  initInvoicesList(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.invoiceService.getAll(null, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initInvoicesList(1, searchText)
    });
  }
  setActiveTab(index: number) {
    this.activeTab = index;
  }

  navigateExpenditure() {
    this.router.navigate(['invoices/expenditure'], {
      queryParams: { etimadId: this.etimadNumber }
    });
  }

  navigateInvoiceDetails(id: number) {
    this.router.navigate(['invoices/details'], {
      queryParams: { invoiceId: id }
    });
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initInvoicesList(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initInvoicesList(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initInvoicesList(this.selected);
      }
    }
  }

  invoiceExchangeData(invoice: any) {
    console.log('invoice', invoice);
    this.modalService.open(this.exchangeDataModal, this.modalConfig);
  }

  onSubmitDetails() {
    if (this.exchangeForm.invalid) {
      this.exchangeForm.markAllAsTouched();
      return;
    }

    const payload: any = {
      "createdAt": this.exchangeForm.get('signContractDate')?.value,
      "attachment": this.exchangeForm.get('signContractFile')?.value,
      "intialStep": 5,
    }

    // this.invoiceService.createDeliveryStatusItems({ items: this.statusDetails?.items.length ? filteredData : checkedItems }).subscribe(res => {
    //   this.getByID();
    //   this.modalService.dismissAll();
    //   this.showAlert({ icon: 'success', title: 'Success!', text: 'Status Updated successfully!' });

    //   this.cdr.detectChanges();
    // }, (error) => {
    //   this.modalService.dismissAll()
    //   this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    // });
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
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
