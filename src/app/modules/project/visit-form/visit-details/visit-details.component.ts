import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { VisitFormService } from 'src/app/services/visit-form.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrl: './visit-details.component.scss',
})
export class VisitDetailsComponent implements OnInit {
  projectId: number;
  visitId: number;
  projectDetails: any;
  visitDetails: any;
  isLoading: boolean;

  addCommentForm: FormGroup;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private visitFormService: VisitFormService
  ) {}

  ngOnInit(): void {
    this.initCommentForm();
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.projectsService.getByID(this.projectId).subscribe((res) => {
          this.projectDetails = res.data;
          this.cdr.detectChanges();
        });
      }
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.visitId = +params['visitId'];
      if (this.visitId) {
        this.getVisitDetails();
      }
    });
  }

  getVisitDetails() {
    this.visitFormService.getVisitById(this.visitId).subscribe((res) => {
      this.visitDetails = res.data;
      this.cdr.detectChanges();
    });
  }

  initCommentForm() {
    this.addCommentForm = this.fb.group({
      comment: [''],
    });
  }

  saveComment() {
    if (!this.addCommentForm.valid) {
      this.addCommentForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      visitFormId: this.visitId,
      comment: this.addCommentForm.value.comment,
    };
    this.visitFormService.addComment(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.addCommentForm.reset();
        this.getVisitDetails();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'Comment Added successfully!',
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
        this.isLoading = false;
      },
    });
  }

  navigateToForm() {
    this.router.navigateByUrl(
      'projects/visit-form-table/' + this.projectId + '?visitId=' + this.visitId
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
}
