import { filter } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-consultant-eval-details',
  templateUrl: './consultant-eval-details.component.html',
  styleUrl: './consultant-eval-details.component.scss'
})
export class ConsultantEvalDetailsComponent implements OnInit {

  evaluationId: number;
  projectId: number;
  dataList: any[] = [];
  EvaluationDetails: any;
  projectDetails: any;
  evaluatedCategories: any;
  selectedCategory: number;
  scales: any[] = [];

  isLoading = false;
  @ViewChild('fileModal') fileModal: TemplateRef<any>;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-600px',
  };

  editScaledId: number;
  editScaledJustification: string;
  editScaledAttachment: any;

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
        this.getProjectDetails();
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.evaluationId = +params['evaluationId'];
      if (this.evaluationId) {
        this.getConsultantData();
        this.getAllSubCategory();
      }
    });

    this.lookupService.getEvaluationScales().subscribe((response: any) => {
      this.scales = response.data;
      this.cdr.detectChanges()
    });
  }

  getConsultantData(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.evaluationService.getById(this.projectId, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.cdr.detectChanges();
    });
  }

  getAllSubCategory() {
    this.evaluationService.getCategoriesByProjectId(this.evaluationId).subscribe(res => {
      this.evaluatedCategories = res.data.categories;
      this.selectedCategory = this.evaluatedCategories[0].id;
      this.EvaluationDetails = this.evaluatedCategories.filter((x: any) => x.id === this.selectedCategory)[0];
      this.cdr.detectChanges();
      this.cdr.detectChanges();
    });
  }


  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      this.cdr.detectChanges();
    });
  }

  onCatChange(event: Event): void {
    const catId = (event.target as HTMLSelectElement).value;
    this.selectedCategory = +catId;
    this.EvaluationDetails = this.evaluatedCategories.filter((x: any) => x.id === this.selectedCategory)[0];
    this.cdr.detectChanges();
  }

  editEval(evalu: any) {
    console.log(evalu);
    this.editScaledId = evalu.scaleId;
    this.editScaledJustification = evalu.justifications;
    debugger
    this.editScaledAttachment = null;
    this.modalService.open(this.fileModal, this.modalConfig)
    this.cdr.detectChanges();
  }

  onScaleEditChange(event: any) {

  }

  onEditEval(event: Event, myForm: NgForm) {
    // this.evaluationService.canCreateEvaluation(this.selectedMonth, 1, this.projectDetails.consultantId, this.projectId).subscribe(res => {
    //   if (res.data) {
    //     this.evaluationService.CreateMonthEvaluation(this.selectedMonth, 1, this.projectDetails.consultantId, this.projectId).subscribe(response => {
    //       this.modalService.dismissAll();
    //       this.router.navigate([`projects/add-consultant-evaluation/${this.projectId}`], {
    //         queryParams: { evaluationId: response.data }
    //       });
    //     });
    //   } else {
    //     this.showAlert({ icon: 'error', title: 'Error!', text: 'Evaluation is already created for this month' });
    //   }
    // })
  }

  handleDecision() {

  }

  back() {
    this._location.back()
  }
}
