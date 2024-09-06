import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AreaDistrictService } from 'src/app/services/area-district.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectLettersService } from 'src/app/services/project-letters.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-letter',

  templateUrl: './add-letter.component.html',
  styleUrl: './add-letter.component.scss'
})
export class AddLetterComponent implements OnInit {

  projectId: number;
  letterId: number;
  letterDetails: any;
  isLoading: boolean;
  addLetterForm: FormGroup;
  areas: any;
  stackHolders: any[] = [];
  Districts: any[] = [];
  inspectionUsers: any[] = [];

  noteText: string;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('inspectorModal')
  inspectorModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  inspectorModelData: any = { id: '', inspectorId: '' };

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private lettersService: ProjectLettersService,
    private lookupService: LookupService,
    private areaDistrictService: AreaDistrictService,
  ) {
  }

  ngOnInit() {
    this.getProjectId();
    this.initializeCompanyForm();
    this.getLookups();

    this.addLetterForm.get('districtId')?.valueChanges.subscribe((id: number) => {
      if (id) {
        this.areaDistrictService.getAreaById(id).subscribe(res => {
          this.areas = res.data;
          this.cdr.detectChanges();
        });
      }
    })
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.letterId = +params['letterId'];
      if (this.letterId) {
        this.inspectorModelData.id = this.letterId;
        this.getDetailsInfo();
      }
    });
  }


  getDetailsInfo() {
    this.lettersService.getById(this.letterId).subscribe(res => {
      this.letterDetails = res.data;

      this.editCompanyForm(res?.data);
      this.cdr.detectChanges()
    });
  }

  initializeCompanyForm() {
    this.addLetterForm = this.formBuilder.group({
      requestDate: [{ value: '', disabled: this.letterId }, Validators.required],
      subject: [{ value: '', disabled: this.letterId }, Validators.required],
      street: [{ value: '', disabled: this.letterId }, Validators.required],
      stakeHolderId: [{ value: null, disabled: this.letterId }, Validators.required],
      districtId: [{ value: null, disabled: this.letterId }, Validators.required],
    });
  }
  editCompanyForm(data: any) {
    this.addLetterForm.patchValue({
      requestDate: data?.requestDate?.slice(0, 10),
      stakeHolderId: data?.stakeHolderId,
      subject: data?.subject,
      districtId: data?.districtId,
      street: data?.street,
    });
  }

  getLookups() {
    this.lookupService.getStackHolders().subscribe(res => {
      this.stackHolders = res.data;
      this.cdr.detectChanges();
    });

    this.lookupService.allUsers().subscribe(res => {
      this.inspectionUsers = res.data;
      this.cdr.detectChanges()
    });

    this.areaDistrictService.getDistricts().subscribe(res => {
      this.Districts = res.data;
      this.cdr.detectChanges();
    });
  }

  saveSettings() {
    const payload =
    {
      ...this.addLetterForm.value, projectId: this.projectId,
      stakeHolderId: +this.addLetterForm.value.stakeHolderId,
      districtId: +this.addLetterForm.value.districtId,
    }

    this.lettersService.addLetter(payload).subscribe(res => {
      this.router.navigateByUrl(`projects/project-letter/${this.projectId}`)
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Added successfully!' });
    })
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 500);

  }

  addNewNote() {
    if (!this.noteText) {
      return;
    }
    this.lettersService.addNote({ letterId: this.letterId, note: this.noteText }).subscribe(res => {
      this.noteText = '';
      this.getDetailsInfo();
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  approveLetter() {
    this.lettersService.approveLetter(this.letterId).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Approved successfully!' });
      this.router.navigateByUrl(`projects/project-letter/${this.projectId}`)
    });
  }

  addInspectorModal() {
    this.modalService.open(this.inspectorModal, this.modalConfig);
  }

  submitNewInspector() {


    this.lettersService.update({ ...this.inspectorModelData, inspectorId: +this.inspectorModelData.inspectorId }).subscribe(res => {

      this.getLookups();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Added successfully!' });
      this.modalService.dismissAll();
      this.inspectorModelData = { id: this.letterId, inspectorId: '' };
      this.getDetailsInfo();
    }, () => {
      this.modalService.dismissAll();
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
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
