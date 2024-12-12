import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrl: './questions-page.component.scss'
})
export class QuestionsPageComponent implements OnInit {

  rfpId: any;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  initialCheck: boolean = false;
  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  showApprove = false;

  statusList: any[] = [
    {
      id: 1,
      name: 'Yes',
    },
    {
      id: 2,
      name: 'No',
    },
    {
      id: 3,
      name: 'Not Applicable',
    }
  ]
  answerModel: { rfpId: number, initialCheckId: number, status: any, answer: string } = { rfpId: 0, initialCheckId: 0, status: '', answer: '' };
  @ViewChild('answerModal') answerModal!: any;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private rfpManagementService: RfpManagementService,
  ) { }

  ngOnInit(): void {
    console.log(this.router.url);
    this.initialCheck = !!this.router.url.includes('initial-check-questions');
    this.activatedRoute.queryParams.subscribe(params => {
      this.rfpId = +params['rfpId'];
      if (this.rfpId) {
        this.initRfpList();
      }
    });
  }

  fireAnswerModal(initialCheckId: any) {
    this.answerModel['initialCheckId'] = initialCheckId;
    this.modalService.open(this.answerModal, this.modalConfig);
  }

  initRfpList(rfpId?: number, pageIndex?: number, search?: string) {
    this.dataList = [];

    if (this.initialCheck) {
      this.rfpManagementService.getAllInitialChecks(this.rfpId, pageIndex, search).subscribe(res => {
        this.dataList = res?.data?.items;
        this.totalCount = res?.data?.totalcount;
        this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
        this.checkallAnswers();
        this.cdr.detectChanges();
      });
    } else {
      this.rfpManagementService.getRfpOwnerChecks(this.rfpId, pageIndex, search).subscribe(res => {
        this.dataList = res?.data?.items;
        this.totalCount = res?.data?.totalcount;
        this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
        this.checkallAnswers();
        this.cdr.detectChanges();

      });
    }
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initRfpList(this.rfpId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initRfpList(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initRfpList(this.selected);
      }
    }
  }

  checkallAnswers() {
    this.showApprove = this.dataList.every(item => item.status);
  }

  approve() {
    if (this.initialCheck) {
      this.rfpManagementService.moveRfpIntialCheck({ id: this.rfpId, approve: true }).subscribe(res => {
        this.router.navigate(['rfp_management/rfp-details'], {
          queryParams: { rfpId: this.rfpId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Updated successfully' });
      }, () => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
      });
    } else {
      this.rfpManagementService.mMoveRfpOwnerCheck({ id: this.rfpId, approve: true }).subscribe(res => {
        this.router.navigate(['rfp_management/rfp-details'], {
          queryParams: { rfpId: this.rfpId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Updated successfully' });
      }, () => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
      });
    }
  }
  reject() {
    if (this.initialCheck) {
      this.rfpManagementService.moveRfpIntialCheck({ id: this.rfpId, approve: false }).subscribe(res => {
        this.router.navigate(['rfp_management/rfp-details'], {
          queryParams: { rfpId: this.rfpId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Updated successfully' });
      }, () => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
      })
    } else {
      this.rfpManagementService.mMoveRfpOwnerCheck({ id: this.rfpId, approve: false }).subscribe(res => {
        this.router.navigate(['rfp_management/rfp-details'], {
          queryParams: { rfpId: this.rfpId }
        });
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Updated successfully' });
      }, () => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
      });
    }
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    this.isLoading = true;
    const payload: any = {
      rfpId: this.rfpId,
      initialCheckId: +this.answerModel.initialCheckId,
      status: +this.answerModel.status,
      answer: this.answerModel.answer
    }
    if (this.initialCheck) {
      this.rfpManagementService.updateIntialCheckRfp(payload).subscribe({
        next: (res) => {
          this.answerModel = { rfpId: 0, initialCheckId: 0, status: '', answer: '' };
          this.isLoading = false;
          this.modalService.dismissAll();
          this.initRfpList();
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Initial check Updated successfully' });
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
          this.isLoading = false;
        }
      });
      this.rfpManagementService.updateOwnerCheckRfp(payload).subscribe({
        next: (res) => {
          this.answerModel = { rfpId: 0, initialCheckId: 0, status: '', answer: '' };
          this.isLoading = false;
          this.modalService.dismissAll();
          this.initRfpList();
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Owner check Updated successfully' });
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
          this.isLoading = false;
        }
      });
    } else {

    }
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
