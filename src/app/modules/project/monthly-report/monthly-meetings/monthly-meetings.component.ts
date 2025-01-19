import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { SweetAlertOptions } from 'sweetalert2';
@Component({
  selector: 'app-monthly-meetings',
  templateUrl: './monthly-meetings.component.html',
  styleUrl: './monthly-meetings.component.scss'
})
export class MonthlyMeetingsComponent implements OnInit {
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  CorrespondenceModelData: any;
  @ViewChild('addReportModal') addReportModal: TemplateRef<any>;

  @ViewChild('approveModal') approveModal: TemplateRef<any>;
  approveModelData: any = { approved: true, id: 0, type: 3 };
  projectId: number;
  reportId: number;
  reportDetails: any;
  isLoading: boolean;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.reportId = +params['reportId'];
      if (this.reportId) {
        this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
          this.reportDetails = res.data;
          console.log(this.reportDetails);
          this.CorrespondenceModelData = { createdOn: '', subject: '', attachment: '', parties: '', reference: '', typeId: 1, monthlyReportId: this.reportId }
          this.cdr.detectChanges();
        });
      }
    });

  }

  addReport() {
    this.modalService.open(this.addReportModal, this.modalConfig);
  }

  approveReport() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }
  downloadFile(attachment: string) {
    this.attachmentService.downloadAttachment(attachment).subscribe(res => {
      window.open(res.data, '_blank');
    });
  }
  onSubmitNote() {
    debugger
    this.monthlyReportsService.postMonthlyReportCorrespondence(this.CorrespondenceModelData).subscribe(res => {
      this.modalService.dismissAll();
      this.CorrespondenceModelData = { createdOn: '', subject: '', attachment: '', parties: '', reference: '', typeId: 1, monthlyReportId: this.reportId };
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Metting Data Added successfully!' });
      this.getReportDetails();
    }, () => {
      this.modalService.dismissAll();
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
  }
  getReportDetails() {
    this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
      this.reportDetails = res.data;
      console.log(this.reportDetails);
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    const selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', selectedFile, selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.CorrespondenceModelData.attachment = res.data;
    });
  }

  onApprove() {
    this.approveModelData['id'] = this.reportId;
    this.monthlyReportsService.approveStep(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: this.approveModelData.approved ? 'Meeting Data Approved successfully' : 'Meeting Data Rejected successfully' });
      this.approveModelData = { approved: true, id: this.reportId, type: 3 };
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
