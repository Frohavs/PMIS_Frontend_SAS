import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
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
    this.projectsService.updateEot(this.VoModel).subscribe({
      next: (res) => {
        this.modalService.dismissAll();
        this.showAlert({ icon: 'success', title: 'Success!', text: 'VO Updated successfully' });
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.VoModel = { voValue: 0, isIncrement: true, voUpdatedValue: '', voReason: '', voAttachment: '' };
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
