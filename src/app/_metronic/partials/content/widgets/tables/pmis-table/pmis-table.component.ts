import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-pmis-table',
  templateUrl: './pmis-table.component.html',
})
export class PMISTableComponent implements OnInit, AfterViewInit, OnDestroy {

  selected = 1;
  private inputSubscription: Subscription;


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

  @Input() dataColumns: any = [];
  @Input() dataList: any = [];
  @Input() totalCount: number = 10;
  @Input() pagesCount: number[] = [];

  @Output() newClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() detailsClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() pageClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchKeyEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.searchKeyEmitter.emit(searchText)
    });
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

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.pageClicked.emit(pageIndex)
  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
