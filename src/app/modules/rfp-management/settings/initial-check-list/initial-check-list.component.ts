import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-initial-check-list',
  templateUrl: './initial-check-list.component.html',
  styleUrl: './initial-check-list.component.scss'
})
export class InitialCheckListComponent implements OnInit, AfterViewInit, OnDestroy {

  Add_text: string;
  Search_text: string;
  dataList: any[] = []
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
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private rfpManagementService: RfpManagementService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initRfpList();
  }

  initRfpList(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.rfpManagementService.getAllInitialCheck(pageIndex, search).subscribe(res => {
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
      this.initRfpList(1, searchText);
    });
  }


  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  redirectToNew() {
    this.router.navigate(['rfp_management/add-initial-check']);
  }

  redirectToDetails(id: number) {
    this.router.navigate(['rfp_management/add-initial-check'], {
      queryParams: { initialId: id }
    });
  }


  // deleteClassification(id: number) {
  //   this.deleteSwal.fire().then((clicked) => {
  //     if (clicked.isConfirmed) {
  //       this.isLoading = true;
  //       this.rfpManagementService.deleteRfpClassification(id).subscribe({
  //         next: (res) => {
  //           this.showAlert({ icon: 'success', title: 'Success!', text: 'Classification Deleted successfully!' });
  //           setTimeout(() => {
  //             this.isLoading = false;
  //             this.dataList = [];
  //             this.initRfpList();
  //           }, 500);
  //         },
  //         error: (error) => {
  //           this.isLoading = false;
  //           this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
  //         }
  //       });
  //     }
  //   });
  // }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initRfpList(pageIndex, '');
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
}
