import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrl: './questions-page.component.scss'
})
export class QuestionsPageComponent implements OnInit, OnDestroy {

  rfpId: any;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  initialCheck: boolean = false;
  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private rfpManagementService: RfpManagementService,
  ) { }

  ngOnInit(): void {
    console.log(this.router.url);
    this.initialCheck = !!this.router.url.includes('initial-check-questions');
    this.activatedRoute.queryParams.subscribe(params => {
      this.rfpId = +params['rfpId'];
      if (this.rfpId) {
        this.initRfpList();
      }
    });
  }

  fireAnswerModal() {

  }

  initRfpList(rfpId?: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    debugger
    if (this.initialCheck) {
      this.rfpManagementService.getAllInitialChecks(this.rfpId, pageIndex, search).subscribe(res => {
        this.dataList = res?.data?.items;
        this.totalCount = res?.data?.totalcount;
        this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
        this.cdr.detectChanges();
      });
    } else {
      this.rfpManagementService.getRfpOwnerChecks(this.rfpId, pageIndex, search).subscribe(res => {
        this.dataList = res?.data?.items;
        this.totalCount = res?.data?.totalcount;
        this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
        this.cdr.detectChanges();
      });
    }
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initRfpList(this.rfpId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initRfpList(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initRfpList(this.selected);
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
  back() {
    this._location.back();
  }
}
