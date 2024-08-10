import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ShiftEnum, WeatherStatusEnum } from '../report-enums';

@Component({
  selector: 'app-add-daily-report',
  templateUrl: './add-daily-report.component.html',
  styleUrl: './add-daily-report.component.scss'
})
export class AddDailyReportComponent implements OnInit {
  projectId: number;
  reportId: number;

  isLoading: boolean;
  addReportForm: FormGroup;

  vats: any[] = [];
  units: any[] = [];

  shifts: any[] = ShiftEnum;
  weatherStatusList: any[] = WeatherStatusEnum;
  currentStep: number = 0;

  addPositionsForm: FormGroup;
  addEquipmentsForm: FormGroup;
  addWorkPerformedTodayForm: FormGroup;
  addUploadFilesForm: FormGroup;
  selectedFile: File | null = null;
  selectedFiles: string[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private dailyReportService: DailyReportService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.initAddReportForm();
    this.getReportId();

    this.initPositionsForm();
    this.initEquipmentsForm();
    this.initWorkPerformedForm();
    this.initUploadFilesForm();

  }

  getReportId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.reportId = params['reportId'];
      if (this.reportId) {
        this.dailyReportService.getById(this.reportId).subscribe(res => {
          this.editReportForm(res.data);
        });
      }
    });
  }

  initAddReportForm() {
    this.addReportForm = this.formBuilder.group({
      projectId: [''],
      weatherStatus: ['', Validators.required],
      shift: ['', Validators.required],
      temperature: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

    });
  }

  editReportForm(data: any) {
    this.addReportForm.patchValue({
      projectId: data?.projectId,
      weatherStatus: data?.weatherStatus,
      shift: data?.shift,
      temperature: data?.temperature,
      quantity: data?.quantity,
      startDate: data?.startDate?.slice(0, 10) || null,
      endDate: data?.endDate?.slice(0, 10) || null,
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

  initPositionsForm() {
    this.addPositionsForm = this.formBuilder.group({
      pmValue: [null],
      pmSubContractor: [null],

      qaValue: [null],
      qaSubContractor: [null],

      cmValue: [null],
      cmSubContractor: [null],

      ceValue: [null],
      ceSubContractor: [null],

      archValue: [null],
      archSubContractor: [null],

      elecValue: [null],
      elecSubContractor: [null],

      mechValue: [null],
      mechSubContractor: [null],

      materialValue: [null],
      materialSubContractor: [null],

      bridgeValue: [null],
      bridgeSubContractor: [null],

      hseValue: [null],
      hseSubContractor: [null],

      quantityValue: [null],
      quantitySubContractor: [null],

      planningValue: [null],
      planningSubContractor: [null],

      landValue: [null],
      landSubContractor: [null],

      assistantValue: [null],
      assistantSubContractor: [null],

      inspectorValue: [null],
      inspectorSubContractor: [null],

      documentValue: [null],
      documentSubContractor: [null],

      masonValue: [null],
      masonSubContractor: [null],

      labourValue: [null],
      labourSubContractor: [null],

      carpenterValue: [null],
      carpenterSubContractor: [null],

      painterValue: [null],
      painterSubContractor: [null],

      steelValue: [null],
      steelSubContractor: [null],

      machineValue: [null],
      machineSubContractor: [null],

      driverValue: [null],
      driverSubContractor: [null],

      weldingValue: [null],
      weldingSubContractor: [null],

      warehouseValue: [null],
      warehouseSubContractor: [null],

    });
  }
  initEquipmentsForm() {
    this.addEquipmentsForm = this.formBuilder.group({
      centralValue: [null],
      dumpValue: [null],
      excavatorValue: [null],
      concreteMixerValue: [null],
      bulldozerValue: [null],
      frontBackLoaderValue: [null],
      skidLoaderValue: [null],
      fuelValue: [null],
      flatBedValue: [null],
      roadValue: [null],
      craneValue: [null],
      graderValue: [null],
      mobileValue: [null],
      towerValue: [null],
      forkliftValue: [null],
      concretePumpValue: [null],
      ironCrushingValue: [null],
      waterValue: [null],
      asphaltValue: [null],
      waterPumpValue: [null],
      ironCutting: [null],
      frontLoaderValue: [null],
    });
  }
  initWorkPerformedForm() {
    this.addWorkPerformedTodayForm = this.formBuilder.group({
      archCivil: [''],
      mechanical: [''],
      electrical: [''],
      safetyObservation: [''],
      qualityObservation: [''],
      materialDelivery: [''],
      interfaceIssues: [''],
      workPerformedDescription: [''],
    });
  }
  initUploadFilesForm() {
    this.addUploadFilesForm = this.formBuilder.group({
      files: [null],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];

    this.selectedFiles.push(this.selectedFile.name);
    // Reset the file input field
    (event.target as HTMLInputElement).value = '';
    // Optionally, clear the selectedFile variable
    this.selectedFile = null;
  }

  removeIndex(index: number) {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }
  }

  nextStep() {
    this.currentStep += 1;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  prevStep() {
    this.currentStep -= 1;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  moveToWizard() {
    if (!this.addReportForm.valid) {
      this.addReportForm.markAllAsTouched();
      return;
    }
    this.currentStep = 1;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  saveChanges() {
    this.isLoading = true;
    if (!this.reportId) {
      this.dailyReportService.addDailyReport(
        {
          ...this.addReportForm.value,
          projectId: +this.projectId,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/daily-report/${this.projectId}`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Report Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });

    } else {
      this.dailyReportService.updateDailyReport(
        {
          ...this.addReportForm.value,
          id: this.reportId,
          projectId: +this.projectId,
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Report Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`projects/daily-report/${this.projectId}`);
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
