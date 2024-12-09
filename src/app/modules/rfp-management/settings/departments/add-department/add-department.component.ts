import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent implements OnInit {
  classificationId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;
  classifications: any[] = [];
  positions: any[] = [];
  users: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private rfpManagementService: RfpManagementService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getLookups();
    this.initAddBoqForm();
    this.getClassificationId();
  }

  getClassificationId() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.classificationId = params['departmentId'];
      if (this.classificationId) {
        this.rfpManagementService.getRFPDepartmentById(this.classificationId).subscribe(res => {
          this.editVendorForm(res.data);
          this.cdr.detectChanges();
        });
      }
    });
  }

  initAddBoqForm() {
    this.addBoqForm = this.formBuilder.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      code: ['#000', Validators.required],
      mangerId: [null, Validators.required],
      userIds: [null, Validators.required],
      postionIds: [null, Validators.required],
      classificationIds: [null, Validators.required],
    });


  }

  getLookups() {
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
    this.rfpManagementService.getAllClassification().subscribe(res => {
      this.classifications = res.data.items;
      this.cdr.detectChanges();
    });
    this.rfpManagementService.getAllPosition().subscribe(res => {
      this.positions = res.data.items;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
      code: data?.code,
      mangerId: data?.mangerId,
      userIds: data?.userIds[0],
      postionIds: data?.postionIds[0],
      classificationIds: data?.classificationIds[0]
    });
    this.cdr.detectChanges()
  }

  saveChanges() {
    if (!this.addBoqForm.valid) {
      this.addBoqForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (!this.classificationId) {
      this.rfpManagementService.addRFPDepartment(
        {
          ...this.addBoqForm.value,
          mangerId: +this.addBoqForm.value.mangerId,
          userIds: [this.addBoqForm.value.userIds],
          postionIds: [this.addBoqForm.value.postionIds],
          classificationIds: [this.addBoqForm.value.classificationIds]
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`rfp_management/departments`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Department Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    } else {
      this.rfpManagementService.updateDepartment(
        {
          ...this.addBoqForm.value,
          id: +this.classificationId,
          mangerId: +this.addBoqForm.value.mangerId,
          userIds: [this.addBoqForm.value.userIds],
          postionIds: [this.addBoqForm.value.postionIds],
          classificationIds: [this.addBoqForm.value.classificationIds]
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Department Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_management/departments`);
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
    this.router.navigateByUrl('rfp_management/departments');
  }
  back() {
    this._location.back();
  }
}
