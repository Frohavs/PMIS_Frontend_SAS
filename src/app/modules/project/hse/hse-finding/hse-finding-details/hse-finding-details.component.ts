import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HseService } from 'src/app/services/hse.service';

@Component({
  selector: 'app-hse-finding-details',
  templateUrl: './hse-finding-details.component.html',
  styleUrl: './hse-finding-details.component.scss'
})
export class HseFindingDetailsComponent implements OnInit {

  findingId: number;
  findingDetails: any;
  findingLogs: any;
  isLoading: boolean;

  options: google.maps.MapOptions = {
    center: { lat: 24.774265, lng: 46.738586 },
    zoom: 11
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: false // Enable marker dragging
  };
  markerPosition: google.maps.LatLngLiteral | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private hseService: HseService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.findingId = +params['findingId'];
      if (this.findingId) {
        this.getDetails();
        this.getLogs();
      }
    });

  }

  getDetails() {
    this.hseService.getFindingById(this.findingId).subscribe(res => {
      this.findingDetails = res.data;
      this.markerPosition = { lat: +this.findingDetails?.latitude, lng: +this.findingDetails?.longitude };
      this.options.center = { lat: +this.findingDetails?.latitude, lng: +this.findingDetails?.longitude };
      this.cdr.detectChanges();
    });
  }

  getLogs() {
    this.hseService.getFindingLogsById(this.findingId).subscribe(res => {
      this.findingLogs = res.data;
      this.cdr.detectChanges();
    });
  }


  navigateUpdateStaff() {
  }

  navigateUpdateInfo() {
  }

  updateProjectInfo() {
  }

  navigateUpdateProgress() {
  }

  navigateProjectStage() {
  }

  navigateProjectStatusReport() {
  }
  fireSubmitContractorModal() {
    const payload = {
      clarifications: "testC",
      instructions: "testI",
      attachment: "ipad.png",
      findingId: 7
    };
    this.hseService.submitToContractor(payload).subscribe(res => {
      debugger
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }
  fireReturnConsultantModal() {
    const payload = {
      instructions: "string",
      actionsTaken: "string",
      dateOfActionsTaken: "2024-11-15T20:15:36.329Z",
      attachment: "ipad.png",
      findingId: 7
    };
    this.hseService.returnedToConsultant(payload).subscribe(res => {
      debugger
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }

  fireConsultantReviewModal() {
    const payload = {
      approved: true,
      validations: "string",
      furtherInstructions: "string",
      attachment: "ipad.png",
      findingId: 7
    };
    this.hseService.consultantReview(payload).subscribe(res => {
      debugger
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }
  firePmoReviewModal() {
    const payload = {

      approved: false,
      validations: "string",
      furtherInstructions: "string",
      findingId: 7
    };
    this.hseService.pMOReview(payload).subscribe(res => {
      debugger
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }
}
