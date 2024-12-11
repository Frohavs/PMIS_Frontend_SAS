import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.scss'
})
export class AddPositionComponent implements OnInit {
  classificationId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;
  users: any[] = [];
  classifications: any[] = [];

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
        this.rfpManagementService.getRFPPositionById(this.classificationId).subscribe(res => {
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
      administratorId: [null, Validators.required],
      classificationId: [null, Validators.required],
    });
  }

  getLookups() {
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRfpClassifications().subscribe(res => {
      this.classifications = res.data;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
      administratorId: data?.administratorId,
      classificationId: data?.classificationId
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
      this.rfpManagementService.addRFPPosition(
        {
          ...this.addBoqForm.value,
          administratorId: +this.addBoqForm.value.administratorId,
          classificationId: +this.addBoqForm.value.classificationId
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`rfp_management/positions`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Position Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    } else {
      this.rfpManagementService.updatePosition(
        {
          ...this.addBoqForm.value,
          id: +this.classificationId,
          administratorId: +this.addBoqForm.value.administratorId,
          classificationId: +this.addBoqForm.value.classificationId
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Position Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_management/positions`);
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
    this.router.navigateByUrl('rfp_management/positions');
  }
  back() {
    this._location.back();
  }
}
