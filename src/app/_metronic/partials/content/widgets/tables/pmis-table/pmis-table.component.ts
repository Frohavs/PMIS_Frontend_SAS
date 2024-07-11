import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pmis-table',
  templateUrl: './pmis-table.component.html',
})
export class PMISTableComponent implements OnInit {


  @Input() Add_text: string = 'New Title';
  @Input() Search_text: string = 'Over 500 new products';
  @Input() tableTitle: string = 'New Title';
  @Input() table_SubTitle: string = 'Over 500 new products';

  @Input() showActions: boolean = true;
  @Input() canSearch: boolean = false;
  @Input() canViewDetails: boolean = true;
  @Input() canChangeStatus: boolean = true;
  @Input() canEdit: boolean = true;
  @Input() canDelete: boolean = true;

  @Input() dataList: any = [];
  @Input() dataColumns: any = [];

  @Output() newClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() detailsClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {

  }

  redirect() {
    this.newClicked.emit();
  }

  populateViewClicked(value: any) {
    this.detailsClicked.emit(value)
  }

  populateEditClicked(value: any) {
    this.editClicked.emit(value)
  }

  populateDeleteClicked(value: any) {
    this.deleteClicked.emit(value)
  }
}
