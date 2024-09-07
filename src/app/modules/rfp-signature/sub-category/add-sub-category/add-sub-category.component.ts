import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
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
  projectId: number;
  subcatId: number;
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
    this.getBoqId();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.params.subscribe(params => {
      this.subcatId = params['id'];
      if (this.subcatId) {
        // this.rfpService.addRFPSignature(this.subcatId).subscribe(res => {
        //   setTimeout(() => {
        //     this.editVendorForm(res.data);
        //     this.cdr.detectChanges();
        //   }, 1000);
        // });
      }
    });
  }

  initAddBoqForm() {
    this.addRFPForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      rfpSignatureId: [null],
      categoryId: [null, Validators.required],
      authorId: [null, Validators.required],
      checkerId: [null, Validators.required],
    });

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
      rfpSignatureId: data?.rfpSignatureId,
      categoryId: data?.rfpSignatureId,
      authorId: data?.rfpSignatureId,
      checkerId: data?.rfpSignatureId,
    });
    this.cdr.detectChanges()
  }

  saveChanges() {

    if (!this.addRFPForm.valid) {
      this.addRFPForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    if (!this.subcatId) {
      this.rfpService.addRFPSignature(
        {
          ...this.addRFPForm.value,
        }
      ).subscribe({
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

    } else {
      this.rfpService.updateRFPSignature(
        {
          ...this.addRFPForm.value,
          id: this.subcatId,

        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'sub-category updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_signature/sub-category`);
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

  navigateBoqTable() {
    this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`);
  }
  back() {
    this._location.back();
  }
}
