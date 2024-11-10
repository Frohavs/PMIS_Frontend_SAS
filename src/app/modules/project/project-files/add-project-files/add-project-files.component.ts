import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsFilesService } from 'src/app/services/projects-files.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-project-files',
  templateUrl: './add-project-files.component.html',
  styleUrl: './add-project-files.component.scss'
})
export class AddProjectFilesComponent implements OnInit {
  projectId: number;
  fileId: number;
  isLoading: boolean;
  addAttachmentForm: FormGroup;
  projects: any[] = [];

  categories: any[] = [];
  subCategories: any[] = [];

  classifications: any[] = [];
  subClassifications: any[] = [];

  attachmentPurposes: any[] = [];
  attachmentStatus: any[] = [];

  selectedFile: File;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private attachmentService: AttachmentService,
    private projectsService: ProjectsService,
    private projectsFilesService: ProjectsFilesService,
  ) { }

  ngOnInit(): void {
    this.initProjectFilesForm();
    this.getRecordId();
    this.getLookups();

    this.addAttachmentForm.get('categoryId')?.valueChanges.subscribe((id: number) => {
      if (id) {
        this.lookupService.getAttachmentSubCategories(id).subscribe(res => {
          this.subCategories = res.data;
          this.cdr.detectChanges();
        });
      }
    });

    this.addAttachmentForm.get('classificationId')?.valueChanges.subscribe((id: number) => {
      if (id) {
        this.lookupService.getAttachmentSubCategories(id).subscribe(res => {
          this.subClassifications = res.data;
          this.cdr.detectChanges();
        });
      }
    });
  }

  initProjectFilesForm() {
    this.addAttachmentForm = this.formBuilder.group({
      projectId: [null, Validators.required],
      categoryId: [null, Validators.required],
      subCategoryId: ['', Validators.required],
      classificationId: [null, Validators.required],
      subClassificationId: ['', Validators.required],
      title: ['', Validators.required],
      revision: ['', Validators.required],
      revisionDate: ['', Validators.required],
      receivedDate: ['', Validators.required],
      referenceNo: [''],
      alternativeReferenceNumber: [''],
      comments: [''],
      purposeId: [null, Validators.required],
      statusId: [null, Validators.required],
      file: ['', Validators.required],
    });
  }

  getLookups() {
    this.projectsService.getAllProjects().subscribe(res => {
      this.projects = res.data.items;
    });
    this.lookupService.getAttachmentCategories().subscribe(res => {
      this.categories = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getAttachmentClassifications().subscribe(res => {
      this.classifications = res.data;
      this.cdr.detectChanges();
    });

    this.lookupService.getAttachmentPurposes().subscribe(res => {
      this.attachmentPurposes = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getAttachmentStatuses().subscribe(res => {
      this.attachmentStatus = res.data;
      this.cdr.detectChanges();
    });
  }

  getRecordId() {

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.addAttachmentForm.patchValue({ projectId: this.projectId });
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.fileId = params['fileId'];
      if (this.fileId) {
        this.projectsFilesService.getFileDetails(this.fileId).subscribe(res => {
          setTimeout(() => {
            this.editFileForm(res.data);
            this.cdr.detectChanges();
          }, 1000);
        });
      }
    });
  }

  editFileForm(data: any) {
    this.addAttachmentForm.patchValue({
      projectId: data.projectId,
      categoryId: 1,
      subCategoryId: data?.subCategoryId,
      classificationId: 1,
      subClassificationId: data?.subClassificationId,
      title: data?.title,
      revision: data?.revision,
      revisionDate: data?.revisionDate?.slice(0, 10),
      receivedDate: data?.receivedDate?.slice(0, 10),
      referenceNo: data?.referenceNo,
      alternativeReferenceNumber: data?.alternativeReferenceNumber,
      comments: data?.comments,
      purposeId: data.purposeId,
      statusId: data.statusId,
      file: data?.file,
    });
  }


  onAttachment(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addAttachmentForm.patchValue({
        file: this.selectedFile.name
      });
    });
  }

  saveChanges() {
    if (this.addAttachmentForm.invalid) {
      this.addAttachmentForm.markAllAsTouched();
      return;
    }
    if (!this.fileId) {
      const payload = {
        ...this.addAttachmentForm.value,
        projectId: this.projectId,
        subClassificationId: +this.addAttachmentForm.get('subClassificationId')?.value,
        subCategoryId: +this.addAttachmentForm.get('subCategoryId')?.value,
        statusId: +this.addAttachmentForm.get('statusId')?.value,
        purposeId: +this.addAttachmentForm.get('purposeId')?.value,
      };
      delete payload.categoryId;
      delete payload.classificationId;

      this.projectsFilesService.addProjectsFile(payload).subscribe(res => {
        this.router.navigateByUrl(`projects/project-files/${this.projectId}`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'File Added successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    } else {
      const payload = {
        id: this.fileId, ...this.addAttachmentForm.value,
        projectId: this.projectId,
        subClassificationId: +this.addAttachmentForm.get('subClassificationId')?.value,
        subCategoryId: +this.addAttachmentForm.get('subCategoryId')?.value,
        statusId: +this.addAttachmentForm.get('statusId')?.value,
        purposeId: +this.addAttachmentForm.get('purposeId')?.value,
      };

      delete payload.categoryId;
      delete payload.classificationId;

      this.projectsFilesService.updateProjectsFile(payload).subscribe(res => {
        this.router.navigateByUrl(`projects/project-files/${this.projectId}`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'File Updated successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    }
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
