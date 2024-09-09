import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrl: './expenditure.component.scss'
})
export class ExpenditureComponent implements OnInit, AfterViewInit, OnDestroy {

  etimadNumber: any;
  projectId: any;
  projectDetails: any;

  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;

  // modal configs
  isLoading = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private projectsService: ProjectsService,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.etimadNumber = +params['etimadId'];
      if (this.etimadNumber) {
        debugger
        this.initInvoicesList(this.etimadNumber, 1, '');
      }
    });
  }

  initInvoicesList(etimadNumber?: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    this.invoiceService.getAll(etimadNumber, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.projectId = this.dataList[0]?.projectId;
      this.getProjectDetails();
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
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
    });
  }

  redirectToNew() {
    this.router.navigate(['invoices/add'], {
      queryParams: { projectId: this.projectId, etimadNumber: this.etimadNumber }
    });
  }
  editInvoice(id: number) {
    this.router.navigate([`invoices/edit/${id}`], {
      queryParams: { projectId: this.projectId, etimadNumber: this.etimadNumber }
    });
  }

  navigateInvoiceDetails(id: number) {
    this.router.navigate(['invoices/details'], {
      queryParams: { invoiceId: id, etimadNumber: this.etimadNumber }
    });
  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
