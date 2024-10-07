import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InitialDeliveryService } from 'src/app/services/initial-delivery.service';
import { ProjectDeliverListDetails } from './add-modal';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-add-delivery-list',
  templateUrl: './add-delivery-list.component.html',
  styleUrl: './add-delivery-list.component.scss'
})
export class AddDeliveryListComponent implements OnInit {

  deliveryForm: FormGroup;
  projectId!: any;
  listId!: any;
  projectDeliveryDetails: ProjectDeliverListDetails = {
    id: null,
    brief: "",
    status: 2,
    noticeDate: null,  // Set to current date/time
    referenceNumber: null,
    deliveryDate: null,  // Set to current date/time
    registeredDecisionNumber: null,
    registeredDecisionDate: null,  // Set to current date/time
    achievementDate: null,  // Set to current date/time
    attachment: "",
    fixingDuration: null,
    deliveryDuration: null,
    imagePlan: null,
    imagePlanCopies: null,
    contractorSignature: null,
    consultantSignature: null,
    projectId: null,
    mangerId: null,
    approved: false,
    committeeMangers: [
      // {
      //   id: 0,
      //   name: "kmadkour",
      //   email: "karim.madkour.da@gmail.com",
      //   position: "Manager"
      // },
      // {
      //   id: 0,
      //   name: "motawea",
      //   email: "karim.madkour.da@gmail.com",
      //   position: "Manager"
      // }
    ]
  };
  managers: any[] = [];
  selectedFile: any;
  @ViewChild('attachmentInput') attachmentInput: ElementRef;

