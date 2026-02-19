import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CompanyService } from 'src/app/services/company.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NewUserService } from 'src/app/services/new-user.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit, OnDestroy {
  userId: number;
  isLoading: boolean;
  addUserForm: FormGroup;
  companies: any[] = [];
  roles: any[] = [];
  companyDropdownSettings: any;
  roleDropdownSettings: any;
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
    private newUserService: NewUserService
  ) {
  }

  ngOnInit() {
    this.getUserId();
    this.initializeUserForm();
    this.initializeDropdownSettings();
    this.getLookups();
  }

  initializeDropdownSettings() {
    this.companyDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Search company',
      noDataAvailablePlaceholderText: 'No company found'
    };

    this.roleDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Search role',
      noDataAvailablePlaceholderText: 'No role found'
    };
  }

  getLookups() {
    this.companyService.getAll().subscribe(res => {
      this.companies = res.data?.items || [];
      this.patchSelectedValues();
      this.cdr.detectChanges();
    });
    this.roleService.getAll().subscribe(res => {
      this.roles = res.data || [];
      this.patchSelectedValues();
      this.cdr.detectChanges();
    });
  }

  initializeUserForm() {
    this.addUserForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      companyId: [[], Validators.required],
      roleIds: [[], Validators.required],
    });
  }

  private patchSelectedValues() {
    if (!this.userId || !this.addUserForm || !this.companies.length || !this.roles.length) {
      return;
    }

    const currentCompany = this.addUserForm.value.companyId;
    const currentRole = this.addUserForm.value.roleIds;

    if (typeof currentCompany === 'number' || typeof currentCompany === 'string') {
      const selectedCompany = this.companies.find(item => item.id === +currentCompany);
      this.addUserForm.patchValue({ companyId: selectedCompany ? [selectedCompany] : [] }, { emitEvent: false });
    }

    if (Array.isArray(currentRole) && currentRole.length && typeof currentRole[0] === 'number') {
      const selectedRole = this.roles.find(item => item.id === +currentRole[0]);
      this.addUserForm.patchValue({ roleIds: selectedRole ? [selectedRole] : [] }, { emitEvent: false });
    }
  }

  editUserForm(data: any) {
    const selectedCompany = this.companies.find(item => item.id === +data?.companyId);

    let roleId: number | null = null;
    if (Array.isArray(data?.roleIds) && data.roleIds.length) {
      roleId = +data.roleIds[0];
    } else if (data?.roleId) {
      roleId = +data.roleId;
    }

    const selectedRole = this.roles.find(item => item.id === roleId);

    this.addUserForm.patchValue({
      fullName: data?.fullName || '',
      userName: data?.userName || '',
      email: data?.email,
      companyId: selectedCompany ? [selectedCompany] : (data?.companyId || []),
      roleIds: selectedRole ? [selectedRole] : (roleId ? [roleId] : []),
    });
  }

  getUserId() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.newUserService.getUser(this.userId.toString()).subscribe(res => {
          setTimeout(() => {
            this.editUserForm(res.data);
            this.patchSelectedValues();
          }, 500);
        });
      }
    });
  }

  saveUser() {
    const selectedCompany = this.addUserForm.value.companyId?.[0];
    const selectedRole = this.addUserForm.value.roleIds?.[0];

    if (!this.userId) {
      const payload = {
        ...this.addUserForm.value,
        companyId: selectedCompany?.id ? +selectedCompany.id : null,
        roleIds: selectedRole?.id ? [+selectedRole.id] : []
      };
      this.newUserService.registerUser(payload).subscribe(res => {
        this.router.navigateByUrl('manage/users');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'User Added successfully!' });
      }, (error) => {
        this.showAlert({
          icon: 'error', title: 'Error!', text:
            error.error.responseException.exceptionMessage.title || 'please try again!'
        });
      });
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      const payload = {
        userId: +this.userId,
        ...this.addUserForm.value,
        companyId: selectedCompany?.id ? +selectedCompany.id : null,
        roleIds: selectedRole?.id ? [+selectedRole.id] : []
      };
      delete payload['password'];
      delete payload['confirmPassword'];
      this.newUserService.updateUser(payload).subscribe(res => {
        this.router.navigateByUrl('manage/users');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'User Updated successfully!' });
      }, (error) => {
        this.showAlert({
          icon: 'error', title: 'Error!', text:
            error.error.responseException.exceptionMessage.title || 'please try again!'
        })
      });
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
