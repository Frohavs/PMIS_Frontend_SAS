import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
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
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private evaluationService: EvaluationCategoryService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    if (this.router.url.includes('consultant-evaluation')) {
      this.getConsultantData();
      this.CatTypeId = 2;
    } else {
      this.getContractorData();
      this.CatTypeId = 1;
    }
  }

  getConsultantData(pageIndex?: number, search?: string) {
    this.evaluationService.getAll(2, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }
  getContractorData(pageIndex?: number, search?: string) {
    this.evaluationService.getAll(1, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  redirectToNew() {
    this.modalService.open(this.fileModal, this.modalConfig)
  }

  onAddCat(event: Event, myForm: NgForm) {
    const payload = {
      weight: +this.CatWeight,
      name: this.CatNameEn,
      nameAr: this.CatNameAr,
      typeId: this.CatTypeId
    }
    this.evaluationService.addEvalCategory(payload).subscribe(res => {
      this.modalService.dismissAll();
      if (this.CatTypeId === 2) {

        this.router.navigate([`consultant-evaluation/add/${this.CatTypeId}`], {
          queryParams: {
            categoryId: res.data
          }
        });
      } else {
        this.router.navigate([`contractor-evaluation/add/${this.CatTypeId}`], {
          queryParams: {
            categoryId: res.data
          }
        });

      }
    }, (err) => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Weight can not be greater than 100' });
    })
  }

  redirectToDetails(id: number) {
    if (this.CatTypeId === 2) {

      this.router.navigate([`consultant-evaluation/details/${id}`]);
    } else {
      this.router.navigate([`contractor-evaluation/details/${id}`]);
    }
  }

  deleteCat(evalu: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.evaluationService.deleteCategory(evalu.id).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.CatTypeId === 2 ? this.getConsultantData() : this.getContractorData();
          },
          error: (error) => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.CatTypeId === 2 ? this.getConsultantData(pageIndex, '') : this.getContractorData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.CatTypeId === 2 ? this.getConsultantData(this.selected, '') : this.getContractorData(this.selected, '');
        this.getConsultantData(this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.CatTypeId === 2 ? this.getConsultantData(this.selected, '') : this.getContractorData(this.selected, '');
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
