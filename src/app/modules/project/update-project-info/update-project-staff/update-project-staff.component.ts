import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from 'src/app/services/projects.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StaffTypes } from './staff-types';

@Component({
  selector: 'app-update-project-staff',
  templateUrl: './update-project-staff.component.html',
  styleUrl: './update-project-staff.component.scss'
})
export class UpdateProjectStaffComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  managers: any[] = [];
  UpdateStaffForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.initUpdateStaffForm();
    this.getProjectId()
    this.getLookups()
  }

  initUpdateStaffForm() {
    this.UpdateStaffForm = this.formBuilder.group({

      project_manager: ['', Validators.required],
      project_consultant_manager: ['', Validators.required],
      project_contractor_manager: ['', Validators.required],
      project_consultant_data_entry: ['', Validators.required],
      project_contractor_data_entry: ['', Validators.required],
      project_consultant_hse: ['', Validators.required],
      project_contractor_hse: ['', Validators.required],
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  getLookups() {
    this.lookupService.getManagerUsers().subscribe(res => {
      this.managers = res.data;
      this.cdr.detectChanges()
    });
  }

  back() {
    this._location.back();
  }

  saveProject() {
    const staff = [
      {
        userId: this.UpdateStaffForm.value.project_manager,
        staffType: StaffTypes.ProjectManager
      },
      {
        userId: this.UpdateStaffForm.value.project_consultant_manager,
        staffType: StaffTypes.ProjectConsultantManager
      },
      {
        userId: this.UpdateStaffForm.value.project_contractor_manager,
        staffType: StaffTypes.ProjectContractorManager
      },
      {
        userId: this.UpdateStaffForm.value.project_consultant_data_entry,
        staffType: StaffTypes.ProjectConsultantDataEntry
      },
      {
        userId: this.UpdateStaffForm.value.project_contractor_data_entry,
        staffType: StaffTypes.ProjectContractorDataEntry
      },
      {
        userId: this.UpdateStaffForm.value.project_consultant_hse,
        staffType: StaffTypes.ProjectConsultantHse
      },
      {
        userId: this.UpdateStaffForm.value.project_contractor_hse,
        staffType: StaffTypes.ProjectContractorHse
      },
    ]


    this.projectsService.updateProjectStaff({ projectId: this.projectId, staff: staff }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this._location.back();
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Staff Updated successfully' });
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      }
    });
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
}
