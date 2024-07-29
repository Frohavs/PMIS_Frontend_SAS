import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-update-project-info',
  templateUrl: './update-project-info.component.html',
  styleUrl: './update-project-info.component.scss'
})
export class UpdateProjectInfoComponent implements OnInit {

  updateInfo: boolean;
  projectId: number;
  projectDetails: any;
  isLoading: boolean;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.projectsService.getByID(this.projectId).subscribe(res => {
          this.projectDetails = res.data;
          this.cdr.detectChanges();
        });
      }
    });

  }


  navigateUpdateStaff() {
    this.router.navigateByUrl('projects/update-project-staff' + `/${this.projectId}`);
  }

  navigateUpdateInfo() {
    this.router.navigateByUrl('projects/update-info' + `/${this.projectId}`);
  }

  updateProjectInfo() {
    this.updateInfo = !this.updateInfo;
  }

  navigateUpdateProgress() {
    this.router.navigateByUrl('projects/update-progress-info' + `/${this.projectId}`);
  }

  navigateProjectStage() {
    this.router.navigateByUrl('projects/project-stage-update' + `/${this.projectId}`);
  }
}
