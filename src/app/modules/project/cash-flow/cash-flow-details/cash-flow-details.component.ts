import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';
import { CashFlowService } from 'src/app/services/cash-flow.service';

@Component({
  selector: 'app-cash-flow-details',
  templateUrl: './cash-flow-details.component.html',
  styleUrl: './cash-flow-details.component.scss'
})
export class CashFlowDetailsComponent implements OnInit, OnDestroy {

  cashDetails: any;
  cashId: any;

  @ViewChild('approveModal')
  approveModal: TemplateRef<any>;
  // {
  //   "accepted": true,
  //   "note": "string",
  //   "cashflowId": 0,
  //   "approval": 1
  // }
  approveModelData: any = { accepted: true, note: '', cashflowId: 0, approval: 1 };


  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isLoading = false;

  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(private apiService: RoleService,
    private cashFlowService: CashFlowService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(res => {
      this.cashId = res['cashId'];
      this.getCashDetails(this.cashId);
    })
  }

  getCashDetails(id: number) {
    this.cashFlowService.getCashFlowById(id).subscribe(res => {
      this.cashDetails = res.data;
      this.cdr.detectChanges()
      console.log(this.cashDetails);
      this.approveModelData['approval'] = this.cashDetails.approval + 1;
      this.approveModelData['cashflowId'] = +this.cashId;
    });
  }

  handleDecision() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  onSubmit() {
    // debugger
    if(this.approveModelData.accepted === false) this.approveModelData.approval = 3;
    this.cashFlowService.cashApprove(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Vendor Added successfully!' });
      this.modalService.dismissAll();
      this.approveModelData = { accepted: true, note: '', cashflowId: this.cashId, approval: 0 };
      this.getCashDetails(this.cashId);
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
