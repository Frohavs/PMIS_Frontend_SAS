import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StaffEvaluationService } from 'src/app/services/staff-evaluation.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  filterForm: FormGroup;
  users: any[] = []
  years: any[] = []
  quarters: any[] = [1,2,3,4]
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

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private lookupService: LookupService,
    private staffEvaluationService: StaffEvaluationService,
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.initializeProjectData();
    this.getLookups()
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

  initFilterForm() {
    this.filterForm = this.fb.group({
      employee: [null, Validators.required],
      year: [null, Validators.required],
      quarter: [null, Validators.required],
    });
  }

  initializeProjectData(pageIndex?: number, search?: string) {
    this.staffEvaluationService.getAll(pageIndex, search).subscribe(res => {
      this.totalCount = res?.data?.totalcount;
      this.dataList = res.data.items;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1) ;
      this.cdr.detectChanges();
    });
  }

  getLookups() {
    this.lookupService.getUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getYears().subscribe(res => {
      this.years = res.data;
      this.cdr.detectChanges();
    });

  }

  evalDetails(evalu: any) {
    this.router.navigate([`staff-evaluation/details`], {
      queryParams: {
        evalId: evalu.id,
       }
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
    if(this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }
    this.router.navigate([`staff-evaluation/add`], {
      queryParams: {
        userId: this.filterForm.get('employee')?.value,
        yearId: this.filterForm.get('year')?.value,
        quarter: this.filterForm.get('quarter')?.value,
       }
    });
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    // this.initializeProjectData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        // this.initializeProjectData(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        // this.initializeProjectData(this.selected);
      }
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

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
