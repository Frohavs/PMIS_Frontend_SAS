import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-monthly-report-details',
  templateUrl: './monthly-report-details.component.html',
  styleUrl: './monthly-report-details.component.scss'
})
export class MonthlyReportDetailsComponent implements OnInit {

  reportDetails: any;
  reportId: number;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.reportId = +res['id'];
      console.log('this.reportId', this.reportId);

    });
  }

  navigateTo(route: string) {
    // navigate with reportId
    this.router.navigateByUrl('projects/' + route + `/${this.reportId}`);
  }
}
