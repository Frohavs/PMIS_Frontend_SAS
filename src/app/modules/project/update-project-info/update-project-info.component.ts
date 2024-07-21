import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-project-info',
  templateUrl: './update-project-info.component.html',
  styleUrl: './update-project-info.component.scss'
})
export class UpdateProjectInfoComponent implements OnInit {

  updateInfo: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  navigateUpdateStaff() {
    this.router.navigateByUrl('projects/update-project-staff' + `/${'123'}`);
  }

  navigateUpdateInfo() {
    this.router.navigateByUrl('projects/update-info' + `/${'123'}`);
  }

  updateProjectInfo() {
    this.updateInfo = !this.updateInfo;
  }

  navigateUpdateProgress() {
    this.router.navigateByUrl('projects/update-progress-info' + `/${'123'}`);
  }

  navigateProjectStage() {
    this.router.navigateByUrl('projects/project-stage-update' + `/${123}`);
  }
}
