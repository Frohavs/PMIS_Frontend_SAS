import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {

  constructor(private router: Router) {

  }

  navigateEdit() {
    this.router.navigateByUrl('/companies/edit/1452')
  }

}
