import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';

@Component({
  selector: 'app-add-boq',
  templateUrl: './add-boq.component.html',
  styleUrl: './add-boq.component.scss'
})
export class AddBoqComponent implements OnInit {
  boqId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;

  vats: any[] = [];
  units: any[] = [];
  private updating = false;
  private updatingVat = false;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private boqService: BoqService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getBoqId();
    this.initAddBoqForm();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.boqId = params['id'];
      if (this.boqId) {
        this.boqService.getBoq(this.boqId).subscribe(res => {
          setTimeout(() => {
            this.editVendorForm(res.data);
            this.cdr.detectChanges();
          }, 1000);
        });
      }
    });
  }

  initAddBoqForm() {
    this.addBoqForm = this.formBuilder.group({
      itemNo: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      vatId: ['', Validators.required],
      unitId: ['', Validators.required],
      unitPrice: ['', Validators.required],
      totalPrice: ['', Validators.required],
    });

    this.addBoqForm.valueChanges.subscribe(res => {
      if (!this.updating && res.unitPrice) {
        this.updating = true;
        let totalPrice = 0;
        if (+this.vatId.value != 0) {
          totalPrice = (+this.vatId.value * this.unitPrice.value * this.quantity.value) / 100
        } else {
          totalPrice = (this.unitPrice.value * this.quantity.value)
        }
        this.addBoqForm.get('totalPrice')?.setValue(totalPrice);
        this.updating = false;
      }
      if (!this.updatingVat && res.vatId) {
        if (this.quantity.value && this.unitPrice.value) {
          this.updatingVat = true;
          let totalPrice = 0;
          if (+this.vatId.value != 0) {
            totalPrice = (+this.vatId.value * this.unitPrice.value * this.quantity.value) / 100
          } else {
            totalPrice = (this.unitPrice.value * this.quantity.value)
          }
          this.addBoqForm.get('totalPrice')?.setValue(totalPrice);
          this.updatingVat = false;
        }
      }
    });
  }

  getLookups() {
    this.lookupService.getUnits().subscribe(res => {
      this.units = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getVats().subscribe(res => {
      this.vats = res.data;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      itemNo: data?.itemNo,
      title: data?.title,
      description: data?.description,
      quantity: data?.quantity,
      unitPrice: data?.unitPrice,
      totalPrice: data?.totalPrice,
      vatId: data?.vatId?.toString(),
      unitId: data?.unitId?.toString()
    });
  }

  saveChanges() {
    if (!this.addBoqForm.valid) {
      return;
    }
    this.isLoading = true;
    this.boqService.addBoq(
      {
        ...this.addBoqForm.value,
        unitId: +this.addBoqForm.value.unitId,
        vatId: +this.addBoqForm.value.vatId
      }
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl('boq');
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
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

  get vatId(): FormControl {
    return this.addBoqForm.get('vatId') as FormControl;
  }

  get quantity(): FormControl {
    return this.addBoqForm.get('quantity') as FormControl;
  }

  get unitPrice(): FormControl {
    return this.addBoqForm.get('unitPrice') as FormControl;
  }

  back() {
    this._location.back();
  }
}
