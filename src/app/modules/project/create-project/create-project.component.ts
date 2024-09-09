import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { ProjectsService } from 'src/app/services/projects.service';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ClassificationTypes, ContractStatus, ProjectSectors } from '../Dropdown-Types';
import { AreaDistrictService } from 'src/app/services/area-district.service';
import { NewUserService } from 'src/app/services/new-user.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit, AfterViewInit, OnDestroy {

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
  managers: any[] = [];
  consultants: any[] = [];
  contractors: any[] = [];
  private updating = false;
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private projectsService: ProjectsService,
    private areaDistrictService: AreaDistrictService,
  ) {
  }

  ngOnInit() {
    this.getProjectId();
    this.initializeUserForm();
    this.getLookups();
  }

  ngAfterViewInit(): void {
    this.addProjectForm.valueChanges.subscribe(values => {
      if (!this.updating && values.duration) {
        this.updating = true;
        const newDate = new Date(values.executionStartDate);
        if (this.durationDays.value) {
          newDate.setDate(newDate.getDate() + values.duration);
        } else {
          newDate.setMonth(newDate.getMonth() + values.duration);
        }
        this.addProjectForm.get('originalFinishDate')?.setValue(newDate.toISOString().slice(0, 10));
        this.updating = false;
      }
    });
  }

  getLookups() {
    this.areaDistrictService.getAreas().subscribe(res => {
      this.municipalities = res.data;
    });
    this.areaDistrictService.getDistricts().subscribe(res => {
      this.Districts = res.data;
    });
    this.lookupService.getManagerUsers().subscribe(res => {
      this.managers = res.data;
      this.cdr.detectChanges()
    });
    this.lookupService.getVendorType(1).subscribe(res => {
      this.consultants = res.data;
    });
    this.lookupService.getVendorType(2).subscribe(res => {
      this.contractors = res.data;
    });
  }

  initializeUserForm() {
    this.addProjectForm = this.formBuilder.group({
      contractStatus: ['', Validators.required],
      classification: ['', Validators.required],
      projectSector: ['', Validators.required],
      nameAr: ['', Validators.required],
      name: ['', Validators.required],
      contractorId: ['', Validators.required],
      consultantId: ['', Validators.required],
      durationDays: [true],
      duration: ['', Validators.required],// Original Duration
      contractNo: ['', Validators.required],
      contract_date: ['', Validators.required],
      originalValue: ['', Validators.required],
      managerId: ['', Validators.required],
      areaId: ['', Validators.required],
      districtId: ['', Validators.required],
      executionStartDate: ['', Validators.required],
      etimadNumber: ['', Validators.required],
      originalFinishDate: ['']
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.projectsService.getByID(this.projectId).subscribe(res => {
          setTimeout(() => {
            this.editProjectForm(res.data);
            this.cdr.detectChanges();
          }, 1000);
        });
      }
    });
  }

  editProjectForm(data: any) {
    this.addProjectForm.patchValue({
      contractStatus: data?.contractStatusId,
      classification: data?.classificationId,
      projectSector: data?.projectSectorId,
      nameAr: data?.nameAr,
      name: data?.name,
      contractorId: data?.contractorId,
      consultantId: data?.consultantId,
      contractNo: data?.contractNo,
      contract_date: data?.createdDate?.slice(0, 10),
      originalValue: data?.originalValue,
      managerId: data?.managerId,
      areaId: data?.areaId,
      districtId: data?.districtId,
      executionStartDate: data?.executionStartDate?.slice(0, 10),
      originalFinishDate: data?.originalFinishDate?.slice(0, 10),
      etimadNumber: data?.etimadNumber,
    });
  }

  saveProject() {
    if (!this.projectId) {
      const payload = {
        name: this.addProjectForm.value.name,
        nameAr: this.addProjectForm.value.nameAr,
        classification: +this.addProjectForm.value.classification,
        contractStatus: +this.addProjectForm.value.contractStatus,
        projectSector: +this.addProjectForm.value.projectSector,
        contractNo: this.addProjectForm.value.contractNo,
        executionStartDate: this.addProjectForm.value.executionStartDate,
        createdDate: new Date(),
        originalFinishDate: this.addProjectForm.value.originalFinishDate,
        etimadNumber: +this.addProjectForm.value.etimadNumber,
        originalValue: +this.addProjectForm.value.originalValue,
        consultantId: +this.addProjectForm.value.consultantId,
        contractorId: +this.addProjectForm.value.contractorId,
        managerId: +this.addProjectForm.value.managerId,
        districtId: +this.addProjectForm.value.districtId
      };
      this.projectsService.addProject(payload).subscribe(res => {
        this.router.navigateByUrl('projects');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Added successfully!' });
      }, () => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      const payload = {
        id: this.projectId,
        name: this.addProjectForm.value.name,
        nameAr: this.addProjectForm.value.nameAr,
        classification: +this.addProjectForm.value.classification,
        contractStatus: +this.addProjectForm.value.contractStatus,
        projectSector: +this.addProjectForm.value.projectSector,
        contractNo: this.addProjectForm.value.contractNo,
        executionStartDate: this.addProjectForm.value.executionStartDate,
        createdDate: new Date(),
        originalFinishDate: this.addProjectForm.value.originalFinishDate,
        etimadNumber: +this.addProjectForm.value.etimadNumber,
        originalValue: +this.addProjectForm.value.originalValue,
        consultantId: +this.addProjectForm.value.consultantId,
        contractorId: +this.addProjectForm.value.contractorId,
        managerId: +this.addProjectForm.value.managerId,
        districtId: +this.addProjectForm.value.districtId
      };
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

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  get durationDays(): FormControl {
    return this.addProjectForm.get('durationDays') as FormControl;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
