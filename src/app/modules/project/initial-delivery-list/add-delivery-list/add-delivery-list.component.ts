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
    approved: true,
    committeeMangers: [
      // {
      //   id: 1,
      //   name: "John Doe",
      //   email: "johndoe@example.com",
      //   position: "Project Manager"
      // }
    ]
  };

  @ViewChild('briefModal') briefModal: TemplateRef<any>;

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
    this.getProjectId();

    this.deliveryForm = this.fb.group({
      isPartially: ['1', [Validators.required]],
      brief: ['', Validators.required],
      registeredDecisionDate: ['', Validators.required],
      registeredDecisionNumber: [0, Validators.required],
      deliveryDate: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      noticeDate: ['', Validators.required],
      // committeeMangers: [null, Validators.required],
      achievementDate: ['', Validators.required],
      attachment: ['', Validators.required],
      fixingDuration: [0, Validators.required],
      deliveryDuration: [0, Validators.required],
      imagePlanCopies: [0, Validators.required],
      imagePlan: [0, Validators.required],
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.projectDeliveryDetails.projectId = this.projectId;
    });
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
      debugger
      console.log(res);
      this.modalService.dismissAll();
    });
  }

  approve() {

  }
}
