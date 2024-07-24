import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { BoqService } from 'src/app/services/boq.service';

@Component({
  selector: 'app-add-boq',
  templateUrl: './add-boq.component.html',
  styleUrl: './add-boq.component.scss'
})
export class AddBoqComponent implements OnInit {
  boqId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private boqService: BoqService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getBoqId();
    this.initAddBoqForm();
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
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      itemNo: data?.itemNo,
      title: data?.title,
      description: data?.description,
      quantity: data?.quantity,
      unitPrice: data?.unitPrice,
      totalPrice: data?.totalPrice,
      vatId: data?.vatId,
      unitId: data?.unitId
    });
  }

  saveChanges() {
    if (!this.addBoqForm.valid) {
      return;
    }
    this.isLoading = true;
    this.boqService.addBoq(this.addBoqForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl('projects');
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

  back() {
    this._location.back();
  }
}
