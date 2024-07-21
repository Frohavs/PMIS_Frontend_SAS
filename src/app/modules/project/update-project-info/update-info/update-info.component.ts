import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrl: './update-info.component.scss'
})
export class UpdateInfoComponent implements OnInit {
  updatedSuccessfully: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  updateEot() {
    this.router.navigateByUrl('projects/update-eot' + `/${123}`);

  }

  updateVariationOrder() {
    this.router.navigateByUrl('projects/update-variation' + `/${123}`);

    // this.updatedSuccessfully = !this.updatedSuccessfully;
  }


}
