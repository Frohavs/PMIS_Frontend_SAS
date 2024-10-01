import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InitialDeliveryService } from 'src/app/services/initial-delivery.service';
import { ProjectDeliverListDetails } from './add-modal';

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
    isPartially: true,
    noticeDate: new Date().toISOString(),  // Set to current date/time
    referenceNumber: "",
    deliveryDate: new Date().toISOString(),  // Set to current date/time
    registeredDecisionNumber: null,
    registeredDecisionDate: new Date().toISOString(),  // Set to current date/time
    achievementDate: new Date().toISOString(),  // Set to current date/time
    attachment: "",
    fixingDuration: null,
    deliveryDuration: null,
    imagePlan: null,
    imagePlanCopies: null,
    projectId: null,
    managerId: null,
    approved: false,
    committeeMangers: [
      {
        id: 6,
        name: "kmadkour",
        email: "karim.madkour.da@gmail.com",
        position: "Manager"
      }
    ]
  };

  @ViewChild('briefModal') briefModal: TemplateRef<any>;
  @ViewChild('noticeModal') noticeModal: TemplateRef<any>;
  @ViewChild('refNumberModal') refNumberModal: TemplateRef<any>;
  @ViewChild('deliveryDateModal') deliveryDateModal: TemplateRef<any>;
  @ViewChild('registeredDecisionNumberModal') registeredDecisionNumberModal: TemplateRef<any>;
  @ViewChild('registeredDecisionDateModal') registeredDecisionDateModal: TemplateRef<any>;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private initialDeliveryService: InitialDeliveryService,

  ) { }

  ngOnInit(): void {
    this.initDeliverForm();
    this.getProjectId();
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.projectDeliveryDetails.projectId = this.projectId;
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


  initDeliverForm() {
    this.deliveryForm = this.fb.group({
      isPartially: ['1', [Validators.required]],
      brief: ['', Validators.required],
      noticeDate: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      registeredDecisionNumber: [0, Validators.required],
      registeredDecisionDate: ['', Validators.required],
      // committeeMangers: [null, Validators.required],
      achievementDate: ['', Validators.required],
      attachment: ['', Validators.required],
      fixingDuration: [0, Validators.required],
      deliveryDuration: [0, Validators.required],
      imagePlanCopies: [0, Validators.required],
      imagePlan: [0, Validators.required],
    });
  }
  editDeliverForm(res: any) {
    this.deliveryForm.patchValue({
      isPartially: res.isPartially ? '1' : '2',
      brief: res.brief,
      registeredDecisionDate: res.registeredDecisionDate.slice(0, 10) || '',
      registeredDecisionNumber: res.registeredDecisionNumber,
      deliveryDate: res.deliveryDate.slice(0, 10) || '',
      referenceNumber: res.referenceNumber,
      noticeDate: res.noticeDate.slice(0, 10) || '',
      // committeeMangers: res.asdasdsad,
      achievementDate: res.achievementDate.slice(0, 10) || '',
      attachment: res.attachment,
      fixingDuration: res.fixingDuration,
      deliveryDuration: res.deliveryDuration,
      imagePlanCopies: res.imagePlanCopies,
      imagePlan: res.imagePlan,
    });
    this.cdr.detectChanges();
  }

  // Optional method to handle form submission or changes
  onSubmit() {
    console.log(this.deliveryForm.value);
  }
  openBriefModal() {
    this.modalService.open(this.briefModal, this.modalConfig)
  }

  addBrief() {
    this.projectDeliveryDetails.brief = this.deliveryForm.value.brief;
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
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openRegisteredDecisionNumberModal() {
    this.modalService.open(this.registeredDecisionNumberModal, this.modalConfig)
  }
  addRegisteredDecisionNumber() {
    this.projectDeliveryDetails.referenceNumber = this.deliveryForm.value.referenceNumber;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }
  openRegisteredDecisionDateModal() {
    this.modalService.open(this.registeredDecisionDateModal, this.modalConfig)
  }
  addRegisteredDecisionDate() {
    this.projectDeliveryDetails.deliveryDate = this.deliveryForm.value.deliveryDate;
    this.initialDeliveryService.addDeliveryList(this.projectDeliveryDetails).subscribe(res => {
      this.projectDeliveryDetails.id = res.data || null;
      this.modalService.dismissAll();
    });
  }

  approve() {

  }
}
