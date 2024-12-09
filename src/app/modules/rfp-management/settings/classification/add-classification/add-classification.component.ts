import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';


@Component({
  selector: 'app-add-classification',
  templateUrl: './add-classification.component.html',
  styleUrl: './add-classification.component.scss'
})
export class AddClassificationComponent implements OnInit {
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
    private projectsService: ProjectsService,
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
        this.rfpManagementService.getRFPClassificationById(this.classificationId).subscribe(res => {
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
      code: ['', Validators.required],
      mangerId: [null, Validators.required],
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
      code: data?.code,
      mangerId: data?.mangerId
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
      this.rfpManagementService.addRFPClassification(
        {
          ...this.addBoqForm.value,
          mangerId: +this.addBoqForm.value.mangerId
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`rfp_management/classification`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Classification Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    } else {
      this.rfpManagementService.updateClassification(
        {
          ...this.addBoqForm.value,
          id: +this.classificationId,
          mangerId: +this.addBoqForm.value.mangerId
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Classification Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`rfp_management/classification`);
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
