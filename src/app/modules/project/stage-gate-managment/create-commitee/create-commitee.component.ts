import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StageGateManagementService } from 'src/app/services/stage-gate-management.service';
import { Location } from '@angular/common';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-create-commitee',
  templateUrl: './create-commitee.component.html',
  styleUrl: './create-commitee.component.scss'
})
export class CreateCommitteeComponent implements OnInit {

  projectId: number;
  stageId: number;
  isLoading: boolean;
  addCommitteeForm: FormGroup;
  users: any[] = [];
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 8,
    allowSearchFilter: true,
  };

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };


  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private stageGateManagementService: StageGateManagementService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initAddCommitteeForm();
    this.getStageId();
    this.getLookups();
  }

  getStageId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.stageId = params['stageId'];
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.stageId = +queryParams?.stageId;
  }

  initAddCommitteeForm() {
    this.addCommitteeForm = this.formBuilder.group({
      coordinatorId: [null, Validators.required],
      committeeMembers: [null, Validators.required],
    });
  }

  getLookups() {
    this.lookupService.allUsers().subscribe(res => {
      this.users = res.data;
      this.cdr.detectChanges();
    });
  }

  onItemSelect(item: any) {
  }
  onItemDeselect(item: any) {
  }
  onSelectAll(items: any) {
  }

  getSelectedIds(items: any) {
    return items.map((item: any) => +item.id);
  }
  saveChanges() {
    if (!this.addCommitteeForm.valid) {
      this.addCommitteeForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      id: +this.stageId,
      ...this.addCommitteeForm.value,
      coordinatorId: +this.addCommitteeForm.value.coordinatorId,
      committeeMembers: this.getSelectedIds(this.addCommitteeForm.value?.committeeMembers),
    }

    this.stageGateManagementService.createCommitte(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate([`projects/stage-gate-management/${this.projectId}`], {
          queryParams: { stageId: this.stageId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Committee Added successfully!' });
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
