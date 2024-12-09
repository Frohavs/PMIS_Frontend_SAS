import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.scss'
})
export class AddSectionComponent implements OnInit {
  classificationId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;
  users: any[] = [];
  positions: any[] = [];

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
      this.classificationId = params['classId'];
      if (this.classificationId) {
        this.rfpManagementService.getRfpSectionById(this.classificationId).subscribe(res => {
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
      userId: ['', Validators.required],
      positionId: [null, Validators.required],
    });


  }

  getLookups() {
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
    this.rfpManagementService.getAllPosition().subscribe(res => {
      this.positions = res.data?.items;
      this.cdr.detectChanges();
    })
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      name: data?.name,
      nameAr: data?.nameAr,
      userId: data?.userId,
      positionId: data?.positionId
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
      this.rfpManagementService.addRfpSection(
        {
          ...this.addBoqForm.value,
          userId: +this.addBoqForm.value.userId,
          positionId: +this.addBoqForm.value.positionId
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`rfp_management/sections`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Section Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    } else {
      this.rfpManagementService.updateRfpSection(
        {
          ...this.addBoqForm.value,
          id: +this.classificationId,
          userId: +this.addBoqForm.value.userId,
          positionId: +this.addBoqForm.value.positionId
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Section Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_management/sections`);
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
    this.router.navigateByUrl('rfp_management/classification');
  }
  back() {
    this._location.back();
  }
}
