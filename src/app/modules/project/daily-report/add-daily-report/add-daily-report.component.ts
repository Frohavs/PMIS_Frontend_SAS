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

  weatherStatusList: any[] = WeatherStatusEnum;
  shifts: any[] = ShiftEnum;

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
    debugger
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

  saveChanges() {
    if (!this.addReportForm.valid) {
      return;
    }
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
