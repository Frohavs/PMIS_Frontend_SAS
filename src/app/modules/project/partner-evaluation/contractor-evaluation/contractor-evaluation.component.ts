import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from 'src/app/services/projects.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-contractor-evaluation',
  templateUrl: './contractor-evaluation.component.html',
  styleUrl: './contractor-evaluation.component.scss'
})
export class ContractorEvaluationComponent implements OnInit {

  projectId: number;
  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  projectDetails: any;
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;

  years: any[] = []
  months: any[] = []
  isLoading = false;
  isCollapsed1 = false;
  selectedMonth: number;
  currentConsultant: string;

  @ViewChild('fileModal') fileModal: TemplateRef<any>;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-600px',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private _location: Location,
    private projectsService: ProjectsService,
    private lookupService: LookupService,
    private evaluationService: EvaluationCategoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getContractorData();
        this.getProjectDetails();
      }
    });
    this.getLookups();
  }

  getContractorData(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.evaluationService.getById(1, this.projectId, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  getLookups() {
    this.lookupService.getYears().subscribe(res => {
      this.years = res.data;
      this.cdr.detectChanges()
    });
    this.lookupService.getMonths().subscribe(res => {
      this.months = res.data;
      this.cdr.detectChanges()
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      this.currentConsultant = this.projectDetails.consultantName || '--';
      this.cdr.detectChanges();
    });
  }

  redirectToNew() {
    this.modalService.open(this.fileModal, this.modalConfig)
  }

  redirectToDetails(evalu: any) {
    this.router.navigate([`projects/contractor-eval-details/${this.projectId}`], {
      queryParams: { evaluationId: evalu.id }
    });
  }

  back() {
    this._location.back()
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.getContractorData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.getContractorData(this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.getContractorData(this.selected, '');
      }
    }
  }

  onMonthChange(event: Event): void {
    const yearId = (event.target as HTMLSelectElement).value;
    this.selectedMonth = +yearId;
  }

  onCheckEval(event: Event, myForm: NgForm) {
    this.evaluationService.canCreateEvaluation(1, this.selectedMonth, 1, this.projectDetails.consultantId, this.projectId).subscribe(res => {
      if (res.data) {
        this.evaluationService.CreateMonthEvaluation(1, this.selectedMonth, 1, this.projectDetails.consultantId, this.projectId).subscribe(response => {
          this.modalService.dismissAll();
          this.router.navigate([`projects/add-contractor-evaluation/${this.projectId}`], {
            queryParams: { evaluationId: response.data }
          });
        });
      } else {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Evaluation is already created for this month' });
      }
    })
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

