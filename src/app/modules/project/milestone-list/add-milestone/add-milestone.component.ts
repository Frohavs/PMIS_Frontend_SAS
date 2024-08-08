import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';
import { MilestoneService } from 'src/app/services/milestone.service';

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrl: './add-milestone.component.scss'
})
export class AddMilestoneComponent implements OnInit, OnDestroy {
  projectId: number;
  mileStoneId: number;
  isLoading: boolean;
  addMileStoneForm: FormGroup;

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
    private milestoneService: MilestoneService
  ) {
  }

  ngOnInit() {
    this.getMileStoneId();
    this.initMileStoneForm();

  }

  initMileStoneForm() {
    this.addMileStoneForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      actualStartDate: [''],
      actualEndDate: [''],
    });
  }
  editUserForm(data: any) {
    this.addMileStoneForm.patchValue({
      fullName: data?.fullName || '',
      userName: data?.userName || '',
      email: data?.email,
      companyId: data?.companyId,
    });
  }

  getMileStoneId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.mileStoneId = +params['mileStoneId'];
      if (this.mileStoneId) {
        this.milestoneService.getById(this.mileStoneId).subscribe(res => {
          debugger
          this.initMileStoneEditForm(res.data);
        })
      }
    });
  }

  initMileStoneEditForm(data: any) {
    this.addMileStoneForm.patchValue({
      title: data?.title ,
      description: data?.description ,
      startDate: data?.startDate.slice(0, 10) ,
      endDate: data?.endDate.slice(0, 10) ,
      actualStartDate: data?.actualStartDate.slice(0, 10) ,
      actualEndDate: data?.actualEndDate.slice(0, 10) ,
    });
  }

  saveUser() {
    if (!this.mileStoneId) {
      const payload = { ...this.addMileStoneForm.value, projectId: this.projectId };
      this.milestoneService.addMileStone(payload).subscribe(res => {
        this.router.navigateByUrl('projects/milestone_list/' + this.mileStoneId);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'MileStone Added successfully!' });
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
      const payload = { id: this.mileStoneId, ...this.addMileStoneForm.value, projectId: this.projectId };
      this.milestoneService.updateMilestone(payload).subscribe(res => {
        this.router.navigateByUrl('projects/milestone_list/' + this.mileStoneId);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'MileStone Updated successfully!' });
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
