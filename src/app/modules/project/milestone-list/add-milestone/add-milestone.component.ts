import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { SweetAlertOptions } from 'sweetalert2';

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
    private milestoneService: MilestoneService
  ) {
  }

  ngOnInit() {
    this.getMileStoneId();
    this.initMileStoneFormArray();
  }

  initMileStoneFormArray() {
    this.addMileStoneForm = this.formBuilder.group({
      milestones: this.formBuilder.array([this.createMilestone()])
    });
  }

  createMilestone(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      actualStartDate: [null],
      actualEndDate: [null]
    });
  }

  get milestones(): FormArray {
    return this.addMileStoneForm.get('milestones') as FormArray;
  }

  addMilestone(): void {
    this.milestones.push(this.createMilestone());
  }

  removeMilestone(index: number): void {
    this.milestones.removeAt(index);
  }

  getMileStoneId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.mileStoneId = +params['mileStoneId'];
      if (this.mileStoneId) {
        this.milestoneService.getById(this.mileStoneId).subscribe(res => {

          this.initMileStoneEditForm(res.data);
        })
      }
    });
  }

  initMileStoneEditForm(data: any) {
    this.milestones.at(0).patchValue({
      title: data?.title,
      description: data?.description,
      startDate: data?.startDate?.slice(0, 10) || null,
      endDate: data?.endDate?.slice(0, 10) || null,
      actualStartDate: data?.actualStartDate?.slice(0, 10) || null,
      actualEndDate: data?.actualEndDate?.slice(0, 10) || null,
    });
  }

  saveUser() {
    if (!this.mileStoneId) {
      const dataArray = this.addMileStoneForm.value.milestones.filter((item: any) => typeof item === 'object' && !Array.isArray(item));
      dataArray.forEach((element: any) => {
        element['projectId'] = +this.projectId
      });
      this.milestoneService.addMileStone(dataArray).subscribe(res => {
        this.router.navigateByUrl('projects/milestone_list/' + this.projectId);
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
      const payload = { id: this.mileStoneId, ...this.addMileStoneForm.value?.milestones[0], projectId: +this.projectId };
      this.milestoneService.updateMilestone(payload).subscribe(res => {
        this.router.navigateByUrl('projects/milestone_list/' + this.projectId);
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
