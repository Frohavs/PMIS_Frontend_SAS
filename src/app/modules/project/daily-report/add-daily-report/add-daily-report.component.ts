import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ShiftEnum, WeatherStatusEnum } from '../report-enums';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';

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
  selectedFiles: any;
  dailyReportAttachments: any[] = [];

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
    private attachmentService: AttachmentService,

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
      this.projectId = +params['id'];
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
    if (data?.dailyReportAttachments.length) {
      for (const file of data?.dailyReportAttachments) {
        this.dailyReportAttachments.push({ attachment: file.attachment });
      }
    }
    const forms = JSON.parse(data.dataForm)
    this.editPositionsForm(forms?.positions);
    this.editEquipmentForm(forms?.equipments);
    this.editWorkPerformedDailyForm(forms?.workPerformedToday);

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

  editPositionsForm(data: any) {
    this.addPositionsForm.patchValue({
      pmValue: data?.pmValue,
      pmSubContractor: data?.pmSubContractor,
      qaValue: data?.qaValue,
      qaSubContractor: data?.qaSubContractor,
      cmValue: data?.cmValue,
      cmSubContractor: data?.cmSubContractor,
      ceValue: data?.ceValue,
      ceSubContractor: data?.ceSubContractor,
      archValue: data?.archValue,
      archSubContractor: data?.archSubContractor,
      elecValue: data?.elecValue,
      elecSubContractor: data?.elecSubContractor,
      mechValue: data?.mechValue,
      mechSubContractor: data?.mechSubContractor,
      materialValue: data?.materialValue,
      materialSubContractor: data?.materialSubContractor,
      bridgeValue: data?.bridgeValue,
      bridgeSubContractor: data?.bridgeSubContractor,
      hseValue: data?.hseValue,
      hseSubContractor: data?.hseSubContractor,
      quantityValue: data?.quantityValue,
      quantitySubContractor: data?.quantitySubContractor,
      planningValue: data?.planningValue,
      planningSubContractor: data?.planningSubContractor,
      landValue: data?.landValue,
      landSubContractor: data?.landSubContractor,
      assistantValue: data?.assistantValue,
      assistantSubContractor: data?.assistantSubContractor,
      inspectorValue: data?.inspectorValue,
      inspectorSubContractor: data?.inspectorSubContractor,
      documentValue: data?.documentValue,
      documentSubContractor: data?.documentSubContractor,
      masonValue: data?.masonValue,
      masonSubContractor: data?.masonSubContractor,
      labourValue: data?.labourValue,
      labourSubContractor: data?.labourSubContractor,
      carpenterValue: data?.carpenterValue,
      carpenterSubContractor: data?.carpenterSubContractor,
      painterValue: data?.painterValue,
      painterSubContractor: data?.painterSubContractor,
      steelValue: data?.steelValue,
      steelSubContractor: data?.steelSubContractor,
      machineValue: data?.machineValue,
      machineSubContractor: data?.machineSubContractor,
      driverValue: data?.driverValue,
      driverSubContractor: data?.driverSubContractor,
      weldingValue: data?.weldingValue,
      weldingSubContractor: data?.weldingSubContractor,
      warehouseValue: data?.warehouseValue,
      warehouseSubContractor: data?.warehouseSubContractor,
    });
  }
  editEquipmentForm(data: any) {
    this.addEquipmentsForm.patchValue({
      centralValue: data?.centralValue,
      dumpValue: data?.dumpValue,
      excavatorValue: data?.excavatorValue,
      concreteMixerValue: data?.concreteMixerValue,
      bulldozerValue: data?.bulldozerValue,
      frontBackLoaderValue: data?.frontBackLoaderValue,
      skidLoaderValue: data?.skidLoaderValue,
      fuelValue: data?.fuelValue,
      flatBedValue: data?.flatBedValue,
      roadValue: data?.roadValue,
      craneValue: data?.craneValue,
      graderValue: data?.graderValue,
      mobileValue: data?.mobileValue,
      towerValue: data?.towerValue,
      forkliftValue: data?.forkliftValue,
      concretePumpValue: data?.concretePumpValue,
      ironCrushingValue: data?.ironCrushingValue,
      waterValue: data?.waterValue,
      asphaltValue: data?.asphaltValue,
      waterPumpValue: data?.waterPumpValue,
      ironCutting: data?.ironCutting,
      frontLoaderValue: data?.frontLoaderValue,
    });

  }
  editWorkPerformedDailyForm(data: any) {
    this.addWorkPerformedTodayForm.patchValue({
      archCivil: data?.archCivil,
      mechanical: data?.mechanical,
      electrical: data?.electrical,
      safetyObservation: data?.safetyObservation,
      qualityObservation: data?.qualityObservation,
      materialDelivery: data?.materialDelivery,
      interfaceIssues: data?.interfaceIssues,
      workPerformedDescription: data?.workPerformedDescription,
    });

  }

  onFileSelected(event: any) {
    this.selectedFiles = <File>event.target.files;

    for (const file of this.selectedFiles) {
      const fd = new FormData();
      fd.append('Attachment', file, file.name)
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.dailyReportAttachments.push({ attachment: file.name });
        this.cdr.detectChanges();
      }, () => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try Upload again' });
      });
    }

    // Reset the file input field
    (event.target as HTMLInputElement).value = '';
    // Optionally, clear the selectedFile variable
    this.selectedFiles = null;
  }

  removeIndex(index: number) {
    if (index >= 0 && index < this.dailyReportAttachments.length) {
      this.dailyReportAttachments.splice(index, 1);
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


    const dataForm = JSON.stringify({ positions: { ...this.addPositionsForm.value }, equipments: { ...this.addEquipmentsForm.value }, workPerformedToday: { ...this.addWorkPerformedTodayForm.value } });
    const payload = { ...this.addReportForm.value, dataForm: dataForm, dailyReportAttachments: this.dailyReportAttachments }
    if (!this.reportId) {
      this.dailyReportService.addDailyReport(
        {
          ...payload,
          projectId: +this.projectId,
          dailyReportAttachments: [...this.dailyReportAttachments]
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
          ...payload,
          id: this.reportId,
          projectId: +this.projectId,
          dailyReportAttachments: [...this.dailyReportAttachments]
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
