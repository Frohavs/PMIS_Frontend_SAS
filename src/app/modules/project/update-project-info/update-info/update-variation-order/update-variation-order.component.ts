import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-variation-order',
  templateUrl: './update-variation-order.component.html',
  styleUrl: './update-variation-order.component.scss'
})
export class UpdateVariationOrderComponent implements OnInit {

  @ViewChild('UpdateModal') UpdateModal!: any;
  VoModel = { voValue: 0, isIncrement: true, voUpdatedValue: '', voReason: '', voAttachment: '' };

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {

  }

  updateEot() {
    this.modalService.open(this.UpdateModal, this.modalConfig);
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    this.isLoading = true;
    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: 'Eot Updated successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: 'Please try again',
    };

    // this.groupsService.updateGroup({ days: this.VoModel.days }).subscribe({
    //   next: (res) => {
    //     this.modalService.dismissAll();
    //     successAlert.text = 'Group updated successfully!';
    //     this.showAlert(successAlert);
    //   },
    //   error: (error) => {
    //     this.showAlert(errorAlert);
    //     this.isLoading = false;
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //     this.VoModel = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: new Date(), eotReason: '', eotAttachment: '' };

    //   },
    // });

  }
}
