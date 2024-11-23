import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { StumbledProjectsService } from 'src/app/services/stumbled-projects.service';

@Component({
  selector: 'app-stumbled-project-details',
  templateUrl: './stumbled-project-details.component.html',
  styleUrl: './stumbled-project-details.component.scss'
})
export class StumbledProjectDetailsComponent implements OnInit {

  projectId!:number;
  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  showacc = true;

  CatNameEn: string;
  CatNameAr: string;
  CatWeight: string;
  CatTypeId: number;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  @ViewChild('fileModal') fileModal: TemplateRef<any>;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private stumbledProjectsService: StumbledProjectsService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getProjectId();
    this.getStumbledProjects();
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }

  getStumbledProjects(pageIndex?: number, search?: string) {
    this.stumbledProjectsService.getAll(this.projectId,pageIndex, search).subscribe(res => {
      debugger
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  redirectToNew() {
    this.router.navigate([`stumbled-projects/create/${this.projectId}`]);
  }

  redirectToDetails(id: number) {
    debugger
    this.router.navigate([`stumbled-projects/view/${id}`], {
      queryParams: { stumbledId: id }
    });
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.getStumbledProjects(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.getStumbledProjects(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.getStumbledProjects(this.selected);
      }
    }
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
