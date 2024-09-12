import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimeScheduleService } from 'src/app/services/time-schedule.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-flood',

  templateUrl: './add-flood.component.html',
  styleUrl: './add-flood.component.scss'
})
export class AddFloodComponent implements OnInit {

  projectId: number;
  boqId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;

  types: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private timeScheduleService: TimeScheduleService,
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
    this.boqId = +queryParams?.boqId
    if (this.boqId) {
      this.timeScheduleService.getFlood(this.boqId).subscribe(res => {
        setTimeout(() => {
          this.editVendorForm(res.data);
          this.cdr.detectChanges();
        }, 1000);
      });
    }
  }

  initAddBoqForm() {
    this.addBoqForm = this.formBuilder.group({
      projectId: [''],
      typeId: ['', Validators.required],
      revision: ['', Validators.required],
      scheduleFile: ['', Validators.required],
      basePDF: ['', Validators.required],
      narrativePDF: ['', Validators.required],
      physicalStatusPDF: ['', Validators.required],
      date: ['', Validators.required],
    });

  }

  getLookups() {
    this.lookupService.getUnits().subscribe(res => {
      this.types = res.data;
      this.cdr.detectChanges();
    });
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      projectId: data?.projectId,
      typeId: data?.typeId,
      revision: data?.revision,
    });
    this.cdr.detectChanges()
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  saveChanges() {
    if (!this.addBoqForm.valid) {
      this.addBoqForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (!this.boqId) {
      this.timeScheduleService.addFlood(
        {
          ...this.addBoqForm.value,
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

    } else {
      this.timeScheduleService.updateFlood(
        {
          ...this.addBoqForm.value,
          id: this.boqId,
          projectId: +this.projectId,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`projects/boq-list/${this.projectId}`);
          }, 1000);
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
