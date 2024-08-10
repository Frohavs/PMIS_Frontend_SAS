import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.scss'
})
export class DailyReportComponent implements OnInit, AfterViewInit, OnDestroy {

  reportId: number;

  Add_text: string;
  Search_text: string;
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  private inputSubscription: Subscription;


  constructor(
    private router: Router,
    private elRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private dailyReportService: DailyReportService
  ) {
    this.Add_text = this.translate.instant('DAILYREPORT.Add_Report');
    this.Search_text = this.translate.instant('DAILYREPORT.Search');
  }

  ngOnInit(): void {
    this.getReportId();
    this.initDailyReportList();
  }

  initDailyReportList(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.dailyReportService.getAll(pageIndex, search).subscribe(res => {
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
      this.initDailyReportList(1, searchText)
    });
  }

  getReportId() {
    this.activatedRoute.params.subscribe(params => {
      this.reportId = params['id'];
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add-daily-report/' + this.reportId)
  }

  editDailyReport(report: any) {
    this.router.navigate(['projects/edit-daily-report/' + this.reportId], {
      queryParams: { reportId: report.id }
    })


  }

  deleteDailyReport(report: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.dailyReportService.deleteDailyReport(report.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Milestone Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initDailyReportList();
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

  approveReport(id: number) {
    console.log(id);
    this.dailyReportService.approveDailyReport(id).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Report Approved successfully!' });
      setTimeout(() => {
        this.isLoading = false;
        this.initDailyReportList();
      }, 500);
    }, () => {
      this.isLoading = false;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    })
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initDailyReportList(pageIndex, '');
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
