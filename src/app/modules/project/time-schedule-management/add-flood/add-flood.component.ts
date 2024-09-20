import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimeScheduleService } from 'src/app/services/time-schedule.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';


@Component({
  selector: 'app-add-flood',

  templateUrl: './add-flood.component.html',
  styleUrl: './add-flood.component.scss'
})
export class AddFloodComponent implements OnInit {

  projectId: number;
  floodId: number;
  isLoading: boolean;
  addBoqForm: FormGroup;

  types: any[] = [];
  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;
  selectedFile4: File;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private timeScheduleService: TimeScheduleService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getBoqId();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.floodId = params['floodId'];
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.floodId = +queryParams?.floodId
    if (this.floodId) {
      this.timeScheduleService.getFlood(this.floodId).subscribe(res => {
        this.editVendorForm(res.data);
        this.cdr.detectChanges();
      });
    }
  }

  initAddBoqForm() {
    this.addBoqForm = this.formBuilder.group({
      projectId: [''],
      type: ['', Validators.required],
      revision: ['', Validators.required],
      schedulingAttachment: ['', Validators.required],
      baseAttachment: ['', Validators.required],
      narrativeAttachment: ['', Validators.required],
      physicalStatusAttachment: ['', Validators.required],
      date: [null, Validators.required],
    });
  }

  editVendorForm(data: any) {
    this.addBoqForm.patchValue({
      projectId: this.projectId,
      type: data?.type,
      revision: data?.revision,
      date: data?.date?.slice(0, 10) || null,
    });

    this.cdr.detectChanges()
  }

  getLookups() {
    this.lookupService.getTimeScheduleTypes().subscribe(res => {
      this.types = res.data;
      this.cdr.detectChanges();
    });
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSchedulingAttachment(event: any) {
    this.selectedFile1 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile1, this.selectedFile1.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addBoqForm.patchValue({
        schedulingAttachment: this.selectedFile1.name
      });
    });
  }
  onBaseAttachment(event: any) {
    this.selectedFile2 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile2, this.selectedFile2.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addBoqForm.patchValue({
        baseAttachment: this.selectedFile1.name
      });
    });
  }
  onNarrativeAttachment(event: any) {
    this.selectedFile3 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile3, this.selectedFile3.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addBoqForm.patchValue({
        narrativeAttachment: this.selectedFile1.name
      });
    });
  }
  onPhysicalStatusAttachment(event: any) {
    this.selectedFile4 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile3, this.selectedFile3.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addBoqForm.patchValue({
        physicalStatusAttachment: this.selectedFile1.name
      });
    });
  }

  saveChanges() {
    if (!this.addBoqForm.valid) {
      this.addBoqForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    if (!this.floodId) {
      const payload = {
        ...this.addBoqForm.value,
        type: +this.addBoqForm.value.type,
        projectId: +this.projectId,
      }
      this.timeScheduleService.addFlood(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/flood-management/${this.projectId}`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'schedule Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });

    } else {
      const payload = {
        ...this.addBoqForm.value,
        type: +this.addBoqForm.value.type,
        id: this.floodId,
        projectId: +this.projectId,
      }
      this.timeScheduleService.updateFlood(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert({ icon: 'success', title: 'Success!', text: 'schedule Updated successfully!' });
          setTimeout(() => {
            this.router.navigateByUrl(`projects/flood-management/${this.projectId}`);
          }, 1000);
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
      });
    }
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

  back() {
    this._location.back();
  }
}
