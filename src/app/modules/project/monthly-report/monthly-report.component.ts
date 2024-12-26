import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { InitialDeliveryService } from 'src/app/services/initial-delivery.service';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  Add_text: string = 'create new';
  Search_text: string = 'search...';
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  hideCreateReport = false;

  // modal configs

  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };


  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private monthlyReportsService: MonthlyReportsService,
  ) {

  }

  ngOnInit(): void {
    this.getProjectId();
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.monthlyReportsService.checkMonthlyReportCreation({ projectId: this.projectId }).subscribe(res => {
          console.log('res', res);

        },(err) => {
          this.hideCreateReport = true;
          this.showAlert({ icon: 'error', title: 'Error!', text: err?.error?.responseException?.exceptionMessage?.errors?.global.join(' ') });
        });
      }
      this.initReportList(this.projectId);
    });
  }

  initReportList(id: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    this.monthlyReportsService.getAll(id, pageIndex, search).subscribe(res => {
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
      this.initReportList(this.projectId, 1, searchText)
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add_monthly_report/' + this.projectId)
  }

  listDetails(id: any) {
    this.router.navigate(['projects/monthly_report_details/' + this.projectId], {
      queryParams: { reportId: id }
    });
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initReportList(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initReportList(this.projectId, this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initReportList(this.projectId, this.selected, '');
      }
    }
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
}
