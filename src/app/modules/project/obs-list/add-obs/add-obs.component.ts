import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { ObsService } from 'src/app/services/obs.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-add-obs',
  templateUrl: './add-obs.component.html',
  styleUrl: './add-obs.component.scss'
})
export class AddObsComponent implements OnInit {

  projectId: number;
  obsId: number;
  isLoading: boolean;
  addObsForm: FormGroup;

  boqList: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private obsService: ObsService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initObsForm();
    this.getBoqId();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.obsId = params['obsId'];
      if (this.obsId) {
        this.obsService.getOBS(this.obsId).subscribe(res => {
          setTimeout(() => {
            this.editVendorForm(res.data);
            this.cdr.detectChanges();
          }, 1000);
        });
      }
    });
  }

  getLookups() {
    this.lookupService.getBoqsByProjectId(this.projectId).subscribe(res => {
      this.boqList = res.data;
      this.cdr.detectChanges();
    });
  }

  initObsForm() {
    this.addObsForm = this.formBuilder.group({
      projectId: [''],
      assignedDate: ['', Validators.required],
      happennedDate: ['', Validators.required],
      description: ['', Validators.required],
      action: ['', Validators.required],
      obsBoqs: this.formBuilder.array([this.createBoqItem()]), // Initialize FormArray
    });
  }

  createBoqItem(): FormGroup {
    return this.formBuilder.group({
      boqId: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  editVendorForm(data: any) {
    this.addObsForm.patchValue({
      projectId: data?.projectId,
      assignedDate: data?.assignedDate,
      happennedDate: data?.happennedDate,
      description: data?.description,
      action: data?.action,
      quantity: data?.quantity,
    });
    // Clear existing FormArray
    this.obsBoqs.clear();

    // Populate FormArray with obsBoqs from the response
    if (data.obsBoqs && data.obsBoqs.length > 0) {
      data.obsBoqs.forEach((boq: any) => {
        this.obsBoqs.push(this.formBuilder.group({
          boqId: [boq.boqId, Validators.required],
          quantity: [boq.quantity, Validators.required]
        }));
      });
    }
    this.cdr.detectChanges()
  }

  get obsBoqs(): FormArray {
    return this.addObsForm.get('obsBoqs') as FormArray;
  }

  addBoqItem() {
    this.obsBoqs.push(this.createBoqItem());
  }

  removeBoqItem(index: number) {
    this.obsBoqs.removeAt(index);
  }

  saveChanges() {
    // if (!this.addObsForm.valid) {
    //   return;
    // }
    this.isLoading = true;
    this.addObsForm.value?.obsBoqs.forEach((element: any) => {
      element.boqId = +element.boqId
    });
    if (!this.obsId) {

      const payload = {
        ...this.addObsForm.value,
        projectId: +this.projectId,

      }
      debugger
      this.obsService.addOBS(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/obs-list/${this.projectId}`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Obs Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });

    } else {
      const payload = {
        ...this.addObsForm.value,
        id: this.obsId,
        projectId: +this.projectId,
      }
      this.obsService.updateOBS(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Obs Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`projects/obs-list/${this.projectId}`);
          }, 500);
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

  back() {
    this._location.back();
  }
}
