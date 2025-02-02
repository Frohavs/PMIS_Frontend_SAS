import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-stage-update',
  templateUrl: './project-stage-update.component.html',
  styleUrl: './project-stage-update.component.scss',
})
export class ProjectStageUpdateComponent implements OnInit {
  projectId: number;
  projectDetails: any;
  isLoading: boolean;
  UpdateStageForm: FormGroup;
  stages: any[] = [];
  selectedFile: any;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private attachmentService: AttachmentService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

    this.initUpdateStageForm();
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getProjectDetails();
      }
    });

    this.lookupService.getProjectStages().subscribe((res) => {
      this.stages = res.data;
      this.cdr.detectChanges();
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe((res) => {
      this.projectDetails = res.data;
      this.UpdateStageForm.patchValue({
        new_project_stage: this.projectDetails.contractStatusId,
      });
      this.cdr.detectChanges();
    });
  }

  initUpdateStageForm() {
    this.UpdateStageForm = this.formBuilder.group({
      new_project_stage: ['', Validators.required],
      offTrackDate: ['', Validators.required],
      offTrackAttachment: ['test.png', Validators.required],
    });
  }

  onFileSelected($event: any) {
    this.selectedFile = <File>$event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe((res) => {
      this.UpdateStageForm.patchValue({
        offTrackAttachment: res.data,
      });
    });
  }

  saveChanges() {
    if (!this.UpdateStageForm.valid) {
      this.UpdateStageForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload: any = {
      id: +this.projectId,
      offTrackDate: this.UpdateStageForm.value.offTrackDate,
      offTrackAttachment: this.UpdateStageForm.value.offTrackAttachment,
    };
    this.projectsService.updateProjectStage(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'Project Stage Updated successfully',
        });
        setTimeout(() => {
          this.router.navigateByUrl('projects/update-project-info/' + this.projectId);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'please try again',
        });
        this.isLoading = false;
      },
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
}
