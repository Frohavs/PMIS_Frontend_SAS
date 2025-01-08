import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-work-progress-picture',
  templateUrl: './work-progress-picture.component.html',
  styleUrl: './work-progress-picture.component.scss'
})
export class WorkProgressPictureComponent implements OnInit {

  projectId: number;
  reportId: number;
  reportDetails: any;
  isLoading: boolean;
  projectDetails: any;
  workProgressForm: FormGroup;
  uploadedPictures: any[] = [];

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('approveModal') approveModal: TemplateRef<any>;
  approveModelData: any = { approved: true, id: 0, type: 1 };

  constructor(
    private _location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.initWorkProgressForm();

    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.reportId = +params['reportId'];
      if (this.reportId) {
        this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
          this.reportDetails = res.data;
          if(this.reportDetails?.images.length) {
            for (const element of this.reportDetails?.images) {
              this.uploadedPictures.push({ src: element, id: element });

            }
          };
          console.log(this.reportDetails);
          this.cdr.detectChanges();
        });
      }
    });
  }

  initWorkProgressForm() {
    this.workProgressForm = this.formBuilder.group({
      attachment: [null, Validators.required],
    });
  }

  onFileChange(event: any) {
    for (const file of event.target.files) {
      if (file) {
        const fd = new FormData();
        fd.append('Attachment', file, file.name);
        this.attachmentService.uploadAttachment(fd).subscribe(res => {
          // Generate image preview if the file is an image
          const fileType = file.type;
          if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
              this.uploadedPictures.push({ src: (reader.result as string), id: res.data }); // Push preview URL to the array
              this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }
    event.target.value = '';
  }

  removePicture(picture: string): void {
    debugger
    for (let index = 0; index < this.uploadedPictures.length; index++) {
      if (this.uploadedPictures[index].id === picture) {
        this.uploadedPictures.splice(index, 1); // Remove the picture from the array
        break; // Exit the loop after removing the picture
      }
    }
  }

  saveChanges() {
    if (!this.workProgressForm.valid) {
      this.workProgressForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload: any = {
      id: this.reportId,
      images: this.uploadedPictures.map((picture: { id: string }) => picture.id)
    }

    this.monthlyReportsService.createWorkProgressImages(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert({ icon: 'success', title: 'Success!', text: 'images Uploaded successfully' });
        this.router.navigateByUrl(`projects/monthly_report_details/${this.projectId}?reportId=${this.reportId}`);
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      }
    });
  }

  approveNotes() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  onApprove() {
    this.approveModelData['id'] = this.reportId;
    this.monthlyReportsService.approveStep(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: this.approveModelData.approved ? 'Notes Approved successfully' : 'Notes Rejected successfully' });
      this.approveModelData = { approved: true, id: this.reportId, type: 1 };
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
