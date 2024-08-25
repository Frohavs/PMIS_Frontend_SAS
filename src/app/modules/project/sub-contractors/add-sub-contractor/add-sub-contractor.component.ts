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

@Component({
  selector: 'app-add-sub-contractor',
  templateUrl: './add-sub-contractor.component.html',
  styleUrl: './add-sub-contractor.component.scss'
})
export class AddSubContractorComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  addSubContractorForm: FormGroup;
  areas: any;
  stackHolders: any[] = [];
  Districts: any[] = [];

  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;


  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

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
    })
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];

      if (this.projectId) {
        // this.companyService.getByID(this.projectId).subscribe(res => {
        //   setTimeout(() => {
        //     this.editCompanyForm(res.data);
        //     this.getSelectedVendors(res.data?.vendorIds);
        //   }, 500);
        // });
      }
    });
  }

  initializeCompanyForm() {
    this.addSubContractorForm = this.formBuilder.group({
      subContractorId: [null, Validators.required],
      startDate: ['', Validators.required],
      finishDate: ['', Validators.required],
      value: [0, Validators.required],
      percentage: [{ value: '', disabled: true }, Validators.required],
      scope: ['', Validators.required],
      letter: ['test.jpeg', Validators.required],
      attachment2: ['test.jpeg', Validators.required],
      attachment3: ['test.jpeg', Validators.required],
      isSoudi: [true, Validators.required],
      reason: [''],

      representiveName: ['', Validators.required],
      representiveEmail: ['', Validators.required],
      representivePhone: ['', Validators.required],
    });
  }
  editCompanyForm(data: any) {
    this.addSubContractorForm.patchValue({
      subContractorId: data?.subContractorId,
      startDate: data?.startDate,
      finishDate: data?.finishDate,
      value: data?.value,
      districtId: data?.districtId,
      scope: data?.scope,
    });
  }

  getLookups() {
    this.lookupService.getStackHolders().subscribe(res => {
      this.stackHolders = res.data;
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
    debugger
    this.subContractorsService.addContractor(payload).subscribe(res => {
      this.router.navigateByUrl(`projects/project-letter/${this.projectId}`)
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Added successfully!' });
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
