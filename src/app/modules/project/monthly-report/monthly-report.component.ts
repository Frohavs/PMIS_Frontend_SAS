import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { InitialDeliveryService } from 'src/app/services/initial-delivery.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  // Add_text: string = 'create new';
  Search_text: string = 'search...';
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;

  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private initialDeliveryService: InitialDeliveryService,
  ) {
  }

  ngOnInit(): void {
    this.getProjectId();
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.initReportList(this.projectId);
      }
    });
  }

  initReportList(id: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    this.initialDeliveryService.getAll(id, pageIndex, search).subscribe(res => {
      // this.dataList = res?.data?.items;
      // this.totalCount = res?.data?.totalcount;
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
}
