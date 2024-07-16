import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { NewUserService } from 'src/app/services/new-user.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {

  userId: number;
  isLoading: boolean;
  addProjectForm: FormGroup;
  companies: any[] = [];
  roles: any[] = [];
  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private roleService: RoleService,
    private projectsService: ProjectsService
  ) {
  }

  ngOnInit() {
    this.getUserId();
    this.initializeUserForm();
    this.getLookups();
  }

  getLookups() {
    // this.companyService.getAll().subscribe(res => {
    //   this.companies = res.data;
    //   this.cdr.detectChanges();
    // });
    // this.roleService.getAll().subscribe(res => {
    //   this.roles = res.data;
    //   this.cdr.detectChanges();
    // });
  }

  initializeUserForm() {
    this.addProjectForm = this.formBuilder.group({

      project_stage: ['', Validators.required],
      classification: ['', Validators.required],
      project_sector: ['', Validators.required],
      project_name: ['', Validators.required],
      project_nameEn: ['', Validators.required],
      Contractor: ['', Validators.required],
      contractor: ['', Validators.required],
      Consultant: ['', Validators.required],
      project_number: ['', Validators.required],
      program_type: ['', Validators.required],
      door: ['', Validators.required],
      duration: ['', Validators.required],
      program_name: ['', Validators.required],
      contract_no: ['', Validators.required],
      contract_date: ['', Validators.required],
      etimad_number: ['', Validators.required],
      project_value: ['', Validators.required],
      amana_manager: ['', Validators.required],
      st_date: ['', Validators.required],


      email: ['', Validators.required],
      companyId: [null],
      roleIds: [null],
    });
  }
  editUserForm(data: any) {
    this.addProjectForm.patchValue({
      email: data?.email,
      companyId: data?.companyId,
      roleIds: this.roles?.filter(role => role?.name === 'Manger')[0]?.name,
    });
  }

  getUserId() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        // this.projectsService.getProject(this.userId.toString()).subscribe(res => {
        //   setTimeout(() => {
        //     this.editUserForm(res.data);
        //   }, 500);
        // });
      }
    });
  }

  saveProject() {
    if (!this.userId) {
      const payload = { ...this.addProjectForm.value, companyId: +this.addProjectForm.value.companyId, roleIds: [this.addProjectForm.value.roleIds] };
      // this.newUserService.registerUser(payload).subscribe(res => {
      //   this.router.navigateByUrl('manage/users');
      //   this.showAlert({ icon: 'success', title: 'Success!', text: 'User Added successfully!' });
      // }, () => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      // setTimeout(() => {
      //   this.isLoading = false;
      //   this.cdr.detectChanges();
      // }, 500);
    } else {
      // const payload = { userId: this.userId, ...this.addProjectForm.value, companyId: +this.addProjectForm.value.companyId, roleIds: [this.addProjectForm.value.roleIds] };
      // delete payload['password'];
      // delete payload['confirmPassword'];
      // this.newUserService.updateUser(payload).subscribe(res => {
      //   this.router.navigateByUrl('manage/users');
      //   this.showAlert({ icon: 'success', title: 'Success!', text: 'User Updated successfully!' });
      // }, () => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      // setTimeout(() => {
      //   this.isLoading = false;
      //   this.cdr.detectChanges();
      // }, 500);
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
