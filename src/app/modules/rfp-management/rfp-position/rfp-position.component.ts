import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-rfp-position',
  templateUrl: './rfp-position.component.html',
  styleUrl: './rfp-position.component.scss'
})
export class RfpPositionComponent implements OnInit, OnDestroy {

  rfpId: number;
  rfpDetails: any;
  rfpPositions: any;
  logsDetails: any;
  isLoading: boolean;

  statusId: any = '';
  noteType: any = '';
  note = '';
  statusList: any[] = [];
  noteTypes: any[] = [];

  quantityEdit: any;

  userId: any;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  timer: { days: number; hours: number; minutes: number; seconds: number } | null = null;
  intervalId: any;

  constructor(
    private router: Router,
    private _location: Location,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private rfpManagementService: RfpManagementService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.rfpId = +params['rfpId'];
      if (this.rfpId) {
        this.getRfpLogsDetails()
      }
    });

    this.getLookups();


  }

  getRfpLogsDetails() {
    this.rfpManagementService.getRFPById(this.rfpId).subscribe(res => {
      this.rfpDetails = res.data;
      this.startCountdown();
      this.cdr.detectChanges();
    });
    this.rfpManagementService.getPositionsRfp(this.rfpId).subscribe(res => {
      this.rfpPositions = res.data;
      this.cdr.detectChanges();
    });
    this.rfpManagementService.getRfpLogs(this.rfpId).subscribe(res => {
      this.logsDetails = res.data;
      this.cdr.detectChanges();
    });
  }
  getLookups() {
    // this.lookupService.getMIRNoteTypes().subscribe(res => {
    //   this.noteTypes = res.data;
    //   this.cdr.detectChanges();
    // });
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  navigatePosition(position: any) {
    console.log(position);
    this.router.navigate([`rfp_management/rfp-position-details/${position.id}`],
      { queryParams: { rfpId: this.rfpId, positionId: position.positionId, positionName: position.positionName } });
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCountdown(): void {
    const target = new Date(this.rfpDetails?.targetDate).getTime(); // Target date in milliseconds
    const received = new Date(this.rfpDetails?.receivedDate).getTime(); // Received date in milliseconds
    // Ensure the target date is later than the received date
    if (target <= received) {
      this.timer = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return;
    }

    // Calculate the total difference in milliseconds
    let difference = target - received;

    this.updateTimer(difference);

    // Start countdown logic with setInterval
    this.intervalId = setInterval(() => {
      difference -= 1000; // Reduce difference by 1 second (1000 ms)

      if (difference <= 0) {
        this.timer = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        clearInterval(this.intervalId); // Stop the timer
      } else {
        this.updateTimer(difference);
      }
    }, 1000);
  }

  updateTimer(difference: number): void {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    this.timer = { days, hours, minutes, seconds };
    this.cdr.detectChanges();
  }


  back() {
    this._location.back();
  }
}
