import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { HseService } from 'src/app/services/hse.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { StumbledProjectsService } from 'src/app/services/stumbled-projects.service';


@Component({
  selector: 'app-add-stumbled-project',
  templateUrl: './add-stumbled-project.component.html',
  styleUrl: './add-stumbled-project.component.scss'
})
export class AddStumbledProjectComponent implements OnInit {
  projectId: number;
  isLoading: boolean;
  addStumbledForm: FormGroup;

  stumbledImpactLevels: any[] = [];
  stumbledImpactTypes: any[] = [];
  stumbledReasonTypes: any[] = [];
  stumbledResponsibilities: any[] = [];
  stumbledStatuses: any[] = [];

  units: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  crNumber: string;
  crNameEn: string;
  crNameAr: string;
  crAttachment: string;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private stumbledProjectsService: StumbledProjectsService,
    private attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getBoqId();
    this.getLookups();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.stumbledProjectsService.getAllCreated(this.projectId).subscribe(res => {
          // Ensure the response exists and contains items
          const items = res?.data?.items || [];

          // Filter items where status !== 3
          const filteredItems = items.filter((item: any) => item.status !== 3);

          // Clear the existing FormArray
          this.stumbledItems.clear();

          filteredItems.forEach((item: any) => {
            this.stumbledItems.push(
              this.formBuilder.group({
                reasons: [item.reasons, Validators.required],
                reasonTypeId: [item.reasonTypeId, Validators.required],
                actionRequired: [item.actionRequired, Validators.required],
                responsibilityId: [item.responsibilityId, Validators.required],
                pmoRecommendation: [item.pmoRecommendation, Validators.required],
                status: [item.status, Validators.required],
                impactTypeId: [item.impactTypeId, Validators.required],
                impactLevelId: [item.impactLevelId, Validators.required],
                dueDate: [item.dueDate.slice(0, 10), Validators.required],
                attachment: [item.attachment, Validators.required],
              })
            );
          });
          this.cdr.detectChanges();
          console.log('Form array patched successfully', this.addStumbledForm.value);

        });
      }
    });
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.stumbledId = +params['stumbledId'];
    //   if (this.stumbledId) {
    //   }
    // });
  }

  initAddBoqForm() {
    this.addStumbledForm = this.formBuilder.group({
      stumbledItems: this.formBuilder.array([]), // Define FormArray
    });

    // Initialize with one item by default
    this.addStumbledItem();
  }

  // Get FormArray
  get stumbledItems(): FormArray {
    return this.addStumbledForm.get('stumbledItems') as FormArray;
  }

  // Create a single form group structure
  createStumbledItem(): FormGroup {
    return this.formBuilder.group({
      reasons: ['', Validators.required],
      reasonTypeId: ['', Validators.required],
      actionRequired: ['', Validators.required],
      responsibilityId: ['', Validators.required],
      pmoRecommendation: ['', Validators.required],
      status: ['', Validators.required],
      impactTypeId: ['', Validators.required],
      impactLevelId: ['', Validators.required],
      dueDate: ['', Validators.required],
      attachment: ['', Validators.required],
    });
  }

  // Add a new item to the FormArray
  addStumbledItem() {
    this.stumbledItems.push(this.createStumbledItem());
  }

  // Remove an item from the FormArray
  removeStumbledItem(index: number) {
    this.stumbledItems.removeAt(index);
  }

  getLookups() {
    this.lookupService.getStumbledImpactLevels().subscribe(res => {
      this.stumbledImpactLevels = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getStumbledImpactTypes().subscribe(res => {
      this.stumbledImpactTypes = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getStumbledReasonTypes().subscribe(res => {
      this.stumbledReasonTypes = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getStumbledResponsibilities().subscribe(res => {
      this.stumbledResponsibilities = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getStumbledStatuses().subscribe(res => {
      this.stumbledStatuses = res.data;
      this.cdr.detectChanges();
    });

  }

  saveChanges() {
    // Map the form array to the payload structure
    const procedures = this.stumbledItems.controls.map((item) => ({
      reasons: item.get('reasons')?.value,
      actionRequired: item.get('actionRequired')?.value,
      pmoRecommendation: item.get('pmoRecommendation')?.value,
      status: Number(item.get('status')?.value), // Ensure it's a number
      dueDate: item.get('dueDate')?.value,
      attachment: item.get('attachment')?.value, // You may need to handle file uploads separately
      reasonTypeId: Number(item.get('reasonTypeId')?.value), // Ensure it's a number
      impactTypeId: Number(item.get('impactTypeId')?.value), // Ensure it's a number
      impactLevelId: Number(item.get('impactLevelId')?.value), // Ensure it's a number
      responsibilityId: Number(item.get('responsibilityId')?.value), // Ensure it's a number
    }));

    // Construct the payload
    const payload = {
      procedures,
      projectId: this.projectId, // Assume `projectId` is fetched or defined elsewhere
    };

    console.log('Payload to be sent:', payload);
    if (!this.addStumbledForm.valid) {
      this.addStumbledForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    this.stumbledProjectsService.createStumbledProject(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate([`stumbled-projects/details/${this.projectId}`]);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Stumbled Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({
          icon: 'error', title: 'Error!', text: error?.error?.responseException?.exceptionMessage?.errors['']
        });
        this.isLoading = false;
      }
    });

  }

  onFileChange(event: any, index: number) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      for (const element of files) {
        const fd = new FormData();
        fd.append('Attachment', element, element.name);
        this.attachmentService.uploadAttachment(fd).subscribe(res => {
          this.stumbledItems.at(index).get('attachment')?.setValue(res.data);
          this.cdr.detectChanges();
        }, (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try Upload again' });
        });
      }
    }

  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
