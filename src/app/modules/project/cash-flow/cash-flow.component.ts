import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { BoqService } from 'src/app/services/boq.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { CashFlowService } from 'src/app/services/cash-flow.service';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss'
})
export class CashFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  Add_text: string;
  Search_text: string;
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  selectedYear: number;
  years: any[] = [];

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  selectedFile: File;
  @ViewChild('fileModal') fileModal: TemplateRef<any>;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private cashFlowService: CashFlowService,
    private lookupService: LookupService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.Add_text = this.translate.instant('BOQ.Add_Boq');
    this.Search_text = this.translate.instant('BOQ.Search');
  }

  ngOnInit(): void {
    this.getProjectId();
    this.getLookups();
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      // console.log(event.target.value);
      this.initCashFlowData(this.projectId, 1, searchText)
    });
  }

  initCashFlowData(id: number, pageIndex?: number, search?: string) {
    this.cashFlowService.getAll(id, pageIndex, search).subscribe(res => {
      this.dataList = res.data.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.initCashFlowData(this.projectId)
      }
    });
  }

  getLookups() {
    this.lookupService.getCashFlowYears(this.projectId).subscribe(res => {
      this.years = res.data;
    });
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(project => {
      project.checked = isChecked ? true : false;
    });
  }

  checkUser(event: Event, id: string) {
    // const isChecked = (<HTMLInputElement>event.target).checked;
  }

  editCashFlow(cashflow: any) {
    this.router.navigate([`projects/cash-details/${this.projectId}`], {
      queryParams: { boqId: cashflow.id }
    });
  }

  deleteCashFlow(cashflow: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.cashFlowService.deleteCashFlow(cashflow.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Deleted successfully!' });
            setTimeout(() => {
              this.dataList = [];
              this.isLoading = false;
              this.getLookups();
              this.initCashFlowData(this.projectId);
            }, 500);
          },
          error: (error) => {
            this.isLoading = false;
            this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          }
        });
      }
    });
  }

  onYearChange(event: Event): void {
    const yearId = (event.target as HTMLSelectElement).value;
    this.selectedYear = +yearId;
  }

  redirectToNew() {
    this.modalService.open(this.fileModal, this.modalConfig)
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initCashFlowData(this.projectId, pageIndex, '');
  }

  onSendFile(event: Event, myForm: NgForm) {
    if (!this.selectedFile && !this.selectedYear) {
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.modalService.dismissAll()
      this.router.navigate(['projects/add-cash-flow', this.projectId], {
        queryParams: { yearId: this.selectedYear }
      });

    }, 1500);
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    // const fd = new FormData();
    // fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    // this.attachmentService.uploadAttachment(fd).subscribe(res => {
    //   this.EotModel['eotAttachment'] = this.selectedFile.name;
    // });
  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
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

  back() {
    this._location.back();
  }
}
