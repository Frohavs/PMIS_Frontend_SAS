import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { CompanyTypes } from '../../companies/add-company/company-types';

@Component({
  selector: 'app-add-eval-category',
  templateUrl: './add-eval-category.component.html',
  styleUrl: './add-eval-category.component.scss'
})
export class AddEvalCategoryComponent implements OnInit, OnDestroy {

  categoryId: number;
  subCategoryId: number;
  subCategoryName: string;
  isLoading: boolean;
  addSubCatForm: FormGroup;
  companyTypes: any[] = CompanyTypes;
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  vendorList: any = [];
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 8,
    allowSearchFilter: true,
  };

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private evaluationService: EvaluationCategoryService,
  ) {
  }

  ngOnInit() {
    this.initializeCompanyForm();
    this.getCompanyId();
  }

  initializeCompanyForm() {
    this.addSubCatForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
    });
  }
  editCompanyForm(subCategoryName: string) {
    this.addSubCatForm.patchValue({
      name: subCategoryName,
      nameAr: subCategoryName
    });
    this.cdr.detectChanges()
  }


  getCompanyId() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.categoryId = +params['categoryId'];
      this.subCategoryId = +params['subCategoryId'];
      this.subCategoryName = params['name'];
      if (this.subCategoryId) {
        this.editCompanyForm(this.subCategoryName);
      }
    });
  }

  saveSettings() {
    if (!this.subCategoryId) {
      const payload =
        { ...this.addSubCatForm.value, categoryId: this.categoryId }
      this.evaluationService.addEvalSubCategory(payload).subscribe(res => {
        this.addSubCatForm.reset();
        this.showAlert({ icon: 'success', title: 'Success!', text: 'added successfully, you can add another or return!' });
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      const payload =
        { id: this.subCategoryId, categoryId: this.categoryId, ...this.addSubCatForm.value }
        this.evaluationService.updateSubCategory(payload).subscribe(res => {
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Sub-Categories Updated successfully!' });
        setTimeout(() => {
          this.back()
        }, 1000);
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    }
  }

  back() {
    this._location.back();
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
