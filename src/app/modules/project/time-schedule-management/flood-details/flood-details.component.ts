import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/modules/auth';
import { CashFlowService } from 'src/app/services/cash-flow.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { RoleService } from 'src/app/services/role.service';
import { TimeScheduleService } from 'src/app/services/time-schedule.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-flood-details',
  templateUrl: './flood-details.component.html',
  styleUrl: './flood-details.component.scss'
})
export class FloodDetailsComponent implements OnInit, OnDestroy {

  projectId: any;
  projectDetails: any;
  floodDetails: any;
  cashId: any;
  currentUser: any;

  @ViewChild('approveModal')
  approveModal: TemplateRef<any>;
  // {
  //   "accepted": true,
  //   "note": "string",
  //   "cashflowId": 0,
  //   "approval": 1
  // }
  approveModelData: any = { accepted: true, note: '', userId: 0, timeScheduleId: 0 };
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isLoading = false;

  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private AuthService: ProjectsService,
    private projectService: ProjectsService,
    private timeScheduleService: TimeScheduleService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.projectId = +res['id'];
      this.projectService.getByID(this.projectId).subscribe(res => {
        this.projectDetails = res.data;
      });
    });
    this.activatedRoute.queryParams.subscribe(res => {
      this.cashId = +res['floodId'];
      this.getFloodDetails(this.cashId);
    });
    this.currentUser = this.authService.currentUserValue;
  }

  getFloodDetails(id: number) {
    this.timeScheduleService.getFlood(id).subscribe(res => {
      this.floodDetails = res.data;
      this.approveModelData['userId'] = +this.currentUser.id;
      this.approveModelData['timeScheduleId'] = +this.cashId;
      this.cdr.detectChanges()
    });
  }

  handleDecision() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  onSubmit() {

    this.timeScheduleService.floodApproval(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'flood updated successfully!' });
      this.modalService.dismissAll();
      this.approveModelData = { accepted: true, note: '', cashflowId: this.cashId, approval: 0 };
      this.getFloodDetails(this.cashId);
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
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


  ngOnDestroy(): void {

  }

}
