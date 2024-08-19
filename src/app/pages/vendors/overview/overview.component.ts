import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { VendorService } from 'src/app/services/vendors.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private vendorService: VendorService
  ) {
    this.Add_text = this.translate.instant('VENDORS.Add_Vendor');
    this.Search_text = this.translate.instant('VENDORS.Search');
  }

  ngOnInit(): void {
    this.initializeProjectData()
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initializeProjectData(1, searchText)
    });
  }

  initializeProjectData(pageIndex?: number, search?: string) {
    this.vendorService.getAll(pageIndex, search).subscribe(res => {
      this.totalCount = res?.data?.totalcount;
      this.dataList = res.data.items;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1) ;
      this.cdr.detectChanges();
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

  redirectToNew() {
    this.router.navigateByUrl('vendors/add')
  }

  editUser(user: any) {
    this.router.navigateByUrl('vendors/edit/' + user.id)
  }

  deleteUser(user: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.vendorService.deleteVendor(user.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeProjectData();
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

  navigateTo(event: any) {
    const route = event?.target.value;
    this.router.navigateByUrl(route + `/${'123'}`)
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initializeProjectData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if(next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initializeProjectData(this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initializeProjectData(this.selected, '');
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
