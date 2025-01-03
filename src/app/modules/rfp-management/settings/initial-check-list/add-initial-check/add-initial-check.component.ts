import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-initial-check',
  templateUrl: './add-initial-check.component.html',
  styleUrl: './add-initial-check.component.scss'
})
export class AddInitialCheckComponent implements OnInit {
  classificationId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;
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
      this.classificationId = params['initialId'];
      if (this.classificationId) {
        this.rfpManagementService.getRfpInitialCheckById(this.classificationId).subscribe(res => {
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
    });


  }

  getLookups() {
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
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
      this.rfpManagementService.addRfpInitialCheck(
        {
          ...this.addBoqForm.value,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`rfp_management/initial-check-list`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Record Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    } else {
      this.rfpManagementService.updateRfpInitialCheck(
        {
          ...this.addBoqForm.value,
          id: +this.classificationId,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Record Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_management/initial-check-list`);
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
    this.router.navigateByUrl('rfp_management/initial-check-list');
  }
  back() {
    this._location.back();
  }
}
