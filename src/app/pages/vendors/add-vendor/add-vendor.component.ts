import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { VendorTypes } from './vendor-types';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.scss'
})
export class AddVendorComponent implements OnInit {
  projectId: number;
  isLoading: boolean;
  addVendorForm: FormGroup;
  vendorTypes: any[] = VendorTypes;
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
      crNumber: ['', Validators.required],
      vendorTypeId: ['', Validators.required],
      nameAr: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  saveChanges() {
    console.log(this.addVendorForm.value);

  }

  back() {
    this._location.back();
  }
}
