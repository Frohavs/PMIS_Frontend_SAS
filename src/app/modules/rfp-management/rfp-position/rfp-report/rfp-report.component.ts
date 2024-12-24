import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';

@Component({
  selector: 'app-rfp-report',
  templateUrl: './rfp-report.component.html',
  styleUrl: './rfp-report.component.scss'
})
export class RfpReportComponent implements OnInit {

  rfpId: number
  reportDetails: any;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private rfpManagementService: RfpManagementService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.rfpId = +params['id'];
      if (this.rfpId) {
        this.getReportDetails();
      }
    });

  }

  getReportDetails() {
    this.rfpManagementService.GetReport(this.rfpId).subscribe(res => {
      this.reportDetails = res.data;
      this.cdr.detectChanges();
    });
  }

  back() {
    this._location.back();
  }
}
