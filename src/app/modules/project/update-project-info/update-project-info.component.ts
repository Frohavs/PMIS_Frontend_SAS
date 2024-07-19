import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-project-info',
  templateUrl: './update-project-info.component.html',
  styleUrl: './update-project-info.component.scss'
})
export class UpdateProjectInfoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  navigateStaff() {
    this.router.navigateByUrl('projects/update-project-staff' + `/${'123'}`)
  }
}
