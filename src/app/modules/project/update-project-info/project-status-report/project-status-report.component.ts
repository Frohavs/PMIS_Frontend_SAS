import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-status-report',
  templateUrl: './project-status-report.component.html',
  styleUrl: './project-status-report.component.scss'
})
export class ProjectStatusReportComponent implements OnInit {

  reportDetails!: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.getProjectStatusReport();
  }

  getProjectStatusReport() {
    this.projectsService.getProjectReportStatusReport(this.activatedRoute.snapshot.params['id']).subscribe(res => {
      this.reportDetails = res.data;
      this.cdr.detectChanges();
    });
  }



  printReport() {
    window.print();
  }

}
