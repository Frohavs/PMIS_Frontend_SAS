import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-eval-category-details',
  templateUrl: './eval-category-details.component.html',
  styleUrl: './eval-category-details.component.scss'
})
export class EvalCategoryDetailsComponent implements OnInit {

  categoryId: number;
  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _location: Location,
    private evaluationService: EvaluationCategoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.getConsultantData();
      }
    });
  }

  getConsultantData(pageIndex?: number, search?: string) {
    console.log('getConsultantData');
    this.dataList = [];
    this.evaluationService.getAllSubCategory(this.categoryId, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  back() {
    this._location.back()
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.getConsultantData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.getConsultantData(this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.getConsultantData(this.selected, '');
      }
    }
  }
}
