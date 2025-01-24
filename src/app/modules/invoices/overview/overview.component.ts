import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { fromEvent, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
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
  invoiceIdForExchange: number;

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
    private exchangeService: ExchangeDataService,
  ) { }

  ngOnInit(): void {
    this.initInvoicesList();
    this.getInvoiceStatistics();
    this.initDetailsForm();
    this.setupValueChangeListeners();
  }

  initDetailsForm() {
    this.exchangeForm = this.fb.group({
      workDoneValue: [0, Validators.required],// don't sum this one

      guaranteeDeduction: [0],
      delayPenalties: [0],
      supervisionFees: [0],
      hssePenalties: [0],
      materialShortagePenalties: [0],
      equipmentsShortagePenalties: [0],
      others: [0],
      // sum the above values in the input when value changes
      deductionFromOperationAndPartner: [{ value: 0, disabled: true }],
      // ---------------------------------------------------------------------------
      advancedPaymentReturn: [0],
      finalInvoiceDeduction: [0],
      supervisionFees1: [0],
      // sum the above 3 values in the input when value changes

      notDeductionFromOperationAndPartner: [{ value: 0, disabled: true }],

      netValueWithoutVAT: [{ value: 0, disabled: true }],
      vatValue: [0],
      totalWithVAT: [{ value: 0, disabled: true }],
      totalValue: [{ value: 0, disabled: true }],
    });
  }

  setupValueChangeListeners() {
    // Watch deduction-related fields and update the total
    const deductionFields = [
      'guaranteeDeduction',
      'delayPenalties',
      'supervisionFees',
      'hssePenalties',
      'materialShortagePenalties',
      'equipmentsShortagePenalties',
      'others',
    ];

    deductionFields.forEach((field) => {
      this.exchangeForm.get(field)!.valueChanges.subscribe(() => {
        this.updateDeductionFromOperationAndPartner();
      });
    });

    // Watch non-deduction fields and update the total
    const nonDeductionFields = [
      'advancedPaymentReturn',
      'finalInvoiceDeduction',
      'supervisionFees1',
    ];

    nonDeductionFields.forEach((field) => {
      this.exchangeForm.get(field)!.valueChanges.subscribe(() => {
        this.updateNotDeductionFromOperationAndPartner();
      });
    });

    // Watch VAT and Net Value to calculate total with VAT
    this.exchangeForm.get('vatValue')!.valueChanges.subscribe(() => {
      this.updateTotalWithVAT();
    });

  }

  updateDeductionFromOperationAndPartner() {
    const deductionFields = [
      'guaranteeDeduction',
      'delayPenalties',
      'supervisionFees',
      'hssePenalties',
      'materialShortagePenalties',
      'equipmentsShortagePenalties',
      'others',
    ];

    const total = deductionFields.reduce((sum, field) => {
      return sum + Number(this.exchangeForm.get(field)?.value || 0);
    }, 0);

    this.exchangeForm.get('deductionFromOperationAndPartner')?.setValue(total, {
      emitEvent: false,
    });
  }

  updateNotDeductionFromOperationAndPartner() {
    const nonDeductionFields = [
      'advancedPaymentReturn',
      'finalInvoiceDeduction',
      'supervisionFees1',
    ];

    const total = nonDeductionFields.reduce((sum, field) => {
      return sum + Number(this.exchangeForm.get(field)?.value || 0);
    }, 0);

    this.exchangeForm.get('notDeductionFromOperationAndPartner')?.setValue(total, {
      emitEvent: false,
    });
  }

  updateTotalWithVAT() {
    const netValue = Number(this.exchangeForm.get('netValueWithoutVAT')?.value || 0);
    const vatValue = Number(this.exchangeForm.get('vatValue')?.value || 0);

    const total = netValue + vatValue;

    this.exchangeForm.get('totalWithVAT')?.setValue(total, { emitEvent: false });
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

  invoiceExchangeData(invoiceId: number) {
    this.invoiceIdForExchange = invoiceId;
    this.exchangeService.getById(this.invoiceIdForExchange).subscribe(res => {
      if (res && res.data !== null) this.patchFormValues(res.data)
    });

  }

  patchFormValues(data: any) {
    this.exchangeForm.patchValue({
      workDoneValue: data?.workDoneValue,
      guaranteeDeduction: data?.guaranteeDeduction,
      delayPenalties: data?.delayPenalties,
      supervisionFees: data?.supervisionFees,
      hssePenalties: data?.hssePenalties,
      materialShortagePenalties: data?.materialShortagePenalties,
      equipmentsShortagePenalties: data?.equipmentsShortagePenalties,
      others: data?.others,
      deductionFromOperationAndPartner: data?.deductionFromOperationAndPartner,
      advancedPaymentReturn: data?.advancedPaymentReturn,
      finalInvoiceDeduction: data?.finalInvoiceDeduction,
      supervisionFees1: data?.supervisionFees1,
      notDeductionFromOperationAndPartner: data?.notDeductionFromOperationAndPartner,
      netValueWithoutVAT: data?.netValueWithoutVAT,
      vatValue: data?.vatValue,
      totalWithVAT: data?.totalWithVAT,
      totalValue: data?.totalValue,
    });

    this.modalService.open(this.exchangeDataModal, this.modalConfig);
    this.cdr.detectChanges();
  }


  onSubmitDetails() {
    console.log(this.exchangeForm?.value);
    if (this.exchangeForm.invalid) {
      this.exchangeForm.markAllAsTouched();
      return;
    }

    const payload: any = {
      ...this.exchangeForm.getRawValue(),
      "invoiceId": this.invoiceIdForExchange
    };

    this.exchangeService.addExchange(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Exchange Data Updated successfully!' });
      this.cdr.detectChanges();
    }, (error) => {
      this.modalService.dismissAll()
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
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
