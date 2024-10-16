import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { Location } from '@angular/common';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-kickoff-meeting',
  templateUrl: './kickoff-meeting.component.html',
  styleUrl: './kickoff-meeting.component.scss'
})
export class KickoffMeetingComponent implements OnInit {

  projectId: number;
  stageId: number;
  subPhaseId: number;
  coordinatorId: number;
  isLoading: boolean = false;
  deliverableQuestions: any[] = [];
  kickoffForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };


  constructor(
    private router: Router,
    private _location: Location,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.initKickOffForm();
    this.getStageId();
  }

  initKickOffForm() {
    this.kickoffForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  get questionsFormArray() {
    return this.kickoffForm.get('questions') as FormArray;
  }

  addDeliverableQuestion(question: any) {
    const questionFormGroup = this.fb.group({
      id: [question.id],
      name: [question.name],
      required: ['', Validators.required], // Yes or No radio (required)
      comments: [''] // Comment field
    });

    // Add a value change listener for the 'required' field
    questionFormGroup.get('required')?.valueChanges.subscribe(value => {
      const commentsControl = questionFormGroup.get('comments');

      if (value === 'no') {
        commentsControl?.setValidators([Validators.required]); // Make comments required
      } else {
        commentsControl?.clearValidators(); // Remove the required validator
      }
      commentsControl?.updateValueAndValidity(); // Update the validation status
    });

    this.questionsFormArray.push(questionFormGroup);
  }


  getStageId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      this.subPhaseId = +params['subPhaseId'];
      this.coordinatorId = +params['coordinatorId'];

      this.getQuestions();
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.stageId = +queryParams?.stageId;
  }

  getQuestions() {
    this.lookupService.getInitialDeliverables(this.subPhaseId).subscribe(res => {
      this.deliverableQuestions = res.data;
      // Add deliverable questions to the form
      this.deliverableQuestions.forEach(question => {
        this.addDeliverableQuestion(question);
      });

      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (!this.kickoffForm.valid) {
      this.kickoffForm.markAllAsTouched();
      alert('Please select all required fields in the form and comment if no');
      return;
    }
    const answers = this.questionsFormArray.controls.map(question => {
      return {
        required: question.get('required')?.value === 'yes',
        comments: question.get('comments')?.value || '',
        initialDeliverableId: question.get('id')?.value,
        committeeMemberId: this.coordinatorId
      };
    });

    const payload = {
      "gateId": +this.stageId,
      "answers": answers
    }

    this.stageGateManagementService.postKickoffSubmitMeeting(payload).subscribe({
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

  back() {
    this._location.back();
  }
}
