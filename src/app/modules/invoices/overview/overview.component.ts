import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  activeTab: number = 0;

  etimadNumber: string;

  constructor() { }

  ngOnInit(): void {

  }
  setActiveTab(index: number) {
    this.activeTab = index;
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
