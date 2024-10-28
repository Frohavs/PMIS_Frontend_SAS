import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/modules/auth';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-commit-acknowledgement',
  templateUrl: './commit-acknowledgement.component.html',
  styleUrls: ['./commit-acknowledgement.component.scss']
})
export class CommitAcknowledgementComponent implements OnInit {

  commitForm: FormGroup;
  userId: number;
  projectId: number;
  stageId: number;
  isLoading: boolean;
  approveUsers: any[] = []
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  committeeMembers: any[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private stageGateManagementService: StageGateManagementService,
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getStageId();
    this.authService.currentUser$.subscribe((res: any) => {
      this.userId = +res.id; // Set the userId
    });
    this.stageGateManagementService.getByID(this.stageId).subscribe(res => {

      this.committeeMembers.push({ id: res.data.coordinatorId, name: res.data.coordinator });
      this.stageGateManagementService.getCommitteeMembersByGateId(this.stageId).subscribe(res => {
        for (const element of res.data) {
          this.committeeMembers.push(element);
        }
        this.initForm();  // Initialize the form after getting the committee members
        this.cdr.detectChanges();
      });
    });
  }

  getStageId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = +params['stageId'];
      this.stageGateManagementService.getCommitAcknowledgementCommittees(this.stageId).subscribe(res => {
        this.approveUsers = res.data;
        this.cdr.detectChanges();
      });
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.stageId = +queryParams?.stageId;

  }

  initForm() {
    this.commitForm = this.fb.group({
      committeeApprovals: this.fb.array(this.committeeMembers.map(member => this.createMemberGroup(member)))
    });

    // Disable fields where userId doesn't match the committee member id
    this.disableNonMatchingMembers();
  }

  createMemberGroup(member: { id: number, name: string }): FormGroup {
    return this.fb.group({
      id: [member.id],
      name: [member.name],
      approvalStatus: [null, Validators.required] // Radio button to select 'approved' or 'denied'
    });
  }

  disableNonMatchingMembers() {
    this.committeeApprovals.controls.forEach(control => {
      const memberId = control.get('id')?.value;
      if (memberId !== this.userId) {
        control.get('approvalStatus')?.disable(); // Disable if the member is not the logged-in user
      }
    });
  }

  get committeeApprovals(): FormArray {
    return this.commitForm.get('committeeApprovals') as FormArray;
  }

  onSubmit() {
    if (this.commitForm.invalid) {
      this.commitForm.markAllAsTouched();
      return;
    }
    // const formData = this.commitForm.value;
    // console.log('Form Data:', formData);

    this.stageGateManagementService.createCommitAcknowledgement(this.stageId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate([`projects/stage-gate-management/${this.projectId}`], {
          queryParams: { stageId: this.stageId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Acknowledgement successfully!' });
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
