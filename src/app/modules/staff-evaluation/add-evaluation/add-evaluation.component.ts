import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { StaffEvaluationService } from 'src/app/services/staff-evaluation.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-evaluation',
  templateUrl: './add-evaluation.component.html',
  styleUrl: './add-evaluation.component.scss'
})
export class AddEvaluationComponent implements OnInit {

  isLoading: boolean;
  questions: any[] = [];
  QuestionForm: FormGroup;
  userId: number;
  yearId: number;
  quarter: number;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private elRef: ElementRef,
    private _location: Location,
    private fb: FormBuilder,
    private staffEvaluationService: StaffEvaluationService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = +params['userId'];
      this.yearId = +params['yearId'];
      this.quarter = +params['quarter'];

    });
    this.QuestionForm = this.fb.group({
      questions: this.fb.array([])  // We'll add the questions dynamically
    });
    this.staffEvaluationService.getQuestion().subscribe(res => {
      this.questions = res.data
      this.addQuestions();
      this.cdr.detectChanges()
    });

  }

  // Get the FormArray containing the questions
  get questionsFormArray(): FormArray {
    return this.QuestionForm.get('questions') as FormArray;
  }

  // Add form controls for each question
  addQuestions(): void {
    this.questions.forEach((question) => {
      this.questionsFormArray.push(this.fb.group({
        reason: [''],  // Add a control for reason
        rate: [null, [Validators.required, Validators.min(0), Validators.max(5)]],  // Add a control for rate (0-5)
      }));
    });
  }

  // Submit handler
  onSubmit(): void {
    this.isLoading = true;
    if (!this.QuestionForm.valid) {
      this.isLoading = false;
      alert('please complete all evaluation scale');
      return
    } else {
      let payload: any = {};
      payload.userId = this.userId;
      payload.yearId = this.yearId;
      payload.quarter = this.quarter;
      payload.items = this.questionsFormArray.controls.map((control: any, index) => ({
        scale: +control.get('rate').value,
        justifications: control.get('reason').value,
        questionId: this.questions[index].id,
      }));

      this.staffEvaluationService.addEvaluation(payload).subscribe(res => {
        this.isLoading = false;
        this.router.navigateByUrl('staff-evaluation')
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Evaluation Added successfully!' });

      }, (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
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
