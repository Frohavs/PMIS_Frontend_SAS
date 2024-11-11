import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/modules/auth';
import { HseService } from 'src/app/services/hse.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrl: './add-report.component.scss'
})
export class AddReportComponent implements OnInit {
  projectId: number;
  fileId: number;
  isLoading: boolean;
  addReportForm: FormGroup;
  projects: any[] = [];

  currentUser: any;
  users: any[] = [];

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
    private authService: AuthService,
    private hseService: HseService,
  ) { }

  ngOnInit(): void {
    this.initProjectFilesForm();
    this.getRecordId();
    this.getLookups();
  }

  initProjectFilesForm() {
    this.addReportForm = this.formBuilder.group({
      inspectionDate: ['', Validators.required],
      executedById: [null, Validators.required],
      createdById: [{value: this.authService.currentUserValue?.fullName, disabled: true}, Validators.required],
      contractualPenalty: [0, Validators.required],
    });
  }

  getLookups() {

    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });

  }

  getRecordId() {

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.addReportForm.patchValue({ projectId: this.projectId });
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.fileId = params['fileId'];
      if (this.fileId) {
        this.hseService.getFileDetails(this.fileId).subscribe(res => {
          setTimeout(() => {
            this.editFileForm(res.data);
            this.cdr.detectChanges();
          }, 1000);
        });
      }
    });
  }

  editFileForm(data: any) {
    this.addReportForm.patchValue({
      inspectionDate: data?.inspectionDate?.slice(0, 10),
      executedById: data?.executedById,
      contractualPenalty: data?.contractualPenalty,
    });
  }

  saveChanges() {
    if (this.addReportForm.invalid) {
      this.addReportForm.markAllAsTouched();
      return;
    }
    if (!this.fileId) {
      const payload = {
        ...this.addReportForm.value,
        projectId: this.projectId,
        executedById: +this.addReportForm.get('executedById')?.value,
      };


      this.hseService.addReport(payload).subscribe(res => {
        this.router.navigateByUrl(`projects/hse/${this.projectId}`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Report Added successfully!' });
      }, error => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
      });
    } else {
      const payload = {
        ...this.addReportForm.value,
        id: this.fileId, ...this.addReportForm.value,
        projectId: this.projectId,
        executedById: +this.addReportForm.get('executedById')?.value,
      };

      delete payload.categoryId;
      delete payload.classificationId;

      this.hseService.updateProjectsFile(payload).subscribe(res => {
        this.router.navigateByUrl(`projects/hse/${this.projectId}`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Report Updated successfully!' });
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
