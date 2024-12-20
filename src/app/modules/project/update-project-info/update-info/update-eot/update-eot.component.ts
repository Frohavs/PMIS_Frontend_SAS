import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-eot',
  templateUrl: './update-eot.component.html',
  styleUrl: './update-eot.component.scss',
  providers: [DatePipe]
})
export class UpdateEotComponent implements OnInit {

  projectId: any;
  projectDetails: any;
  selectedFile: File;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('UpdateModal') UpdateModal!: any;

  eotCard: any = { id: 0, eotDays: 0, eotDuration: 0, originalFinishDate: '' };

  EotModel: any = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: '', approvedLetterNumber: 0, approvedLetterDate: '', eotReason: '', eotAttachment: '' };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.resetModalValues();
      }
    });
  }

  resetModalValues() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      this.eotCard = {
        id: this.projectId,
        approvedLetterNumber: 0,
        approvedLetterDate: null,
        eotDays: this.projectDetails?.eoTs.length ? this.projectDetails?.eoTs[this.projectDetails?.eoTs.length - 1]?.eotDays : 0,
        eotDuration: this.projectDetails?.eoTs.length ? (this.projectDetails?.eoTs[this.projectDetails?.eoTs.length - 1]?.duration + this.getDurationToSum()) : this.getDurationDays(),
        originalFinishDate: this.projectDetails?.eoTs.length ? this.datePipe.transform(this.projectDetails?.eoTs[this.projectDetails?.eoTs.length - 1]?.expectedFinishDate, 'yyyy-MM-dd') : this.datePipe.transform(this.projectDetails?.originalFinishDate, 'yyyy-MM-dd')
      };

      this.EotModel['eotDays'] = 0;
      this.EotModel['eotReason'] = '';
      this.EotModel['eotApprovedDays'] = this.projectDetails?.eot?.eotDays;
      this.EotModel['eotFinishDate'] = this.projectDetails?.eoTs.length ? this.datePipe.transform(this.projectDetails?.eoTs[this.projectDetails?.eoTs.length - 1]?.expectedFinishDate, 'yyyy-MM-dd') : this.datePipe.transform(this.projectDetails?.originalFinishDate, 'yyyy-MM-dd');
      this.cdr.detectChanges();
    });
  }

  onEotDaysInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const durationDays = this.getDurationDays();
    this.EotModel.eotApprovedDays = (+value);
    this.EotModel.eotFinishDate = this.addDaysToDate(+value);
  }

  addDaysToDate(days: number) {
    // Step 1: Parse the date string into a Date object
    const originalDate = new Date(this.projectDetails?.eoTs.length ? this.projectDetails?.eoTs[this.projectDetails?.eoTs.length - 1]?.expectedFinishDate : this.projectDetails.originalFinishDate);

    // Step 2: Add days to the Date object
    originalDate.setDate(originalDate.getDate() + days);

    // Step 3: Format the result
    const formattedDate = this.formatDate(originalDate);

    return formattedDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because months are 0-indexed
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  getDurationDays() {
    const date1 = new Date(this.projectDetails?.eoTs.length ? this.projectDetails?.eoTs[this.projectDetails?.eoTs.length - 1]?.expectedFinishDate : this.projectDetails?.originalFinishDate);

    const date2 = new Date(this.projectDetails?.executionStartDate);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = date1.getTime() - date2.getTime();

    // Convert the difference to days
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    return diffInDays;
  }
  getDurationToSum() {
    const date1 = new Date(this.projectDetails?.originalFinishDate);

    const date2 = new Date(this.projectDetails?.executionStartDate);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = date1.getTime() - date2.getTime();

    // Convert the difference to days
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    return diffInDays;
  }

  updateEot() {
    const modalRef = this.modalService.open(this.UpdateModal, this.modalConfig);
    modalRef.result.then((data) => { }, (reason) => {
      // on dismiss
      this.resetModalValues();
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.EotModel['eotAttachment'] = res.data;
    });
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    this.isLoading = true;
    const payload: any = {
      projectId: +this.projectId,
      eotDays: this.EotModel.eotDays,
      eotReason: this.EotModel.eotReason,
      eotAttachment: this.EotModel.eotAttachment,
    }
    if (this.EotModel.approvedLetterNumber) {
      payload['approvedLetterNumber'] = this.EotModel.approvedLetterNumber
    }
    if (this.EotModel.approvedLetterDate) {
      payload['approvedLetterDate'] = this.EotModel.approvedLetterDate
    }
    payload
    this.projectsService.updateEot(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.resetModalValues();
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Eot Updated successfully' });
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      }
    });
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
