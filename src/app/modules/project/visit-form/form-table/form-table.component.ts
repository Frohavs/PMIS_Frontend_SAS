import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { VisitFormService } from 'src/app/services/visit-form.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

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
  isLoading: boolean;

  addCommentForm: FormGroup;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  changeDocumentForm: FormGroup;
  @ViewChild('documentModal') documentModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private visitFormService: VisitFormService
  ) {}

  ngOnInit(): void {
    this.initChangeDocumentForm();

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

  changeDocumentNo() {
    this.modalService.open(this.documentModal, this.modalConfig);
  }

  initChangeDocumentForm() {
    this.changeDocumentForm = this.fb.group({
      documentNo: [''],
    });
  }

  onChangeDocuemntNo() {
    // const val = this.updateForm.value
    if (this.changeDocumentForm.invalid) {
      this.changeDocumentForm.markAllAsTouched();
      return;
    }
    const payload = {
      "id": this.visitId,
      "documentNo": this.changeDocumentForm.value.documentNo
    };

    this.visitFormService.updateDocumentNo(payload).subscribe(
      (res) => {
        this.getVisitDetails();
        this.modalService.dismissAll();
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
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
