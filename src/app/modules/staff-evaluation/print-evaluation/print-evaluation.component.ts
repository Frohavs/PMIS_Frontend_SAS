import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffEvaluationService } from 'src/app/services/staff-evaluation.service';

@Component({
  selector: 'app-print-evaluation',
  templateUrl: './print-evaluation.component.html',
  styleUrl: './print-evaluation.component.scss'
})
export class PrintEvaluationComponent implements OnInit {

  evalId: number;
  evalDetails: any[] = [];
  fullName: string = '';
  createdOn: string = '';
  quarter = 0;
  year = 0;
  score = 0;
  totalClass: string = '';

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private staffEvaluationService: StaffEvaluationService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.evalId = +params['evalId'];

      this.staffEvaluationService.getEvaluationDetails(this.evalId).subscribe(res => {
        this.evalDetails = res.data[0]?.items;
        this.fullName = res.data[0]?.fullName;
        this.quarter = res.data[0]?.quarter;
        this.year = res.data[0]?.year;
        this.createdOn = res.data[0]?.createdOn;
        let score = 0;
        for (const element of this.evalDetails) {
          score += element.scale * (element.weight / 100);
        }
        this.score = score
        this.cdr.detectChanges()
      });
    });
  }

  getClassName() {
    if (this.score >= 1 && this.score < 2) {
      this.totalClass = 'one';
    } else if (this.score >= 2 && this.score < 3) {
      this.totalClass = 'two';
    } else if (this.score >= 3 && this.score < 4) {
      this.totalClass = 'three';
    } else if (this.score >= 4 && this.score < 5) {
      this.totalClass = 'four';
    } else if (this.score === 5) {
      this.totalClass = 'five';
    }
    return this.totalClass;
  }

  back() {
    this._location.back();
  }
}

