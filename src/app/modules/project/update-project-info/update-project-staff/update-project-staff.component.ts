import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-project-staff',
  templateUrl: './update-project-staff.component.html',
  styleUrl: './update-project-staff.component.scss'
})
export class UpdateProjectStaffComponent implements OnInit{

  projectId: number;
  isLoading: boolean;
  UpdateStaffForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

    this.initUpdateStaffForm();
  }

  initUpdateStaffForm() {
    this.UpdateStaffForm = this.formBuilder.group({

      amana_manager: ['', Validators.required],
      project_consultant_manager: ['', Validators.required],
      project_contractor_manager: ['', Validators.required],
      project_consultant_data_entry: ['', Validators.required],
      project_contractor_data_entry: ['', Validators.required],
      project_consultant_hse: ['', Validators.required],
      project_contractor_hse: ['', Validators.required],
    });
  }

  back() {
    this._location.back();
  }

  saveProject() {
    if (!this.projectId) {
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
}
