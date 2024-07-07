import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pmis-table',
  templateUrl: './pmis-table.component.html',
})
export class PMISTableComponent implements OnInit {


  @Input() Add_text: string = 'New Title';
  @Input() Search_text: string = 'Over 500 new products';
  @Input() tableTitle: string = 'New Title';
  @Input() table_SubTitle: string = 'Over 500 new products';
  @Input() canChangeStatus: boolean = true;
  @Input() canEdit: boolean = true;
  @Input() canDelete: boolean = true;
  @Input() canSearch: boolean = false;

  @Input() dataColumns: any = [];
  @Input() dataList: any = [];
  @Output() newClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  redirect() {
    this.newClicked.emit();
  }
}
