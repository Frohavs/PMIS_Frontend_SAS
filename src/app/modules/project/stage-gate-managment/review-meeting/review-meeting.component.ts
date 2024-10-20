import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-review-meeting',
  templateUrl: './review-meeting.component.html',
  styleUrls: ['./review-meeting.component.scss']
})
export class ReviewMeetingComponent implements OnInit {

  isLoading: boolean = false;
  projectId: number;
  stageId: number;
  subPhaseId: number;
  reviewForm: FormGroup;
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
    this.initReviewForm();
    this.getQuestions();
    this.getStageId();
  }

  initReviewForm() {
    this.reviewForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  getStageId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      this.subPhaseId = +params['subPhaseId'];
      this.getQuestions();
    });
  }

  get questionsFormArray() {
    return this.reviewForm.get('questions') as FormArray;
  }

  addDeliverableQuestion(question: any) {
    const questionFormGroup = this.fb.group({
      id: [question.id],
      name: [question.initialDeliverableName], // Get the name
      completed: [question.required], // To maintain required info
      decision: ['', Validators.required], // Yes or No
      date: ['', Validators.required], // Date input
      comments: ['', question.required === false ? Validators.required : null] // Comments required only if "No" selected
    });

    this.questionsFormArray.push(questionFormGroup);
  }

  getQuestions() {
    this.stageGateManagementService.getKickOffPrint(this.stageId,3).subscribe(res => {
      const allDeliverables = res.data.deliverableChecklists;

      this.requiredDeliverables = allDeliverables.filter((deliverable: any) => deliverable.required === true);

      this.requiredDeliverables.forEach(question => {
        this.addDeliverableQuestion(question);
      });

      this.cdr.detectChanges();
    });
  }

  onRadioChange(index: number, value: string) {
    const question = this.questionsFormArray.at(index);
    const commentsControl = question.get('comments');

    if (value === 'no') {
      commentsControl?.setValidators(Validators.required);
    } else {
      commentsControl?.clearValidators();
    }
    commentsControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.reviewForm.valid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const payload = {
      gateId: +this.stageId,
      answers: this.questionsFormArray.controls.map((question) => ({
        completed: question.get('decision')?.value === 'yes', // 'required' is based on the decision ("Yes" or "No")
        comments: question.get('comments')?.value,
        deliverableChecklistId: question.get('id')?.value,
        reviewMeetingDate: question.get('date')?.value,
      }))
    };

    this.stageGateManagementService.createReviewMeeting(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate([`projects/stage-gate-management/${this.projectId}`], {
          queryParams: { stageId: this.stageId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Review Added successfully!' });
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
