import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffEvaluationService } from 'src/app/services/staff-evaluation.service';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrl: './evaluation-details.component.scss'
})
export class EvaluationDetailsComponent implements OnInit {

  evalId: number;
  evalDetails: any[] = []

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
        this.evalDetails = res.data;
        this.cdr.detectChanges()
        console.log(this.evalDetails);
      });
    });
  }

  getFinalScore() {
    let score = 0;
    for (const element of this.evalDetails) {
      score += element.scale * (element.weight / 100);
    }
    return score
  }

  back() {
    this._location.back();
  }
}
