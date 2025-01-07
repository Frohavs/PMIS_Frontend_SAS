import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';

@Component({
  selector: 'app-report-step',
  templateUrl: './report-step.component.html',
  styleUrl: './report-step.component.scss'
})
export class ReportStepComponent implements OnInit {

  projectId: number;
  projectDetails: any;
  reportId: number;
  reportDetails: any;
  ratingProgressResult = 0;
  completionProgressResult = 0;

  constructor(

    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.projectId = +res['id'];
      this.monthlyReportsService.getProjectData(this.projectId).subscribe((res) => {
        this.projectDetails = res.data;
        console.log('this.projectDetails', this.projectDetails);

        this.cdr.detectChanges();
      })
    });
    this.activatedRoute.queryParams.subscribe((res) => {
      this.reportId = +res['reportId'];
      if (this.reportId) {
        this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
          this.reportDetails = res.data;
          console.log(this.reportDetails);
          this.cdr.detectChanges();
        });
      }
    });
  }

  addNewReport() {
    this.router.navigate([`projects/monthly_report_step_add/${this.projectId}`], { queryParams: { reportId: this.reportId } });
  }
  navigateDetails() {
    this.router.navigate([`projects/monthly_report_step_details/${this.projectId}`], { queryParams: { reportId: this.reportId } });
  }
  download() {
    this.router.navigate([`projects/monthly_report_step_details/${this.projectId}`], { queryParams: { reportId: this.reportId, print:true } });
  }
  back() {
    this._location.back();
  }
}
