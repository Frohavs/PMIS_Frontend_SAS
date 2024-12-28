import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { map } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';


@Component({
  selector: 'app-work-progress-picture',
  templateUrl: './work-progress-picture.component.html',
  styleUrl: './work-progress-picture.component.scss'
})
export class WorkProgressPictureComponent implements OnInit {

  projectId: number;
  reportId: number;
  isLoading: boolean;
  projectDetails: any;
  workProgressForm: FormGroup;
  uploadedPictures: any[] = [];

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;


  constructor(
    private _location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.initWorkProgressForm();


    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        // this.getProjectDetails();
        // this.getFormValues()
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.reportId = +params['reportId'];
      if (this.reportId) {
        // this.getProjectDetails();
        // this.getFormValues()
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
