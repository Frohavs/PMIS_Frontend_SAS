import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';

@Component({
  selector: 'app-final-review-print',
  templateUrl: './final-review-print.component.html',
  styleUrl: './final-review-print.component.scss'
})
export class FinalReviewPrintComponent implements OnInit {


  updateInfo: boolean;
  projectId: number;
  stageId: number;
  projectDetails: any;
  isLoading: boolean;
  printDetails: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      if (this.stageId) {
        this.handlePrint();
      }
    });
  }

  handlePrint() {
    this.stageGateManagementService.getFinalReviewPrint(this.stageId).subscribe(res => {
      this.printDetails = res.data;
      setTimeout(() => {

        window.print();
      }, 500);

      this.cdr.detectChanges();
    });
  }
}

