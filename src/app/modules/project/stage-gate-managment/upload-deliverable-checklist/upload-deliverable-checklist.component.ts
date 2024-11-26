import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';

@Component({
  selector: 'app-upload-deliverable-checklist',
  templateUrl: './upload-deliverable-checklist.component.html',
  styleUrl: './upload-deliverable-checklist.component.scss'
})
export class UploadDeliverableChecklistComponent implements OnInit {

  isLoading: boolean = false;
  projectId: number;
  stageId: number;
  subPhaseId: number;
  deliverableQuestions: any[] = [];
  deliverableForm: FormGroup;
  fileData: { [key: number]: string[] } = {}; // Store uploaded file names
  requiredDeliverables: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private lookupService: LookupService,
    private stageGateManagementService: StageGateManagementService,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.initDeliverableForm();
    this.getStageId();
  }

  initDeliverableForm() {
    this.deliverableForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  get questionsFormArray() {
    return this.deliverableForm.get('questions') as FormArray;
  }

  addDeliverableQuestion(question: any) {
    const questionFormGroup = this.fb.group({
      id: [question.id],
      name: [question.initialDeliverableName],
      required: [{ value: 'yes', disabled: true }, Validators.required], // Yes or No radio
      fileName: [{ value: question.initialDeliverableName, disabled: true }], // Pre-filled with record name
      file: ['', Validators.required] // File input control (required)
    });

    this.questionsFormArray.push(questionFormGroup);
    this.cdr.detectChanges();
  }

  // Update onFileChange to handle file uploads
  onFileChange(event: any, index: number) {
    const files = event.target.files;

    if (files.length > 0) {
      this.fileData[index] = []; // Reset the fileData for this question

      for (const file of files) {
        const fd = new FormData();
        fd.append('Attachment', file, file.name);

        // Upload each file and store the names of successfully uploaded files
        this.attachmentService.uploadAttachment(fd).subscribe({
          next: (res) => {
            this.fileData[index].push(res.data); // Push file name to the array
            this.cdr.detectChanges();
          },
          error: () => {
            this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try uploading again' });
          }
        });
      }
    }
  }

  getStageId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      this.subPhaseId = params['subPhaseId'];
      this.getQuestions();
    });
  }

  getQuestions() {
    this.stageGateManagementService.getKickOffPrint(this.stageId, 3).subscribe(res => {
      const allDeliverables = res.data.deliverableChecklists;

      this.requiredDeliverables = allDeliverables.filter((deliverable: any) => deliverable.required === true);

      this.requiredDeliverables.forEach(question => {
        this.addDeliverableQuestion(question);
      });

      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (!this.deliverableForm.valid) {
      this.deliverableForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const attachments = this.questionsFormArray.controls.map((question, index) => {
      return {
        deliverableChecklistId: question.get('id')?.value,
        attachments: this.fileData[index] || [] // File names for this question
      };
    });

    const payload = {
      gateId: +this.stageId,
      attachments: attachments
    };

    this.stageGateManagementService.uploadDeliverableChecklist(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate([`projects/stage-gate-management/${this.projectId}`], {
          queryParams: { stageId: this.stageId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Deliverable Checklist Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
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
