import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { RiskManagementService } from 'src/app/services/risk-managment.service';
import { SubContractorsService } from 'src/app/services/sub-contractors.service';
import { SweetAlertOptions } from 'sweetalert2';
import { InitialDeliveryService } from 'src/app/services/initial-delivery.service';


@Component({
  selector: 'app-initial-delivery-list',
  templateUrl: './initial-delivery-list.component.html',
  styleUrl: './initial-delivery-list.component.scss'
})
export class InitialDeliveryListComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  Add_text: string = 'create new';
  Search_text: string = 'search...';
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
    private subContractorsService: SubContractorsService,
    private initialDeliveryService: InitialDeliveryService,
  ) {
  }

  ngOnInit(): void {
    this.getProjectId();
    this.initDeliveryList(this.projectId);
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }

  initDeliveryList(id: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    this.initialDeliveryService.getAll(id, pageIndex, search).subscribe(res => {
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
      this.initDeliveryList(this.projectId, 1, searchText)
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add-delivery-list/' + this.projectId)
  }

  listDetails(id: any) {
    this.router.navigate(['projects/edit-delivery-list/' + this.projectId], {
      queryParams: { listId: id }
    });
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initDeliveryList(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initDeliveryList(this.projectId, this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initDeliveryList(this.projectId, this.selected, '');
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
