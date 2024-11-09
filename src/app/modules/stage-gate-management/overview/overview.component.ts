import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  projects: any[] = [];

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('addGateModal') addGateModal!: any;
  addGateProjectInput: any;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private modalService: NgbModal,
    private projectsService: ProjectsService,
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.initStageData();
    this.getLookups();
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initStageData(1, searchText)
    });
  }


  initStageData(pageIndex?: number, search?: string) {
    this.stageGateManagementService.getAll(pageIndex, search).subscribe(res => {
      this.totalCount = res?.data?.totalcount;
      this.dataList = res.data.items;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  getLookups() {
    this.projectsService.getAll().subscribe(res => {
      this.projects = res.data.items;
    });
  }

  stageDetails(stage: any) {
    this.router.navigate([`projects/stage-gate-management/${stage.projectId}`], {
      queryParams: {
        stageId: stage.id,
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
    // this.router.navigate([`staff-evaluation/add`]);
    this.modalService.open(this.addGateModal, this.modalConfig);
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initStageData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initStageData(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initStageData(this.selected);
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

  onAddGateSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      myForm.controls['id'].markAsTouched();
      return;
    }
    this.isLoading = true;
    this.stageGateManagementService.createGateDeliverable(+this.addGateProjectInput).subscribe((res) => {
      this.isLoading = false;
      this.modalService.dismissAll();
      this.initStageData();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Gate Added successfully!' });
    }, () => {
      this.isLoading = false;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
