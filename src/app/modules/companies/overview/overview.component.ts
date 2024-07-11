import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  Add_text: string;
  Search_text: string;
  dataColumns: any[] = []
  dataList: any[] = [
    {
      id: '1452',
      img: './assets/media/logos/froha_logo.png',
      name: 'company name',
      subName: 'company type',
      crNumber: '1010014082',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-3.jpg',
      name: 'company name',
      subName: 'company type',
      crNumber: '1010014082',
      status: 'Inactive'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-8.jpg',
      name: 'company name',
      subName: 'company type',
      crNumber: '1010014082',
      status: 'In Progress'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-9.jpg',
      name: 'company name',
      subName: 'company type',
      crNumber: '1010014082',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-18.jpg',
      name: 'company name',
      subName: 'company type',
      crNumber: '1010014082',
      status: 'Inactive'
    },
  ]

  constructor(
    private router: Router,
    private translate: TranslateService,
    private companyService: CompanyService,
  ) {
    this.Add_text = this.translate.instant('COMPANY.Add_Company'),
      this.Search_text = this.translate.instant('COMPANY.Search'),
      this.dataColumns = [
        { title: this.translate.instant('COMPANY.ID'), className: 'min-w-125px p-3 rounded-start' },
        { title: this.translate.instant('COMPANY.TITLE'), className: 'ps-4 min-w-300px' },
        { title: this.translate.instant('COMPANY.EN_NAME'), className: 'min-w-125px' },
        { title: this.translate.instant('COMPANY.cr_number'), className: 'min-w-200px' },
        { title: this.translate.instant('COMPANY.Status'), className: 'min-w-150px' },
        { title: '', className: 'min-w-200px text-end rounded-end' },
      ]
  }
  ngOnInit(): void {
    this.companyService.getAll().subscribe(res => {
      console.log('companies', res);
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('companies/add')
  }

  detailsClicked(row: any) {
    console.log(row);
    this.router.navigateByUrl('companies/' + row.id)
  }

}
