import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.scss']
})
export class FinalReviewComponent implements OnInit {

  isLoading: boolean = false;
  projectId: number;
  stageId: number;
  subPhaseId: number;
  noteForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private router: Router,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private stageGateManagementService: StageGateManagementService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getStageId();
  }

  initForm() {
    this.noteForm = this.fb.group({
      noteStatues: [null, Validators.required], // Radio button for note status
      notes: this.fb.array([this.createNoteGroup()]) // Initialize with one note
    });
  }

  getStageId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      this.subPhaseId = +params['subPhaseId'];

    });
  }

  createNoteGroup(): FormGroup {
    return this.fb.group({
      createdOn: ['', Validators.required], // Set default to current date
      note: ['', Validators.required]
    });
  }

  get notesArray(): FormArray {
    return this.noteForm.get('notes') as FormArray;
  }

  addNote() {
    this.notesArray.push(this.createNoteGroup());
  }

  removeNote(index: number) {
    if (this.notesArray.length > 1) {
      this.notesArray.removeAt(index);
    }
  }

  onSubmit() {
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      alert('Please fill in all required and make a selection');
      return;
    }

    this.isLoading = true;
    const payload = {
      noteStatues: +this.noteForm.get('noteStatues')?.value,
      gateId: this.stageId,
      notes: this.notesArray.value
    };

    this.stageGateManagementService.postFinalReview(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate([`projects/stage-gate-management/${this.projectId}`], {
          queryParams: { stageId: this.stageId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Final Review Added successfully!' });
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
