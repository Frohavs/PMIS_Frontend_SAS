import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AreaDistrictService } from 'src/app/services/area-district.service';
import { ProjectSitesService } from 'src/app/services/project-sites.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';
import { VisitFormService } from 'src/app/services/visit-form.service';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.scss',
})
export class AddVisitComponent implements OnInit {
  projectId: number;
  visitId: number;
  isLoading: boolean;
  addVisitForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private projectService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private visitFormService: VisitFormService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private areaDistrictService: AreaDistrictService
  ) {}

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getVisitId();
  }

  getVisitId() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.visitId = +params['visitId'];
      this.visitFormService.getVisitById(this.visitId).subscribe((res) => {
        // edit here
        this.editVisitForm(res.data);
      });
    });
  }

  initAddBoqForm() {
    this.addVisitForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      finalDate: [{value: '', disabled: true}, Validators.required],
      justification: ['', Validators.required],
    });
  }

  editVisitForm(data: any) {
    this.addVisitForm.patchValue({
      fromDate: data?.fromDate.slice(0, 10),
      finalDate: data?.finalDate.slice(0, 10),
      justification: data?.justification
    })
  }

  saveChanges() {
    if (!this.addVisitForm.valid) {
      this.addVisitForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.addVisitForm.getRawValue(),
      projectId: +this.projectId,
      districtIds: this.addVisitForm.value.districtIds?.map(
        (item: any) => +item.id
      ),
      areaIds: this.addVisitForm.value.areaIds?.map((item: any) => +item.id),
      value: +this.addVisitForm.value.value,
      latitude: this.addVisitForm.getRawValue().latitude.toString(),
      longitude: this.addVisitForm.getRawValue().longitude.toString(),
      weight: +this.addVisitForm.getRawValue().weight,
    };

    this.visitFormService.addSite(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl(`projects/project-sites/${this.projectId}`);
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'Site Added successfully!',
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
        this.isLoading = false;
      },
    });
  }

  numbersOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && charCode != 43 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  back() {
    this._location.back();
  }
}
