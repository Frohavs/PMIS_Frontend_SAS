import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { VisitFormService } from 'src/app/services/visit-form.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from 'src/app/services/lookup/lookup.service';

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrl: './form-table.component.scss',
})
export class FormTableComponent implements OnInit {
  projectId: number;
  visitId: number;
  projectDetails: any;
  visitDetails: any;
  visitIndices: any[] = [];
  isLoading: boolean;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  changeDocumentForm: FormGroup;
  @ViewChild('documentModal') documentModal: TemplateRef<any>;
  attendanceForm: FormGroup;
  @ViewChild('attendanceModal') attendanceModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private visitFormService: VisitFormService
  ) {}

  ngOnInit(): void {
    this.getLookups();
    this.initChangeDocumentForm();
    this.initAttendanceFormForm();

    this.activatedRoute.params.subscribe((params) => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getProjectDetails();
      }
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.visitId = +params['visitId'];
      if (this.visitId) {
        this.getVisitDetails();
      }
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe((res) => {
      this.projectDetails = res.data;
      this.cdr.detectChanges();
    });
  }
  getVisitDetails() {
    this.visitFormService.getVisitById(this.visitId).subscribe((res) => {
      this.visitDetails = res.data;
      this.cdr.detectChanges();
    });
  }
  getLookups() {
    this.lookupService.getVisitFormIndices().subscribe((res) => {
      this.visitIndices = res.data;
      this.cdr.detectChanges();
    });
  }

  changeDocumentNo() {
    this.modalService.open(this.documentModal, this.modalConfig);
  }
  openAttendance(attendance?: any){
    this.attendanceForm.reset();
    if(attendance) {
      this.attendanceForm.patchValue({
        id: attendance.id,
        name: attendance.name,
        side: attendance.side,
        job: attendance.job,
        email: attendance.email
      });
    }
    this.modalService.open(this.attendanceModal, this.modalConfig);
  }

  initChangeDocumentForm() {
    this.changeDocumentForm = this.fb.group({
      documentNo: ['', Validators.required],
    });
  }
  initAttendanceFormForm() {
    this.attendanceForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      side: ['', Validators.required],
      job: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  onChangeDocumentNo() {
    // const val = this.updateForm.value
    if (this.changeDocumentForm.invalid) {
      this.changeDocumentForm.markAllAsTouched();
      return;
    }
    const payload = {
      id: this.visitId,
      updateType: 1,
      documentNo: this.changeDocumentForm.value.documentNo,
      generalRecommendations: '',
      communicationAndCoordination: '',
      safetyRecommendations: '',
      totalCommitmentPercentage: '',
    };

    this.visitFormService.updateDocumentFields(payload).subscribe(
      (res) => {
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.changeDocumentForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'No Updated successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddAttendance() {
    if (this.attendanceForm.invalid) {
      this.attendanceForm.markAllAsTouched();
      return;
    }
    debugger;
    this.isLoading = true;
    let payload: any = {
      visitFormId: this.visitId,
      name: this.attendanceForm.value.name,
      side: this.attendanceForm.value.side,
      job: this.attendanceForm.value.job,
      email: this.attendanceForm.value.email,
    };
    if(this.attendanceForm.value.id !== 0){ 
      payload['id'] = this.attendanceForm.value.id;
    }

    this.visitFormService.addAttendee(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.attendanceForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
  back() {
    this._location.back();
  }

  numbersOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && charCode != 43 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
