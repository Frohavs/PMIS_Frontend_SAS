import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CompanyTypeService } from 'src/app/services/company-type.service';
import { CompanyService } from 'src/app/services/company.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NewUserService } from 'src/app/services/new-user.service';

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
    private newUserService: NewUserService
  ) {
  }

  ngOnInit() {
    this.getUserId();
    this.initializeUserForm();
    this.companyService.getAll().subscribe(res => {
      this.companies = res.data;
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
      password: data?.password,
      confirmPassword: data?.confirmPassword,
      companyId: data?.companyId,
      roleIds: data?.roleIds,
    });
  }

  getUserId() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.companyService.getByID(this.userId).subscribe(res => {
          setTimeout(() => {
            this.editUserForm(res.data);
          }, 500);
        });
      }
    });
  }

  saveUser() {
    debugger
    console.log({...this.addUserForm.value, companyId: 13, roleIds: ['test']});
    if (!this.userId) {
      this.newUserService.registerUser({...this.addUserForm.value, companyId: 13, roleIds: ['test']}).subscribe(res => {
        this.router.navigateByUrl('manage/users')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'User Added successfully!' });
      },() => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);
    } else {
      this.newUserService.updateUser({ id: this.userId, ...this.addUserForm.value }).subscribe(res => {
        this.router.navigateByUrl('manage/users')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'User Updated successfully!' });
      },() => this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' }))
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
