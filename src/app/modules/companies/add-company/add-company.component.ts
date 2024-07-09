import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent implements OnInit, OnDestroy {

  companyId: number;
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(private cdr: ChangeDetectorRef, private _location: Location, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCompanyId();
  }

  getCompanyId() {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = +params['id'];
      console.log('Company ID:', this.companyId);
    });
  }

  saveSettings() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
