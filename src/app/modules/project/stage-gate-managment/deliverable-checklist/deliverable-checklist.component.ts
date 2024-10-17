import { CommitteeManager } from './../../initial-delivery-list/add-delivery-list/add-modal';
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
  selector: 'app-deliverable-checklist',
  templateUrl: './deliverable-checklist.component.html',
  styleUrl: './deliverable-checklist.component.scss'
})
export class DeliverableChecklistComponent implements OnInit {

  activeTab: number = 0;
  projectId: number;
  stageId: number;
  subPhaseId: number;
  isLoading: boolean = false;
  hideSubmit: boolean = false;
  committeeId: number;
  committeeMembers: any[] = [];
  deliverableQuestions: any[] = [];
  deliverableForm: FormGroup;
  currentAnswersArray: any[] = [];

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
      this.stageId = params['stageId'];
      this.subPhaseId = params['subPhaseId'];
      this.getQuestions();
      this.getCommitteesMembers();
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

  getCommitteesMembers() {
    this.stageGateManagementService.getCommitteeMembersByGateId(this.stageId).subscribe(res => {
      this.committeeMembers = res.data;
      this.committeeId = this.committeeMembers[0].id;
      this.checkForAnswers();
      this.cdr.detectChanges();
    })
  }

  checkForAnswers() {
    this.stageGateManagementService.getDeliverableAnswers(this.stageId, 2).subscribe(res => {
      this.currentAnswersArray = [];
      for (const answer of res.data?.answers) {
        if (answer.committeeMemberId === this.committeeId)
          this.currentAnswersArray.push(answer);
      }
      if (this.currentAnswersArray.length > 0) {
        this.hideSubmit = true;
        this.patchFormValues(this.currentAnswersArray);
      } else {
        this.hideSubmit = false;
        this.currentAnswersArray = [];
        this.resetFormToInitialState();
      }
      console.log('currentAnswersArray', this.currentAnswersArray);
      this.patchFormValues(this.currentAnswersArray);
    });
  }

  patchFormValues(currentAnswersArray: any[]) {
    const questionsFormArray = this.questionsFormArray; // Reference to the form array
    currentAnswersArray.forEach((answer, index) => {
      const formGroup = questionsFormArray.at(index) as FormGroup;
      const originalQuestion = this.deliverableQuestions[index];

      formGroup.patchValue({
        id: originalQuestion.id,
        name: answer.initialDeliverableName,
        required: answer.required ? 'yes' : 'no',
        comments: answer.comments
      });

      this.cdr.detectChanges();
    });
  }

  resetFormToInitialState() {
    const questionsFormArray = this.questionsFormArray;

    questionsFormArray.controls.forEach((control, index) => {
      const id = control.get('id')?.value;
      const name = control.get('name')?.value;
      const originalQuestion = this.deliverableQuestions[index];
      control.reset({
        id: originalQuestion.id,
        name: originalQuestion.name,
        required: '',
        comments: ''
      });
    });

    this.cdr.detectChanges();
  }

  setActiveTab(index: number, committeeId: number) {
    this.committeeId = committeeId;
    this.activeTab = index;
    this.checkForAnswers();
  }

  onSubmit() {
    if (!this.deliverableForm.valid) {
      this.deliverableForm.markAllAsTouched();
      alert('Please select all required fields in the form and comment if no');
      return;
    }
    const answers = this.questionsFormArray.controls.map(question => {
      return {
        required: question.get('required')?.value === 'yes',
        comments: question.get('comments')?.value || '',
        initialDeliverableId: question.get('id')?.value,
        committeeMemberId: this.committeeId
      };
    });

    const payload = {
      "gateId": this.stageId,
      "answers": answers
    }
    debugger
    this.stageGateManagementService.createDeliverableChecklist(payload).subscribe({
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
