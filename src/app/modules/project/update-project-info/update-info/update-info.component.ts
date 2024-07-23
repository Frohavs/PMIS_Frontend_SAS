import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrl: './update-info.component.scss'
})
export class UpdateInfoComponent implements OnInit {

  projectId: number;
  projectDetails: any;
  isLoading: boolean;
  updatedSuccessfully: boolean;

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
          console.log(res.data);
          this.projectDetails = res.data;
          this.cdr.detectChanges();
          // setTimeout(() => {
          //   this.editProjectForm(res.data);
          // }, 1000);
        });
      }
    });
  }


  updateEot() {
    this.router.navigateByUrl('projects/update-eot' + `/${this.projectId}`);

  }

  updateVariationOrder() {
    this.router.navigateByUrl('projects/update-variation' + `/${this.projectId}`);
  }


}
