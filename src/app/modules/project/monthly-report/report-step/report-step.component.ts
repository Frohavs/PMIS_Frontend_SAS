import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-report-step',
  templateUrl: './report-step.component.html',
  styleUrl: './report-step.component.scss'
})
export class ReportStepComponent implements OnInit {

  projectId: number;
  projectDetails: any;
  reportId: number;
  reportDetails: any;
  ratingProgressResult = 0;
  completionProgressResult = 0;
  isLoading: boolean;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('approveModal') approveModal: TemplateRef<any>;
    swalOptions: SweetAlertOptions = { buttonsStyling: false };
    @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
    approveModelData: any = { approved: true, id: 0, type: 4 };


  constructor(

    private router: Router,
    private _location: Location,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.projectId = +res['id'];
      this.monthlyReportsService.getProjectData(this.projectId).subscribe((res) => {
        this.projectDetails = res.data;
        this.cdr.detectChanges();
      })
    });
    this.activatedRoute.queryParams.subscribe((res) => {
      this.reportId = +res['reportId'];
      if (this.reportId) {
        this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
          this.reportDetails = res.data;
          this.cdr.detectChanges();
        });
      }
    });
  }

  approve() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  addNewReport() {
    this.router.navigate([`projects/monthly_report_step_add/${this.projectId}`], { queryParams: { reportId: this.reportId } });
  }
  navigateDetails() {
    this.router.navigate([`projects/monthly_report_step_details/${this.projectId}`], { queryParams: { reportId: this.reportId } });
  }
  download() {
    this.router.navigate([`projects/monthly_report_step_details/${this.projectId}`], { queryParams: { reportId: this.reportId, print: true } });
  }

  onApprove() {
    this.approveModelData['id'] = this.reportId;
    this.monthlyReportsService.approveStep(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: this.approveModelData.approved ? 'Report Approved successfully' : 'Report Rejected successfully' });
      this.approveModelData = { approved: true, id: this.reportId, type: 4 };
      this.router.navigateByUrl(`projects/monthly_report_details/${this.projectId}?reportId=${this.reportId}`);
      this.modalService.dismissAll();
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
    });
  }

  back() {
    this._location.back();
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
}
