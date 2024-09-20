import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-contractor-eval',
  templateUrl: './add-contractor-eval.component.html',
  styleUrl: './add-contractor-eval.component.scss'
})
export class AddContractorEvalComponent implements OnInit {

  evaluationId: number;
  form: FormGroup;
  scales: any[] = [];
  isLoading: boolean;
  categoriesData: any[] = [];
  currentStep = 0; // Track the current step

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-600px',
  };

  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private evaluationService: EvaluationCategoryService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.evaluationId = +params['evaluationId'];
    });
    this.lookupService.getEvaluationScales().subscribe((response: any) => {
      this.scales = response.data;
      this.cdr.detectChanges()
    });
    this.evaluationService.getAll(1).subscribe((response: any) => {
      this.categoriesData = response.data.items;  // categories array
      this.createForm();
    });
  }

  createForm() {
    // Create form with a FormArray for each category and its subcategories
    this.form = this.fb.group({
      categories: this.fb.array(this.categoriesData.map(category => this.createCategoryGroup(category)))
    });
  }

  // Create FormGroup for each category, with a FormArray of subcategories
  createCategoryGroup(category: any): FormGroup {
    return this.fb.group({
      name: [category.name],  // Display the category name
      subCategories: this.fb.array(category.subCategories.map((subCategory: any) => this.createSubCategoryGroup(subCategory)))
    });
  }

  // Create FormGroup for each subCategory
  createSubCategoryGroup(subCategory: any): FormGroup {
    return this.fb.group({
      evaluationId: this.evaluationId,
      subCategoryId: [subCategory.id],  // Hidden or stored field for subCategory ID
      scale: [0, [Validators.required, Validators.min(0)]],  // Initial value for scale
      justifications: ['', Validators.required],  // Justifications field
      attachment: ['']  // Attachment field
    });
  }

  // Getter for categories form array
  get categoriesFormArray() {
    return this.form?.get('categories') as FormArray;
  }

  // Get subCategories for a specific category
  getSubCategoriesFormArray(categoryIndex: number) {
    return this.categoriesFormArray.at(categoryIndex).get('subCategories') as FormArray;
  }

  onFileSelect(event: any, categoryIndex: number, subCategoryIndex: number) {
    const file = event.target.files[0];
    const subCategoryControl = this.getSubCategoriesFormArray(categoryIndex).at(subCategoryIndex) as any;
    subCategoryControl.get('attachment').setValue(file);
  }

  // Check if the current step (category form group) is valid
  isCurrentStepValid(): boolean {
    const categoryGroup = this.categoriesFormArray.at(this.currentStep) as FormGroup;
    return categoryGroup.valid; // Returns true if the current step form is valid
  }

  // Navigate to the next step
  nextStep() {
    // Get the current step's category and subcategories
    const currentCategory = this.categoriesFormArray.at(this.currentStep).value;
    const currentSubCategories = currentCategory.subCategories;

    // Prepare data for submission
    let result = [];
    for (const subCategory of currentSubCategories) {
      subCategory.scale = +subCategory.scale; // Ensure the scale is a number
      if (subCategory.scale !== 0) {
        result.push(subCategory);
      }
    }

    // Submit the current step's data
    if (result.length > 0) {
      this.evaluationService.CreateEvaluation(result).subscribe(
        (response: any) => {
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Step evaluation submitted successfully!' });

          // Move to the next step only after successful submission
          if (this.currentStep < this.categoriesFormArray.length - 1) {
            this.currentStep++;
          }

        },
        (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        }
      );
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit() {
    let result = []
    for (const element of this.form.value.categories) {
      for (const element2 of element.subCategories) {
        element2.scale = +element2.scale;
        if (element2.scale !== 0) {
          result.push(element2)
        }
      }
    }
    this.evaluationService.CreateEvaluation(result).subscribe((response: any) => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Evaluation Created successfully!' });
      setTimeout(() => {
        this.back();
      }, 2000);

    }, (error) => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
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

  back() {
    this._location.back();
  }
}
