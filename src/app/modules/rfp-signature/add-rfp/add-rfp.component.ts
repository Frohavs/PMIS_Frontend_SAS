import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-rfp',
  templateUrl: './add-rfp.component.html',
  styleUrl: './add-rfp.component.scss'
})
export class AddRfpComponent implements OnInit {
  projectId: number;
  boqId: number;
  isLoading: boolean;
  addRFPForm: FormGroup;

  vats: any[] = [];
  units: any[] = [];

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
    this.initAddBoqForm();
    this.getBoqId();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.boqId = params['boqId'];
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.boqId = +queryParams?.boqId
    if (this.boqId) {
      this.boqService.getBoq(this.boqId).subscribe(res => {
        setTimeout(() => {
          this.editVendorForm(res.data);
          this.cdr.detectChanges();
        }, 1000);
      });
    }
  }

  initAddBoqForm() {
    this.addRFPForm = this.formBuilder.group({
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
    this.addRFPForm.patchValue({
      projectId: data?.projectId,
      itemNo: data?.itemNo,
      title: data?.title,
      description: data?.description,
      quantity: data?.quantity,
      unitPrice: data?.unitPrice,
      totalPrice: data?.totalPrice,
      unitId: data?.unitId?.toString()
    });
    this.cdr.detectChanges()
  }

  saveChanges() {
    if (!this.addRFPForm.valid) {
      return;
    }
    this.isLoading = true;
    // if (!this.boqId) {
    //   this.boqService.addBoq(
    //     {
    //       ...this.addRFPForm.value,
    //       projectId: +this.projectId,
    //       unitId: +this.addRFPForm.value.unitId,
    //       vatId: this.getVatID(this.addRFPForm.value.vatId)
    //     }
    //   ).subscribe({
    //     next: (res) => {
    //       this.isLoading = false;
    //       this.router.navigateByUrl(`projects/boq-list/${this.projectId}`);
    //       this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Added successfully!' });
    //       this.cdr.detectChanges();
    //     },
    //     error: (error) => {
    //       this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    //       this.isLoading = false;
    //     }
    //   });

    // } else {
    //   this.boqService.updateBoq(
    //     {
    //       ...this.addRFPForm.value,
    //       id: this.boqId,
    //       projectId: +this.projectId,
    //       unitId: +this.addRFPForm.value.unitId,
    //       vatId: this.getVatID(this.addRFPForm.value.vatId)
    //     }
    //   ).subscribe({
    //     next: (res) => {
    //       this.isLoading = false;
    //       this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Updated successfully!' });
    //       setTimeout(() => {
    //         this.router.navigateByUrl(`projects/boq-list/${this.projectId}`);
    //       }, 1000);
    //     },
    //     error: (error) => {
    //       this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    //       this.isLoading = false;
    //     }
    //   });
    // }
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
    return this.addRFPForm.get('vatId') as FormControl;
  }

  get quantity(): FormControl {
    return this.addRFPForm.get('quantity') as FormControl;
  }

  get unitPrice(): FormControl {
    return this.addRFPForm.get('unitPrice') as FormControl;
  }

  navigateBoqTable() {
    this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`);
  }
  back() {
    this._location.back();
  }
}
