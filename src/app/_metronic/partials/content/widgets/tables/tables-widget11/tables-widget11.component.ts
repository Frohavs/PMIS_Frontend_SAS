import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tables-widget11',
  templateUrl: './tables-widget11.component.html',
})
export class TablesWidget11Component implements OnInit {

  @Input() tableTitle: string = 'New Title';
  @Input() table_SubTitle: string = 'Over 500 new products';
  @Input() canChangeStatus: boolean = true;
  @Input() canEdit: boolean = true;
  @Input() canDelete: boolean = true;

  @Input() dataList: any = [
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-26.jpg',
      name: 'company name',
      subName: 'company desc',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-3.jpg',
      name: 'company name',
      subName: 'company desc',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Inactive'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-8.jpg',
      name: 'company name',
      subName: 'company desc',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'In Progress'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-9.jpg',
      name: 'company name',
      subName: 'company desc',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-18.jpg',
      name: 'company name',
      subName: 'company desc',
      arName: 'شركة',
      enName: 'comp',
      crNumber: '1010014082',
      status: 'Inactive'
    },
  ];
  @Output() newClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  redirect() {
    this.newClicked.emit();
  }
}
