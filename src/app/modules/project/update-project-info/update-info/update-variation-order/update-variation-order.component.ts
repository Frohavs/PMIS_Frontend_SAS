import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-variation-order',
  templateUrl: './update-variation-order.component.html',
  styleUrl: './update-variation-order.component.scss'
})
export class UpdateVariationOrderComponent implements OnInit {

  projectId: number;
  projectDetails: any;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('UpdateModal') UpdateModal!: any;
  VoModel = { voValue: 0, isIncrement: true, voUpdatedValue: '', voReason: '', voAttachment: '' };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.projectsService.getByID(this.projectId).subscribe(res => {
          console.log(res.data);
          this.projectDetails = res.data;
          this.cdr.detectChanges();
          // setTimeout(() => {
          //   this.editProjectForm(res.data);
          // }, 1000);
        });
      }
    });
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
