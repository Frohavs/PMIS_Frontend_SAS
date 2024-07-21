import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-eot',
  templateUrl: './update-eot.component.html',
  styleUrl: './update-eot.component.scss'
})
export class UpdateEotComponent implements OnInit {

  @ViewChild('UpdateModal') UpdateModal!: any;
  EotModel = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: new Date(), eotReason: '', eotAttachment: '' };

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

    // this.groupsService.updateGroup({ days: this.EotModel.days }).subscribe({
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
    //     this.EotModel = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: new Date(), eotReason: '', eotAttachment: '' };

    //   },
    // });

  }

}
