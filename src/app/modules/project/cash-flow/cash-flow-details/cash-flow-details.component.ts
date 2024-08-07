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

  @ViewChild('approveModal')
  approveModal: TemplateRef<any>;
  approveModel: any = { status: 1, notes: '' };


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
      console.log(res['cashId']);
      this.cashFlowService.getCashFlowById(res['cashId']).subscribe(res => {
        this.cashDetails = res.data;
        this.cdr.detectChanges()
        console.log(this.cashDetails);
        // this.cashDetails.cashflowItems.forEach(element => {
        //   if (element) {

        //   }
        // });
      });
    })
  }

  handleDecision() {
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  onSubmit() {

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
