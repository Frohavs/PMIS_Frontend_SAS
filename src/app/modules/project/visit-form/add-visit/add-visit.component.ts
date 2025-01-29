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
      if (this.visitId) {
        this.visitFormService.getVisitById(this.visitId).subscribe((res) => {
          // edit here
          this.editVisitForm(res.data);
        });
      }
    });
  }

  initAddBoqForm() {
    this.addVisitForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      finalDate: [{ value: '', disabled: true }, Validators.required],
      justification: ['', Validators.required],
    });

    this.addVisitForm.get('fromDate')?.valueChanges.subscribe((val: string) => {
      const final = new Date(new Date(val).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      this.addVisitForm.patchValue({
        finalDate: final
      })
    });
  }

  editVisitForm(data: any) {
    this.addVisitForm.patchValue({
      fromDate: data?.fromDate.slice(0, 10),
      finalDate: data?.finalDate.slice(0, 10),
      justification: data?.justification,
    });
  }

  saveChanges() {
    if (!this.addVisitForm.valid) {
      this.addVisitForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if(!this.visitId) {
       
      const payload = {
        fromDate: this.addVisitForm.value.fromDate,
        justification: this.addVisitForm.value.justification,
        projectId: this.projectId,
      };
  
      this.visitFormService.addVisit(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/visit-list/${this.projectId}`);
          this.showAlert({
            icon: 'success',
            title: 'Success!',
            text: 'Visit Added successfully!',
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
    } else {
      const payload = {
        fromDate: this.addVisitForm.value.fromDate,
        justification: this.addVisitForm.value.justification,
        id: this.visitId,
      };
  
      this.visitFormService.editVisit(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/visit-list/${this.projectId}`);
          this.showAlert({
            icon: 'success',
            title: 'Success!',
            text: 'Visit Updated successfully!',
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
