import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { RfpCategoryService } from 'src/app/services/rfp-category.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  catId: number;

  isLoading: boolean;
  addRFPForm: FormGroup;

  vats: any[] = [];
  units: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private rfpCategoryService: RfpCategoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getBoqId();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.catId = +params['id'];
      if (this.catId) {
        this.rfpCategoryService.getCategoryById(this.catId).subscribe(res => {
          this.initEditForm(res.data);
        })
      }
    });
  }

  initAddBoqForm() {
    this.addRFPForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
    });
  }
  initEditForm(data: any) {
    debugger
    this.addRFPForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
    });
  }

  saveChanges() {
    if (!this.addRFPForm.valid) {
      this.addRFPForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    if (!this.catId) {
      this.rfpCategoryService.addRFPSignatureCategory(
        {
          ...this.addRFPForm.value,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`rfp_signature/category`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Category Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });

    } else {
      this.rfpCategoryService.UpdateRFPSignatureCategory(
        {
          ...this.addRFPForm.value,
          id: this.catId,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Category Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_signature/category`);
          }, 1000);
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });
    }
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
