import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-boq',
  templateUrl: './add-boq.component.html',
  styleUrl: './add-boq.component.scss'
})
export class AddBoqComponent {
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
      item_no: ['', Validators.required],
      item_title: ['', Validators.required],
      item_desc: ['', Validators.required],
      unit: ['', Validators.required],
      vat: ['', Validators.required],
      quantity: ['', Validators.required],
      unit_price: ['', Validators.required],
      total_price: [{ value: '', disabled: true }, Validators.required],

    });
  }

  saveChanges() {
    console.log(this.addVendorForm.value);


  }

  back() {
    this._location.back();
  }
}
