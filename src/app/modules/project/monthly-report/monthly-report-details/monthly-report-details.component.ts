import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';

@Component({
  selector: 'app-monthly-report-details',
  templateUrl: './monthly-report-details.component.html',
  styleUrl: './monthly-report-details.component.scss'
})
export class MonthlyReportDetailsComponent implements OnInit {

  projectId: number;
  reportId: number;
  projectDetails: any;
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
          this.checkProgress();
          this.cdr.detectChanges();
        });
      }
    });
  }

  checkProgress() {
    if (this.reportDetails.images.length) {
      this.completionProgressResult = 25
    }
    if (this.reportDetails?.recommendation?.contractor) {
      this.completionProgressResult = 50
    }
    if (this.reportDetails?.correspondence?.type) {
      this.completionProgressResult = 75
    }
    if (this.reportDetails?.resourcePlanValue) {
      this.completionProgressResult = 100
    }
    if (this.reportDetails.workProgressImageSubmitted) {
      this.ratingProgressResult = 25
    }
    if (this.reportDetails.recommendationSubmitted) {
      this.ratingProgressResult = 50
    }
    if (this.reportDetails.correspondenceSubmitted) {
      this.ratingProgressResult = 75
    }
    if (this.reportDetails.submitted) {
      this.ratingProgressResult = 100
    }
  }


  back() {
    this._location.back();
  }

  navigateTo(route: string) {
    // navigate with reportId
    this.router.navigate(['projects/' + route + `/${this.projectId}`], { queryParams: { reportId: this.reportId } });
  }
}
