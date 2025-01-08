import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-monthly-recomendation',
  templateUrl: './monthly-recomendation.component.html',
  styleUrl: './monthly-recomendation.component.scss'
})
export class MonthlyRecomendationComponent implements OnInit {

  projectId: number;
  reportId: number;
  reportDetails: any;
  isLoading: boolean;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  recommendModelData: any;
  @ViewChild('addRecommendationModal') addRecommendationModal: TemplateRef<any>;

  @ViewChild('approveModal') approveModal: TemplateRef<any>;
  approveModelData: any = { approved: true, id: 0, type: 2 };

  constructor(
    private _location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,
    // private attachmentService: AttachmentService,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.reportId = +params['reportId'];
      if (this.reportId) {
        this.getReportDetails();
        this.recommendModelData = { contractor: '', consultant: '', owner: '', monthlyReportId: this.reportId };
      }
    });
  }

  getReportDetails() {
    this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
      this.reportDetails = res.data;
      console.log(this.reportDetails);
      this.cdr.detectChanges();
    });
  }


  addRecommendation() {
    this.modalService.open(this.addRecommendationModal, this.modalConfig);
  }

  onSubmitNote() {
    // debugger
    this.monthlyReportsService.postMonthlyReportRecommendation(this.recommendModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Recommendation Added successfully!' });
      this.modalService.dismissAll();
      this.recommendModelData = { contractor: '', consultant: '', owner: '' };
      this.getReportDetails();
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
  }

  approveRecommendation() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  onApprove() {
    this.approveModelData['id'] = this.reportId;
    this.monthlyReportsService.approveStep(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: this.approveModelData.approved ? 'Recommendation Approved successfully' : 'Recommendation Rejected successfully' });
      this.approveModelData = { approved: true, id: this.reportId, type: 2 };
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
