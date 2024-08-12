import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { CriticalPathService } from 'src/app/services/critical-path.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-critical-path',
  templateUrl: './critical-path.component.html',
  styleUrl: './critical-path.component.scss'
})
export class CriticalPathComponent implements OnInit, AfterViewInit, OnDestroy {

  projectId: number;

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
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private criticalPathService: CriticalPathService
  ) {
    this.Add_text = this.translate.instant('CRITICALPATH.Add_Path');
    this.Search_text = this.translate.instant('CRITICALPATH.Search');
  }

  ngOnInit(): void {
    this.getProjectId();
    this.initializeMilesStoneList();
  }

  initializeMilesStoneList(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.criticalPathService.getAll(pageIndex, search).subscribe(res => {
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
      this.initializeMilesStoneList(1, searchText)
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add-critical_path/' + this.projectId)
  }

  editCriticalPath(criticalPath: any) {
    this.router.navigate(['projects/edit-critical_path/' + this.projectId], {
      queryParams: { pathId: criticalPath.id }
    });
  }

  deleteCriticalPath(user: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.criticalPathService.deleteCriticalPath(user.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Path Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeMilesStoneList();
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

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initializeMilesStoneList(pageIndex, '');
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
