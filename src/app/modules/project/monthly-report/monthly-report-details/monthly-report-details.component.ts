import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';

@Component({
  selector: 'app-monthly-report-details',
  templateUrl: './monthly-report-details.component.html',
  styleUrl: './monthly-report-details.component.scss'
})
export class MonthlyReportDetailsComponent implements OnInit {

  projectId: number;
  reportId: number;
  reportDetails: any;
  progressResult = 0;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.projectId = +res['id'];
    });
    this.activatedRoute.queryParams.subscribe((res) => {
      this.reportId = +res['reportId'];
      if (this.reportId) {
        this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
          this.reportDetails = res.data;
          console.log(this.reportDetails);
          this.checkProgress();
          this.cdr.detectChanges();
        })
      }
    });
  }

  checkProgress() {
    if (this.reportDetails.images.length) {
      this.progressResult = 20
    }
  }

  navigateTo(route: string) {
    // navigate with reportId
    this.router.navigate(['projects/' + route + `/${this.projectId}`], { queryParams: { reportId: this.reportId } });
  }
}