  projectDetails: any;
  @ViewChild('managerModal') managerModal: TemplateRef<any>;
  @ViewChild('committeeModal') committeeModal: TemplateRef<any>;
  @ViewChild('briefModal') briefModal: TemplateRef<any>;
  @ViewChild('noticeModal') noticeModal: TemplateRef<any>;
  @ViewChild('refNumberModal') refNumberModal: TemplateRef<any>;
  @ViewChild('deliveryDateModal') deliveryDateModal: TemplateRef<any>;
  @ViewChild('registeredDecisionNumberModal') registeredDecisionNumberModal: TemplateRef<any>;
  @ViewChild('registeredDecisionDateModal') registeredDecisionDateModal: TemplateRef<any>;
  @ViewChild('achieveDateModal') achieveDateModal: TemplateRef<any>;
  @ViewChild('fixingDurationModal') fixingDurationModal: TemplateRef<any>;
  @ViewChild('deliveryDurationModal') deliveryDurationModal: TemplateRef<any>;
  @ViewChild('imagePlanModal') imagePlanModal: TemplateRef<any>;
  @ViewChild('imagePlanCopiesModal') imagePlanCopiesModal: TemplateRef<any>;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  showSignaturePad: boolean = false;
  activeSignContractor = false;
  signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 250,
    canvasHeight: 150,
    backgroundColor: 'rgba(0,0,0,0)',  // Ensures transparent background
    penColor: 'black'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private lookupService: LookupService,
    private modalService: NgbModal,
    private attachmentService: AttachmentService,
    private projectsService: ProjectsService,
    private initialDeliveryService: InitialDeliveryService,

  ) { }

  ngOnInit(): void {
    this.initDeliverForm();
    this.getProjectId();
    this.getLookups()
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.projectDeliveryDetails.projectId = this.projectId;
      this.getProjectDetails();
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.listId = +params['listId'];
      if (this.listId) {
        this.projectDeliveryDetails.id = this.listId;
        this.initialDeliveryService.getDeliveryList(this.listId).subscribe(res => {
          this.editDeliverForm(res.data);
        });
      }
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      this.cdr.detectChanges();
    });
  }

  getLookups() {
    this.lookupService.getManagerUsers().subscribe(res => {
      this.managers = res.data;
      this.cdr.detectChanges()
    });
  }
  initDeliverForm() {
    this.deliveryForm = this.fb.group({
      status: ['1', [Validators.required]],
      brief: ['', Validators.required],
      noticeDate: ['', Validators.required],
      referenceNumber: [0, Validators.required],
      deliveryDate: [null, Validators.required],
      registeredDecisionNumber: [0, Validators.required],
      registeredDecisionDate: ['', Validators.required],
      mangerId: [null, Validators.required],
      achievementDate: ['', Validators.required],
      attachment: ['', Validators.required],
      fixingDuration: [0, Validators.required],
      deliveryDuration: [0, Validators.required],
      imagePlanCopies: [0, Validators.required],
      contractorSignature: ['', Validators.required],
      consultantSignature: ['', Validators.required],
      imagePlan: [0, Validators.required],
      committeeId: [0, Validators.required],
      committeeName: ['', Validators.required],
      committeeEmail: ['', Validators.required],
      committeePosition: ['', Validators.required],
    });
  }
  editDeliverForm(res: any) {
    this.deliveryForm.patchValue({
      status: res.status?.toString(),
      brief: res.brief,
      registeredDecisionDate: res.registeredDecisionDate?.slice(0, 10) || '',
      registeredDecisionNumber: res.registeredDecisionNumber,
      deliveryDate: res.deliveryDate?.slice(0, 10) || '',
      referenceNumber: res.referenceNumber,
      noticeDate: res.noticeDate?.slice(0, 10) || '',
      mangerId: res.mangerId?.toString(),
      committeeMangers: res.committeeMangers ? res.committeeMangers : [],
      achievementDate: res.achievementDate?.slice(0, 10) || '',
      attachment: res.attachment,
      fixingDuration: res.fixingDuration,
      deliveryDuration: res.deliveryDuration,
      imagePlanCopies: res.imagePlanCopies,
      contractorSignature: res.contractorSignature,
      consultantSignature: res.consultantSignature,
      imagePlan: res.imagePlan,
    });
    this.projectDeliveryDetails.brief = res.brief
    this.projectDeliveryDetails.registeredDecisionDate = res.registeredDecisionDate
    this.projectDeliveryDetails.registeredDecisionNumber = res.registeredDecisionNumber
    this.projectDeliveryDetails.deliveryDate = res.deliveryDate
    this.projectDeliveryDetails.referenceNumber = res.referenceNumber
    this.projectDeliveryDetails.noticeDate = res.noticeDate
    this.projectDeliveryDetails.mangerId = res.mangerId
    this.projectDeliveryDetails.committeeMangers = res.committeeMangers ? res.committeeMangers : [];
    this.projectDeliveryDetails.achievementDate = res.achievementDate
    this.projectDeliveryDetails.fixingDuration = res.fixingDuration
    this.projectDeliveryDetails.deliveryDuration = res.deliveryDuration
    this.projectDeliveryDetails.imagePlanCopies = res.imagePlanCopies
    this.projectDeliveryDetails.consultantSignature = res.consultantSignature
    this.projectDeliveryDetails.contractorSignature = res.contractorSignature
    this.projectDeliveryDetails.imagePlan = res.imagePlan
    this.projectDeliveryDetails.approved = res.approved
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.deliveryForm.patchValue({
        attachment: this.selectedFile.name
      });
      this.attachmentInput.nativeElement.value = '';
      this.selectedFile = null;
      this.cdr.detectChanges();
    }, (error) => {
      this.attachmentInput.nativeElement.value = '';
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try upload again' });
    });
  }

  openManagerModal() {
    this.modalService.open(this.managerModal, this.modalConfig)
  }
  addManager() {
    this.projectDeliveryDetails.mangerId = +this.deliveryForm.value.mangerId;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  getManagerName(id: number) {
    if (id) {
      return this.managers.find(m => m.id === id)?.name;
    }
  }
  openCommitteeModal() {
    this.modalService.open(this.committeeModal, this.modalConfig)
  }
  addCommittee() {
    if (!this.deliveryForm.value.committeeName || !this.deliveryForm.value.committeeEmail || !this.deliveryForm.value.committeePosition) {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'All fields are required' });
      return;
    }
    this.projectDeliveryDetails.committeeMangers.push({
      id: this.deliveryForm.value.committeeId,
      name: this.deliveryForm.value.committeeName,
      email: this.deliveryForm.value.committeeEmail,
      position: this.deliveryForm.value.committeePosition
    });
    delete this.deliveryForm.value.committeeId;
    delete this.deliveryForm.value.committeeName;
    delete this.deliveryForm.value.committeeEmail;
    delete this.deliveryForm.value.committeePosition;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    }, (error) => {
      // this line will remove the index entered above
      this.projectDeliveryDetails.committeeMangers.pop();
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }
  openBriefModal() {
    this.modalService.open(this.briefModal, this.modalConfig)
  }

  addBrief() {
    this.projectDeliveryDetails.brief = this.deliveryForm.value.brief;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openNoticeModal() {
    this.modalService.open(this.noticeModal, this.modalConfig)
  }

  addNotice() {
    this.projectDeliveryDetails.noticeDate = this.deliveryForm.value.noticeDate;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openReferenceNumberModal() {
    this.modalService.open(this.refNumberModal, this.modalConfig)
  }
  addRefNumber() {
    this.projectDeliveryDetails.referenceNumber = this.deliveryForm.value.referenceNumber;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openDeliveryDateModal() {
    this.modalService.open(this.deliveryDateModal, this.modalConfig)
  }
  addDeliveryDate() {
    this.projectDeliveryDetails.deliveryDate = this.deliveryForm.value.deliveryDate;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openRegisteredDecisionNumberModal() {
    this.modalService.open(this.registeredDecisionNumberModal, this.modalConfig)
  }
  addRegisteredDecisionNumber() {
    this.projectDeliveryDetails.registeredDecisionNumber = this.deliveryForm.value.registeredDecisionNumber;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openRegisteredDecisionDateModal() {
    this.modalService.open(this.registeredDecisionDateModal, this.modalConfig)
  }
  addRegisteredDecisionDate() {
    this.projectDeliveryDetails.registeredDecisionDate = this.deliveryForm.value.registeredDecisionDate;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openAchieveDateModal() {
    this.modalService.open(this.achieveDateModal, this.modalConfig)
  }
  addAchieveDate() {
    this.projectDeliveryDetails.achievementDate = this.deliveryForm.value.achievementDate;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }

  openFixingDuration() {
    this.modalService.open(this.fixingDurationModal, this.modalConfig)
  }
  addFixingDuration() {
    this.projectDeliveryDetails.fixingDuration = this.deliveryForm.value.fixingDuration;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openDeliveryDuration() {
    this.modalService.open(this.deliveryDurationModal, this.modalConfig)
  }
  addDeliveryDuration() {
    this.projectDeliveryDetails.deliveryDuration = this.deliveryForm.value.deliveryDuration;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openImagePlan() {
    this.modalService.open(this.imagePlanModal, this.modalConfig)
  }
  addImagePlan() {
    this.projectDeliveryDetails.imagePlan = this.deliveryForm.value.imagePlan;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openImagePlanCopies() {
    this.modalService.open(this.imagePlanCopiesModal, this.modalConfig)
  }
  addImagePlanCopies() {
    this.projectDeliveryDetails.imagePlanCopies = this.deliveryForm.value.imagePlanCopies;
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }

  signContractor() {
    this.activeSignContractor = true;
    // this.signatureStage = rfpSignature?.signatureStageId;
    this.toggleSignaturePad()
  }
  signConsultant() {
    this.activeSignContractor = false;
    // this.signatureStage = rfpSignature?.signatureStageId;
    this.toggleSignaturePad()
  }

  // Method to toggle the signature pad visibility
  toggleSignaturePad() {
    this.showSignaturePad = !this.showSignaturePad;

    // If hiding, clear the signature
    if (!this.showSignaturePad) {
      this.clearSignature();
    }
  }

  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log('Completed drawing', event);
  }

  drawStart(event: MouseEvent | Touch) {
    // console.log('Start drawing', event);
  }
  // Method to clear the signature
  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  saveSignature() {
    const payload = {
      signature: this.signaturePad.toDataURL('image/png')
    }
    if (this.activeSignContractor) {
      this.projectDeliveryDetails.contractorSignature = payload.signature;
      this.deliveryForm.value.contractorSignature = payload.signature;
    } else {
      this.projectDeliveryDetails.consultantSignature = payload.signature;
      this.deliveryForm.value.consultantSignature = payload.signature;
    }
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
    });
    this.cdr.detectChanges();
    this.toggleSignaturePad();
  }

  approve() {
    this.projectDeliveryDetails.status = +this.deliveryForm.value.status;
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      this.showAlert({ icon: 'error', title: 'Error!', text: 'all data must be filled before approve' });
      return
    }
    this.projectDeliveryDetails.approved = true;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Approved successfully!' });
      this.back();
    }, (error) => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  print() {
    window.print();
  }
  back() {
    this._location.back()
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
