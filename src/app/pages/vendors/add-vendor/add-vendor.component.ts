import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.scss'
})
export class AddVendorComponent implements OnInit {
  projectId: number;
  isLoading: boolean;
  addVendorForm: FormGroup;

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

    this.initAddVendorForm();
  }

  initAddVendorForm() {
    this.addVendorForm = this.formBuilder.group({
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
