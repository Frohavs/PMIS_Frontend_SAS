
import { RfiService } from 'src/app/services/rfi.service';
import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-rfi-list',
  templateUrl: './rfi-list.component.html',
  styleUrl: './rfi-list.component.scss'
})
export class RfiListComponent {
  projectId: number;

  Add_text: string="Create";
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
  private _location: Location,
  private activatedRoute: ActivatedRoute,
  private cdr: ChangeDetectorRef,
  private translate: TranslateService,
  private rfiService: RfiService
){

}
ngOnInit(): void {
  this.getProjectId();
}

initFactoryList(id: number, pageIndex?: number, search?: string) {
  this.dataList = [];
  this.rfiService.getAll(id, pageIndex, search).subscribe(res => {
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
    this.initFactoryList(1, searchText)
  });
}

getProjectId() {
  this.activatedRoute.params.subscribe(params => {
    this.projectId = +params['id'];
    this.initFactoryList(this.projectId);
  });
}

redirectToNew() {
  this.router.navigateByUrl('projects/add-rfi/' + this.projectId)
}
factoryDetails(factory: any) {
  this.router.navigate(['projects/rfi-details/' + this.projectId], {
    queryParams: { rfiId: factory.id }
  });
}

deleteRfi(rfi: any) {
  this.deleteSwal.fire().then((clicked) => {
    if (clicked.isConfirmed) {
      this.isLoading = true;
      this.rfiService.deleteRfi(rfi.id).subscribe({
        next: (res) => {
          this.showAlert({ icon: 'success', title: 'Success!', text: 'RFI Deleted successfully!' });
          setTimeout(() => {
            this.isLoading = false;
            this.dataList = [];
            this.initFactoryList(this.projectId);
          }, 500);
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        }
      })
    }
  });
}
navigatePage(pageIndex: number) {
  this.selected = pageIndex;
  this.initFactoryList(this.projectId, pageIndex, '');
}

navigateArrows(next: boolean) {
  if(next) {
    if (this.selected === this.pagesCount.length) {
      return;
    } else {
      this.selected += 1;
      this.initFactoryList(this.projectId, this.selected);
    }
  } else {
    if (this.selected === 1) {
      return;
    } else {
      this.selected -= 1;
      this.initFactoryList(this.projectId, this.selected);
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
