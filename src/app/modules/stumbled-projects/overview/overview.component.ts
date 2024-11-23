import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

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
    private projectService: ProjectsService,
    private evaluationService: EvaluationCategoryService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getStumbledProjects();
  }

  getStumbledProjects(pageIndex?: number, search?: string) {
    this.projectService.getStumbledProjects(pageIndex, search).subscribe(res => {
      debugger
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }
  redirectToNew() {
    this.modalService.open(this.fileModal, this.modalConfig)
  }

  redirectToDetails(id: number) {
    this.router.navigate([`stumbled-projects/details/${id}`]);
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
