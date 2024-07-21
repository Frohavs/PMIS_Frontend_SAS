import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { ProjectsService } from 'src/app/services/projects.service';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ClassificationTypes, ContractStatus, ProjectSectors } from '../Dropdown-Types';
import { AreaDistrictService } from 'src/app/services/area-district.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  addProjectForm: FormGroup;
  companies: any[] = [];
  roles: any[] = [];
  contractorStatuses: any[] = ContractStatus;
  projectSectors: any[] = ProjectSectors;
  classification: any[] = ClassificationTypes;
  Districts: any[] = [];
  municipalities: any[] = [];
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private areaDistrictService: AreaDistrictService,
    private roleService: RoleService,
    private projectsService: ProjectsService
  ) {
  }

  ngOnInit() {
    this.getProjectId();
    this.initializeUserForm();
    this.getLookups();
  }

  getLookups() {
    this.areaDistrictService.getAreas().subscribe(res => {
      this.municipalities = res.data;
    });
    this.areaDistrictService.getDistricts().subscribe(res => {
      this.Districts = res.data;
    });
  }

  initializeUserForm() {
    this.addProjectForm = this.formBuilder.group({
      contractStatus: ['', Validators.required],
      classification: ['', Validators.required],
      projectSector: ['', Validators.required],
      project_name: ['', Validators.required],
      project_nameEn: ['', Validators.required],
      contractorId: ['', Validators.required],
      consultantId: ['', Validators.required],
      duration: ['', Validators.required],// Original Duration
      program_name: ['', Validators.required],
      contract_no: ['', Validators.required],
      contract_date: ['', Validators.required],
      project_value: ['', Validators.required],
      managerId: ['', Validators.required],
      areaId: ['', Validators.required],
      districtId: ['', Validators.required],
      st_date: ['', Validators.required],// Execution Start Date
      en_date: [{ value: '', disabled: true }, Validators.required],// Original Finish Date
    });
  }
  editProjectForm(data: any) {
    // this.addProjectForm.patchValue({

    // });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        // this.projectsService.getProject(this.userId.toString()).subscribe(res => {
        //   setTimeout(() => {
        //     this.editProjectForm(res.data);
        //   }, 500);
        // });
      }
    });
  }

  saveProject() {
    if (!this.projectId) {
      const payload = { ...this.addProjectForm.value };
      this.projectsService.addProject(payload).subscribe(res => {
        this.router.navigateByUrl('projects');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Added successfully!' });
      }, () => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      const payload = { projectId: this.projectId, ...this.addProjectForm.value };
      this.projectsService.updateProject(payload).subscribe(res => {
        this.router.navigateByUrl('projects');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Updated successfully!' });
      }, () => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    }
  }

  back() {
    this._location.back();
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
