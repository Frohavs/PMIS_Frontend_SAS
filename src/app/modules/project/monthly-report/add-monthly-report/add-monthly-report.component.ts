import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { inits } from 'src/app/modules/wizards/create-account.helper';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-monthly-report',
  templateUrl: './add-monthly-report.component.html',
  styleUrl: './add-monthly-report.component.scss'
})
export class AddMonthlyReportComponent implements OnInit, OnDestroy {
  projectId: any;
  projectDetails: any;
  projectDate: any;
  addForm: FormGroup;
  formsCount = 5;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  private unsubscribe: Subscription[] = [];
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private projectsService: ProjectsService,
    private monthlyReportsService: MonthlyReportsService,
  ) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      projectName: [{ value: '', disabled: true }],
      contractorName: [{ value: '', disabled: true }],
      consultantName: [{ value: '', disabled: true }],
      month: [{ value: '', disabled: true }],
      year: [{ value: '', disabled: true }],
      reportNo: ['', [Validators.required]],
      executionStartDate: [{ value: '', disabled: true }],
      originalFinishDate: [{ value: '', disabled: true }],
      originalDuration: [{ value: '', disabled: true }],
      originalValue: [{ value: '', disabled: true }],
      updatedValue: [{ value: '', disabled: true }],
      expectedFinishDate: [{ value: '', disabled: true }],
      totalDaysWithEOT: [{ value: '', disabled: true }],
      elapsedTimePercentage: [{ value: '', disabled: true }],
      plannedBusinessPercentage: [{ value: '', disabled: true }],
      actualBusinessPercentage: [{ value: '', disabled: true }],
      spi: [{ value: '', disabled: true }],
      eotDays: [{ value: '', disabled: true }],
      voValues: [{ value: '', disabled: true }],
      invoiceReferenceNumber: [{ value: '', disabled: true }],
      invoiceValue: [{ value: '', disabled: true }],
      invoiceRatio: [{ value: '', disabled: true }],
    });


    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) this.getProjectData();
    });
  }

  getProjectData() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      this.addForm.patchValue({
        projectName: this.projectDetails.name,
        contractorName: this.projectDetails.contractorName,
        consultantName: this.projectDetails.consultantName,
        month: this.getMonthName(this.projectDetails.executionStartDate),
        year: this.getYear(this.projectDetails.executionStartDate),
        executionStartDate: this.projectDetails.executionStartDate.slice(0, 10),
        originalFinishDate: this.projectDetails.originalFinishDate.slice(0, 10),
        originalDuration: this.projectDetails.originalDuration,
        originalValue: this.projectDetails.originalValue,
        totalDaysWithEOT: this.projectDetails.totalDaysWithEOT,
        expectedFinishDate: this.projectDetails.expectedFinishDate.slice(0, 10),
      });
      this.cdr.detectChanges();
    });

    this.monthlyReportsService.getProjectData(this.projectId).subscribe(res => {
      this.projectDate = res.data;
      this.addForm.patchValue({
        totalDaysWithEOT: this.projectDate.totalDaysWithEOT,
        expectedFinishDate: this.projectDate.expectedFinishDate.slice(0, 10),
        elapsedTimePercentage: this.projectDate.elapsedTimePercentage,
        plannedBusinessPercentage: this.projectDate.plannedBusinessPercentage,
        actualBusinessPercentage: this.projectDate.actualBusinessPercentage,
        spi: this.projectDate.spi,
        eotDays: this.projectDate.eotDays,
        updatedValue: this.projectDate.updatedValue,
        voValues: this.projectDate.voValues,
        invoiceReferenceNumber: this.projectDate.invoiceReferenceNumber,
        invoiceValue: this.projectDate.invoiceValue,
        invoiceRatio: this.projectDate.invoiceRatio
      });
      this.cdr.detectChanges();
    });
  }

  nextStep() {
    if (this.currentStep$.value === this.formsCount - 1) {
      this.submitReport();

      return
    }
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  submitReport() {

    const payload = {
      projectId: +this.projectId,
      reportNo: this.addForm.get('reportNo')?.value
    }
    this.monthlyReportsService.createMonthlyReport(payload).subscribe(res => {
      this.router.navigateByUrl(`projects/monthly_reports/${this.projectId}`);
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Report added successfully!' });
    }, error => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  /**
 * Get the month name from a date string
 * @param dateString - ISO date string
 * @returns {string} - Full month name (e.g., "September")
 */
  getMonthName(dateString: string): string {
    const date = new Date(dateString); // Parse the date string
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const result = monthNames[date.getMonth()];
    return result  // Get the month name based on the index
  }

  /**
   * Get the year from a date string
   * @param dateString - ISO date string
   * @returns {string} - Year (e.g., "2024")
   */
  getYear(dateString: string): string {
    const date = new Date(dateString); // Parse the date string
    const result = date.getFullYear().toString();
    return result  // Get the year and convert it to string
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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
