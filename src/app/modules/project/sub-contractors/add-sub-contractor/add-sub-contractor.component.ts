import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubContractorsService } from 'src/app/services/sub-contractors.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AreaDistrictService } from 'src/app/services/area-district.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-add-sub-contractor',
  templateUrl: './add-sub-contractor.component.html',
  styleUrl: './add-sub-contractor.component.scss'
})
export class AddSubContractorComponent implements OnInit {

  userDetails: any;
  userId: number;

  projectId: number;
  subId: number;
  subcontractorDetails: any;
  isLoading: boolean;
  addSubContractorForm: FormGroup;
  areas: any;
  subContractors: any[] = [];
  Districts: any[] = [];

  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;


  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('approveModal')
  approveModal: TemplateRef<any>;
  approveModelData: any = { accepted: true, note: '', subContractId: 0, approval: 1 };

  @ViewChild('stackHolderModal')
  stackHolderModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  stackholderModelData: any = { name: '', nameAr: '' };


  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private subContractorsService: SubContractorsService,
    private lookupService: LookupService,
    private attachmentService: AttachmentService,
    private areaDistrictService: AreaDistrictService,
  ) {
  }

  ngOnInit() {
    this.getProjectId();
    this.initializeCompanyForm();
    this.getLookups();

    this.addSubContractorForm.get('districtId')?.valueChanges.subscribe((id: number) => {
      if (id) {
        this.areaDistrictService.getAreaById(id).subscribe(res => {
          this.areas = res.data;
          this.cdr.detectChanges();
        });
      }
    });
    this.addSubContractorForm.get('value')?.valueChanges.subscribe((amount: number) => {
      if (amount > 10) {
        this.addSubContractorForm.patchValue({
          percentage: amount / 10000000
        })
      } else if (!amount) {
        this.addSubContractorForm.patchValue({
          percentage: 0
        })
      }
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.subId = +params['subcontractorId'];
      this.approveModelData.subContractId = this.subId;
      // this.approveModelData.userId = this.subId;
      if (this.subId) {
        this.getSubInfo()
      }
    });

    this.authService.currentUser$.subscribe((res: any) => {
      this.userDetails = res;
      this.userId = +res.id;
      this.approveModelData.userId = this.userId;
    });
  }

  getSubInfo() {
    this.subContractorsService.getById(this.subId).subscribe(res => {
      setTimeout(() => {
        this.editCompanyForm(res.data);
      }, 500);
    });
  }

  initializeCompanyForm() {
    this.addSubContractorForm = this.formBuilder.group({
      subContractorId: [{ value: null, disabled: this.subId }, Validators.required],
      startDate: [{ value: '', disabled: this.subId }, Validators.required],
      finishDate: [{ value: '', disabled: this.subId }, Validators.required],
      value: [{ value: 0, disabled: this.subId }, Validators.required],
      percentage: [{ value: '', disabled: this.subId }, Validators.required],
      scope: [{ value: '', disabled: this.subId }, Validators.required],
      letter: [{ value: 'test.jpeg', disabled: this.subId }, Validators.required],
      attachment2: [{ value: 'test.jpeg', disabled: this.subId }, Validators.required],
      attachment3: [{ value: 'test.jpeg', disabled: this.subId }, Validators.required],
      isSoudi: [{ value: true, disabled: this.subId }, Validators.required],
      reason: [{ value: '', disabled: this.subId }],

      representiveName: [{ value: '', disabled: this.subId }, Validators.required],
      representiveEmail: [{ value: '', disabled: this.subId }, Validators.required],
      representivePhone: [{ value: '', disabled: this.subId }, Validators.required],
    });
  }
  editCompanyForm(data: any) {
    this.subcontractorDetails = data;
    this.addSubContractorForm.patchValue({
      subContractorId: data?.subContractorId,
      startDate: data?.startDate?.slice(0, 10),
      finishDate: data?.finishDate?.slice(0, 10),
      value: data?.value,
      districtId: data?.districtId,
      scope: data?.scope,
      letter: data?.letter,
      attachment2: data?.attachment2,
      attachment3: data?.attachment3,
      isSoudi: data?.isSoudi,

      representiveName: data?.representiveName,
      representiveEmail: data?.representiveEmail,
      representivePhone: data?.representivePhone,
    });
    this.cdr.detectChanges();
  }

  getLookups() {
    this.lookupService.getSubContractors().subscribe(res => {
      this.subContractors = res.data;
      this.cdr.detectChanges();
    });
    this.areaDistrictService.getDistricts().subscribe(res => {
      this.Districts = res.data;
      this.cdr.detectChanges();
    });
  }

  onAttachment1(event: any) {
    this.selectedFile1 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('letter', this.selectedFile1, this.selectedFile1.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addSubContractorForm.patchValue({
        letter: this.selectedFile1.name
      });
    });
  }
  onAttachment2(event: any) {
    this.selectedFile2 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('attachment2', this.selectedFile2, this.selectedFile2.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addSubContractorForm.patchValue({
        attachment2: this.selectedFile1.name
      });
    });
  }
  onAttachment3(event: any) {
    this.selectedFile3 = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('attachment3', this.selectedFile3, this.selectedFile3.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.addSubContractorForm.patchValue({
        attachment3: this.selectedFile1.name
      });
    });
  }

  onSubmit() {

    if(this.approveModelData.accepted) {
      this.approveModelData.approval = this.subcontractorDetails.subContractApprovals.length === 0 ? 1 : this.approveModelData.approval + 1;
    } else {
      this.approveModelData.approval = 3;
    }
    delete this.approveModelData['accepted'];

    this.subContractorsService.approve(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Sub-Contractor approved successfully!' });
      this.modalService.dismissAll();
      this.approveModelData = { accepted: true, note: '', subContractId: this.subId, approval: 1 };
      this.getSubInfo();
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });

  }

  submitNewSubContractor() {
    console.log(this.stackholderModelData);
    this.subContractorsService.createSubContractor(this.stackholderModelData).subscribe(res => {
      console.log(res);
      this.getLookups();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Added successfully!' });
      this.modalService.dismissAll();
      this.stackholderModelData = { name: '', nameAr: '' };
    }, () => {
      this.modalService.dismissAll();
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
  }

  approveSCurve(subContractApprovals: any[]) {
    if ((!subContractApprovals || subContractApprovals.length === 0 || subContractApprovals.length === 1)) {
      this.modalService.open(this.approveModal, this.modalConfig);
    }
  }

  saveSettings() {
    if (this.addSubContractorForm.value.isSoudi) {
      delete this.addSubContractorForm.value['reason']
    }
    const payload =
    {
      ...this.addSubContractorForm.value,
      projectId: this.projectId,
      subContractorId: +this.addSubContractorForm.value.subContractorId
    }
    this.subContractorsService.addContractor(payload).subscribe(res => {
      this.router.navigateByUrl(`projects/sub-contractors/${this.projectId}`)
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Sub-Contractor Added successfully!' });
    })
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 500);

  }

  addStackholderModal() {
    this.modalService.open(this.stackHolderModal, this.modalConfig);
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
