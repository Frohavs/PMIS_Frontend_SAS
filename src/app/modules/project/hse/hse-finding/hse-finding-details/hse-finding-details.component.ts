import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
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

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  firstModel: { clarifications: string, instructions: string, attachment: string } = { clarifications: '', instructions: '', attachment: '' };
  @ViewChild('firstModal') firstModal!: any;

  secondModel: { dateOfActionsTaken: string, actionsTaken: string, attachment: string, instructions: string } = { dateOfActionsTaken: '', actionsTaken: '', attachment: '', instructions: '' };
  @ViewChild('secondModal') secondModal!: any;

  thirdModel: { approved: boolean, validations: string, furtherInstructions: string, attachment: string } = { approved: false, validations: '', furtherInstructions: '', attachment: '' };
  @ViewChild('thirdModal') thirdModal!: any;

  forthModel: { approved: boolean, validations: string, furtherInstructions: string, attachment: string } = { approved: false, validations: '', furtherInstructions: '', attachment: '' };
  @ViewChild('forthModal') forthModal!: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private hseService: HseService,
    private attachmentService: AttachmentService,
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

  fireSubmitContractorModal() {
    this.firstModel = { clarifications: '', instructions: '', attachment: '' };
    this.modalService.open(this.firstModal, this.modalConfig);
  }
  onFirstFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.firstModel.attachment = file.name;
        this.cdr.detectChanges();
      });
    }

  }
  onFirstSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const payload = {
      clarifications: this.firstModel.clarifications,
      instructions: this.firstModel.instructions,
      attachment: this.firstModel.attachment,
      findingId: this.findingId
    };
    this.hseService.submitToContractor(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.getDetails();
      this.getLogs();
      this.firstModel = { clarifications: '', instructions: '', attachment: '' };
      this.cdr.detectChanges();
    });
  }

  fireReturnConsultantModal() {
    this.secondModel = { dateOfActionsTaken: '', actionsTaken: '', attachment: '', instructions: '' };
    this.modalService.open(this.secondModal, this.modalConfig);
  }

  onSecondFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.secondModel.attachment = file.name;
        this.cdr.detectChanges();
      });
    }

  }

  onSecondSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const payload = {
      instructions: this.secondModel.instructions,
      actionsTaken: this.secondModel.actionsTaken,
      dateOfActionsTaken: this.secondModel.dateOfActionsTaken,
      attachment: this.secondModel.attachment,
      findingId: this.findingId
    };
    this.hseService.returnedToConsultant(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.secondModel = { dateOfActionsTaken: '', actionsTaken: '', attachment: '', instructions: '' };
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }

  fireConsultantReviewModal() {
    this.thirdModel = { approved: false, validations: '', furtherInstructions: '', attachment: '' };
    this.modalService.open(this.thirdModal, this.modalConfig);
  }

  onThirdFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.thirdModel.attachment = file.name;
        this.cdr.detectChanges();
      });
    }

  }
  onThirdSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const payload = {
      approved: this.thirdModel.approved,
      validations: this.thirdModel.validations,
      furtherInstructions: this.thirdModel.furtherInstructions,
      attachment: this.thirdModel.attachment,
      findingId: this.findingId
    };
    this.hseService.consultantReview(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.thirdModel = { approved: false, validations: '', furtherInstructions: '', attachment: '' };
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }
  firePmoReviewModal() {
    this.forthModel = { approved: false, validations: '', furtherInstructions: '', attachment: '' };
    this.modalService.open(this.forthModal, this.modalConfig);
  }

  onForthFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.forthModel.attachment = file.name;
        this.cdr.detectChanges();
      });
    }

  }
  onForthSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const payload = {
      approved: this.forthModel.approved,
      validations: this.forthModel.validations,
      furtherInstructions: this.forthModel.furtherInstructions,
      attachment: this.forthModel.attachment,
      findingId: this.findingId
    };
    this.hseService.pMOReview(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.forthModel = { approved: false, validations: '', furtherInstructions: '', attachment: '' };
      this.getDetails();
      this.getLogs();
      this.cdr.detectChanges();
    });
  }
}
