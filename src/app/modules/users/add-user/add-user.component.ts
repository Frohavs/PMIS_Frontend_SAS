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
    this.getLookups();
  }

  getLookups() {
    this.companyService.getAll().subscribe(res => {
      this.companies = res.data;
      this.cdr.detectChanges();
    });
    this.roleService.getAll().subscribe(res => {
      this.roles = res.data;
      this.cdr.detectChanges();
    });
  }

  initializeUserForm() {
    this.addUserForm = this.formBuilder.group({

      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      companyId: [null],
      roleIds: [null],
    });
  }
  editUserForm(data: any) {
    this.addUserForm.patchValue({
      email: data?.email,
      companyId: data?.companyId,
      roleIds: this.roles?.filter(role => role?.name === 'Manger')[0]?.name,
    });
  }

  getUserId() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.newUserService.getUser(this.userId.toString()).subscribe(res => {
          setTimeout(() => {
            this.editUserForm(res.data);
          }, 500);
        });
      }
    });
  }

  saveUser() {
    if (!this.userId) {
      const payload = { ...this.addUserForm.value, companyId: +this.addUserForm.value.companyId, roleIds: [this.addUserForm.value.roleIds]};
      this.newUserService.registerUser(payload).subscribe(res => {
        this.router.navigateByUrl('manage/users')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'User Added successfully!' });
      }, () => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      const payload = { userId: this.userId, ...this.addUserForm.value, companyId: +this.addUserForm.value.companyId, roleIds: [this.addUserForm.value.roleIds]};
      delete payload['password'];
      delete payload['confirmPassword'];
      this.newUserService.updateUser(payload).subscribe(res => {
        this.router.navigateByUrl('manage/users')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'User Updated successfully!' });
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
