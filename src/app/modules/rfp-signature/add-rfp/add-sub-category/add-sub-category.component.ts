import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { RfpCategoryService } from 'src/app/services/rfp-category.service';
import { RfpService } from 'src/app/services/rfp.service';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrl: './add-sub-category.component.scss'
})
export class AddSubCategoryComponent implements OnInit {
  rfpSignatureId: number;
  isLoading: boolean;
  addRFPForm: FormGroup;

  categories: any[] = [];
  users: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private rfpService: RfpService,
    private rfpCategoryService: RfpCategoryService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getSignatureId();
    this.getLookups();
  }

  getSignatureId() {
    this.activatedRoute.params.subscribe(params => {
      this.rfpSignatureId = +params['id'];
    });
  }

  // Initialize the form with a FormArray
  initAddBoqForm() {
    this.addRFPForm = this.formBuilder.group({
      signatures: this.formBuilder.array([this.createSignatureGroup()]) // Initialize with one group
    });
  }

  // Create a single form group for a signature entry
  createSignatureGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      categoryId: [null, Validators.required],
      authorId: [null, Validators.required],
      checkerId: [null, Validators.required],
    });
  }

  // Getter for the FormArray
  get signatures(): FormArray {
    return this.addRFPForm.get('signatures') as FormArray;
  }

  // Method to add a new signature entry to the FormArray
  addSignature() {
    this.signatures.push(this.createSignatureGroup());
  }
  // Method to remove a signature entry
  removeSignature(index: number) {
    this.signatures.removeAt(index);
  }

  getLookups() {

    this.rfpCategoryService.getAll().subscribe(res => {
      this.categories = res.data.items;
      this.cdr.detectChanges();
    });
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addRFPForm.patchValue({
      name: data?.name,
      nameAr: data?.name,
      categoryId: data?.categoryId,
      authorId: data?.authorId,
      checkerId: data?.checkerId,
    });
    this.cdr.detectChanges()
  }

  saveChanges() {

    if (!this.addRFPForm.valid) {
      this.addRFPForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    this.addRFPForm.value?.signatures?.forEach((element: any) => {
      element.authorId = +element.authorId;
      element.categoryId = +element.categoryId;
      element.checkerId = +element.checkerId;
      element.rfpSignatureId = this.rfpSignatureId;
    });
    const payload = this.addRFPForm.value?.signatures
    this.rfpCategoryService.addRFPSignatureSubCategory(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl(`rfp_signature/sub-category`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'sub-category added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        this.isLoading = false;
      }
    });
    // if (!this.subcatId) {

    // } else {
    //   this.rfpCategoryService.up(
    //     {
    //       ...this.addRFPForm.value,
    //       id: this.subcatId,

    //     }
    //   ).subscribe({
    //     next: (res) => {
    //       this.isLoading = false;
    //       this.showAlert({ icon: 'success', title: 'Success!', text: 'sub-category updated successfully!' });
    //       setTimeout(() => {
    //         this.router.navigateByUrl(`rfp_signature/sub-category`);
    //       }, 1000);
    //     },
    //     error: (error) => {
    //       this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    //       this.isLoading = false;
    //     }
    //   });
    // }
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
