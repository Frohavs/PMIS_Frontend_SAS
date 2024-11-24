import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-update-progress-info',
  templateUrl: './update-progress-info.component.html',
  styleUrl: './update-progress-info.component.scss'
})
export class UpdateProgressInfoComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  projectDetails: any;
  UpdateProgressForm: FormGroup;
  statusValues = [
    {
      id: 1,
      name: "Advanced"
    },
    {
      id: 2,
      name: "Regular"
    },
    {
      id: 3,
      name: "Late"
    },
    {
      id: 4,
      name: "Stumbled / Stopped"
    }
  ]

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;


  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.initUpdateProgressForm();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getProjectDetails();
        this.getFormValues()
      }
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      this.cdr.detectChanges();
    });
  }

  getFormValues() {
    this.projectsService.GetProgressInfo(this.projectId).subscribe((res: any) => {
      const actualPercentageControl = this.UpdateProgressForm.get('actualPercentage');
      if (actualPercentageControl && !res) {
        this.UpdateProgressForm.get('actualPercentage')?.disable();
        this.cdr.detectChanges();
        return;
      }
      this.UpdateProgressForm.patchValue({
        plannedProgress: res?.data.plannedProgress,
        actualPercentage: res?.data.actualPercentage,
        difference: res?.data.difference,
        status: this.getValue(res?.data.difference),
        // attachment: res.data.attachment
      });
    });
  }

  initUpdateProgressForm() {
    this.UpdateProgressForm = this.formBuilder.group({
      plannedProgress: [{ value: '', disabled: true }, Validators.required],
      actualPercentage: ['', Validators.required],
      difference: [{ value: '', disabled: true }, Validators.required],
      // value_till_now: ['', Validators.required],
      // previous_work_value: ['', Validators.required],
      status: [{ value: '', disabled: true }, Validators.required],
      attachment: [null, Validators.required],
    });
    this.initDifference();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.UpdateProgressForm.patchValue({
        attachment: file
      });
      // You can mark the control as touched or dirty if needed
      this.UpdateProgressForm.get('attachment')?.markAsTouched();
    }
  }

  initDifference() {
    this.UpdateProgressForm.get('actualPercentage')?.valueChanges
      .pipe(
        map((actualProgressValue) => {
          const plannedProgress = Number(this.UpdateProgressForm.get('plannedProgress')?.value || 0);
          const actualProgress = Number(actualProgressValue || 0);

          // Calculate the difference
          return (plannedProgress - actualProgress).toFixed(2);

        })).subscribe((difference) => {
          const differenceControl = this.UpdateProgressForm.get('difference');
          const actualControl: any = this.UpdateProgressForm.get('actualPercentage');
          const statusControl: any = this.UpdateProgressForm.get('status');
          if (differenceControl) {
            differenceControl.setValue(difference, { emitEvent: false });
          }
          // Check the difference and set the status value
          if (+difference < 0) {
            statusControl?.setValue(1, { emitEvent: false });
          } else if (+difference >= 0 && +difference <= 5) {
            statusControl?.setValue(2, { emitEvent: false });
          } else if (+difference >= 5 && +difference <= 25) {
            statusControl?.setValue(3, { emitEvent: false });
          } else if (+difference >= 25) {
            statusControl?.setValue(4, { emitEvent: false });
          }
        });
  }

  getValue(difference: any) {
    let result = 0;
    if (+difference < 0) {
      result = 1
    } else if (+difference >= 0 && +difference <= 5) {
      result = 2
    } else if (+difference >= 5 && +difference <= 25) {
      result = 3
    } else if (+difference >= 25) {
      result = 5
    }

    return result
  }

  saveChanges() {
    if (!this.UpdateProgressForm.valid) {
      this.UpdateProgressForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload: any = {
      ...this.UpdateProgressForm.getRawValue(),
      attachment: "images.png",
      reasons: "string",
      actionRequired: "string",
      difference: +this.UpdateProgressForm.get('difference')?.value,
      actualPercentage: +this.UpdateProgressForm.get('actualPercentage')?.value,
      projectId: this.projectId
    }

    this.projectsService.updateProgressInfo(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Progress Updated successfully' });
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      }
    });
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
}
