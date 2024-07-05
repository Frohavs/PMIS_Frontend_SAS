import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  dataList: any[] = [
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-26.jpg',
      name: 'company name',
      subName: 'company type',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-3.jpg',
      name: 'company name',
      subName: 'company type',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Inactive'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-8.jpg',
      name: 'company name',
      subName: 'company type',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'In Progress'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-9.jpg',
      name: 'company name',
      subName: 'company type',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-18.jpg',
      name: 'company name',
      subName: 'company type',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Inactive'
    },
  ]

  constructor(private router: Router) {

  }

  redirectToNew() {
    this.router.navigateByUrl('companies/add')
  }

}
