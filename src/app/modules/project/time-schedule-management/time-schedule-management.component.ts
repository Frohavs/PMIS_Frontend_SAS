import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { SubContractorsService } from 'src/app/services/sub-contractors.service';
import { SweetAlertOptions } from 'sweetalert2';
import { TimeScheduleService } from 'src/app/services/time-schedule.service';

@Component({
  selector: 'app-time-schedule-management',
  templateUrl: './time-schedule-management.component.html',
  styleUrl: './time-schedule-management.component.scss'
})
export class TimeScheduleManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  Add_text: string = 'Add Flood';
  Search_text: string = 'search schedules';
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
    private timeScheduleService: TimeScheduleService,
  ) {
  }

  ngOnInit(): void {
    this.getProjectId();
    this.initScheduleList(this.projectId);
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }

  initScheduleList(id: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    this.timeScheduleService.getAll(id, pageIndex, search).subscribe(res => {
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
      this.initScheduleList(1, searchText)
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add-flood/' + this.projectId)
  }

  contractorDetails(letter: any) {
    this.router.navigate(['projects/edit-flood/' + this.projectId]);
  }

  deleteContractor(user: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.timeScheduleService.deleteFlood(user.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initScheduleList(this.projectId,);
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
    this.initScheduleList(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initScheduleList(this.projectId, this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initScheduleList(this.projectId, this.selected, '');
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
