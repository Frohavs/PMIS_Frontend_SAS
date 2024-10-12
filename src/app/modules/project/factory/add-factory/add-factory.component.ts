import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { SweetAlertOptions } from 'sweetalert2';
import { FactoryService } from 'src/app/services/factory.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-add-factory',
  templateUrl: './add-factory.component.html',
  styleUrl: './add-factory.component.scss'
})
export class AddFactoryComponent implements OnInit {
  projectId: number;
  boqId: number;
  isLoading: boolean;
  addFactoryForm: FormGroup;

  factoriesCR: any[] = [];
  factoryFields: any[] = [];
  units: any[] = [];
  private updating = false;
  private updatingVat = false;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private factoryService: FactoryService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
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
    this.boqId = +queryParams?.boqId;
  }

  initAddBoqForm() {
    this.addFactoryForm = this.formBuilder.group({
      factoryCRId: ['', Validators.required],
      factoryFieldId: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      repreName: ['', Validators.required],
      reprePhone: ['', Validators.required],
      repreEmail: ['', Validators.required],
      profileAttachment: ['', Validators.required],
      projectSize: ['', Validators.required],
      numOfEmployess: ['', Validators.required],
      lastFinancialAttachment: ['', Validators.required],
      approveletterAttachment: ['', Validators.required],
    });

    this.addFactoryForm.valueChanges.subscribe(res => {
      if (!this.updating && res.unitPrice) {
        this.updating = true;
        let totalPrice = 0;
        if (+this.vatId.value != 0) {
          console.log();

          totalPrice = ((+this.vatId.value + 100) * this.unitPrice.value * this.quantity.value) / 100
        } else {
          totalPrice = (this.unitPrice.value * this.quantity.value)
        }
        this.addFactoryForm.get('totalPrice')?.setValue(totalPrice);
        this.updating = false;
      }
      if (!this.updatingVat && res.vatId) {
        if (this.quantity.value && this.unitPrice.value) {
          this.updatingVat = true;
          let totalPrice = 0;
          if (+this.vatId.value != 0) {
            totalPrice = ((+this.vatId.value + 100) * this.unitPrice.value * this.quantity.value) / 100
          } else {
            totalPrice = (this.unitPrice.value * this.quantity.value)
          }
          this.addFactoryForm.get('totalPrice')?.setValue(totalPrice);
          this.updatingVat = false;
        }
      }
    });
  }

  getLookups() {

  }

  getVatID(value: string) {
    let id = 0;
    if (value == '0') {
      id = 1;
    } else if (value == '5') {
      id = 2;
    } else if (value == '15') {
      id = 3;
    }
    return id;
  }
  getVatValue(id: number) {
    let value = '';
    if (id == 1) {
      value = '0';
    } else if (id == 2) {
      value = '5';
    } else if (id == 3) {
      value = '10';
    }
    return value;

  }

  saveChanges() {
    if (!this.addFactoryForm.valid) {
      this.addFactoryForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (!this.boqId) {
      this.factoryService.addFactory(
        {
          ...this.addFactoryForm.value,
          projectId: +this.projectId,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/boq-list/${this.projectId}`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });

    }
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
    return this.addFactoryForm.get('vatId') as FormControl;
  }

  get quantity(): FormControl {
    return this.addFactoryForm.get('quantity') as FormControl;
  }

  get unitPrice(): FormControl {
    return this.addFactoryForm.get('unitPrice') as FormControl;
  }

  navigateBoqTable() {
    this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`);
  }
  back() {
    this._location.back();
  }
}
