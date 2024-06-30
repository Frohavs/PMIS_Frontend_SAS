import { Component } from '@angular/core';

@Component({
  selector: 'pmis-table',
  templateUrl: './pmis-table.component.html',
  styleUrl: './pmis-table.component.scss'
})
export class PmisTableComponent {

  List: any;

  page = 1;
  pageSize = 10;
  pagination!: any;

  constructor() {

  }

  getListItems() {
    // this.membersService
    //   .getMembersData(this.page, this.pageSize)
    //   .subscribe((res: any) => {
    //     this.List = res.data;
    //     this.pagination = res.meta;
    //   });
  }

}
