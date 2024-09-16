import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EvaluationCategoryService } from 'src/app/services/evaluation-category.service';

@Component({
  selector: 'app-add-contractor-eval',
  templateUrl: './add-contractor-eval.component.html',
  styleUrl: './add-contractor-eval.component.scss'
})
export class AddContractorEvalComponent implements OnInit {
  form: FormGroup;
  categoriesData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private evaluationService: EvaluationCategoryService,
  ) { }

  ngOnInit(): void {
    // Simulating API call to get categories data
    this.evaluationService.getAll(2).subscribe((response: any) => {
      // debugger
      this.categoriesData = response.data.items;  // Your categories array
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
      subCategoryId: [subCategory.id],  // Hidden or stored field for subCategory ID
      scale: [0, [Validators.required, Validators.min(0)]],  // Initial value for scale
      justifications: ['', Validators.required],  // Justifications field
      attachment: ['', Validators.required]  // Attachment field
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

  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      // Submit the form data here
    }
  }
}
