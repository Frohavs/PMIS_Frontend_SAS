import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { CriticalPathService } from 'src/app/services/critical-path.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-critical-path',
  templateUrl: './add-critical-path.component.html',
  styleUrl: './add-critical-path.component.scss'
})
export class AddCriticalPathComponent implements OnInit, OnDestroy {
  projectId: number;
  pathId: number;
  isLoading: boolean;
  addCriticalPathForm: FormGroup;

  private unsubscribe: Subscription[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private criticalPathService: CriticalPathService
  ) {
  }

  ngOnInit() {
    this.getMileStoneId();
    this.initCriticalPathForm();

  }

  initCriticalPathForm() {
    this.addCriticalPathForm = this.formBuilder.group({
      criticalPaths: this.formBuilder.array([this.createCriticalPath()])
    });
  }

  get criticalPaths(): FormArray {
    return this.addCriticalPathForm.get('criticalPaths') as FormArray;
  }

  createCriticalPath(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      plannedPercentage: ['', [Validators.required, Validators.min(0)]],
      actualStartDate: [''],
      actualEndDate: [''],
      actualPercentage: ['', [Validators.min(0)]]
    });
  }

  addCriticalPath(): void {
    this.criticalPaths.push(this.createCriticalPath());
  }

  removeCriticalPath(index: number): void {
    this.criticalPaths.removeAt(index);
  }

  getMileStoneId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.pathId = +params['pathId'];
      if (this.pathId) {
        this.criticalPathService.getById(this.pathId).subscribe(res => {
          this.initMileStoneEditForm(res.data);
        })
      }
    });
  }

  initMileStoneEditForm(data: any) {
    this.criticalPaths.at(0).patchValue({
      title: data?.title,
      description: data?.description,
      startDate: data?.startDate?.slice(0, 10) || null,
      endDate: data?.endDate?.slice(0, 10) || null,
      plannedPercentage: +data?.plannedPercentage,
      actualStartDate: data?.actualStartDate?.slice(0, 10) || null,
      actualEndDate: data?.actualEndDate?.slice(0, 10) || null,
      actualPercentage: +data?.actualPercentage,
    });
  }

  saveUser() {
    if (!this.pathId) {
      const payload = [{ ...this.addCriticalPathForm.value, projectId: +this.projectId }];
      this.criticalPathService.addCriticalPath(payload).subscribe(res => {
        this.router.navigateByUrl('projects/critical_path/' + this.projectId);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Path Added successfully!' });
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
      const payload = { id: +this.pathId, ...this.addCriticalPathForm.value?.criticalPaths[0], projectId: +this.projectId };
      this.criticalPathService.updateCriticalPath(payload).subscribe(res => {
        this.router.navigateByUrl('projects/critical_path/' + this.projectId);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Path Updated successfully!' });
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
