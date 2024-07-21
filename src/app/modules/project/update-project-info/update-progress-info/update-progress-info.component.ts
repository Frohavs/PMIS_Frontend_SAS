import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-progress-info',
  templateUrl: './update-progress-info.component.html',
  styleUrl: './update-progress-info.component.scss'
})
export class UpdateProgressInfoComponent {

  projectId: number;
  isLoading: boolean;
  UpdateProgressForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

    this.initUpdateProgressForm();
  }

  initUpdateProgressForm() {
    this.UpdateProgressForm = this.formBuilder.group({
      planned_progress: ['1.00', Validators.required],
      actual_progress: ['1.00', Validators.required],
      difference: [{ value: '0.00', disabled: true }, Validators.required],
      value_till_now: ['', Validators.required],
      previous_work_value: ['', Validators.required],
      status: [{ value: 'Regular', disabled: true }, Validators.required],
      attachments: [null, Validators.required],

    });
  }

  saveChanges() {

  }
}
