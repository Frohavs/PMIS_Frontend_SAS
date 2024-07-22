import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-eot',
  templateUrl: './update-eot.component.html',
  styleUrl: './update-eot.component.scss'
})
export class UpdateEotComponent implements OnInit {

  @ViewChild('UpdateModal') UpdateModal!: any;
  EotModel = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: '', eotReason: '', eotAttachment: '' };

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private projectsService: ProjectsService,
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
    this.projectsService.updateEot(this.EotModel).subscribe({
      next: (res) => {
        this.modalService.dismissAll();
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Eot Updated successfully' });
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.EotModel = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: '', eotReason: '', eotAttachment: '' };
      },
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

}
