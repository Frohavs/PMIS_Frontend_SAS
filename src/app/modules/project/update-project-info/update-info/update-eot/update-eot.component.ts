import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-update-eot',
  templateUrl: './update-eot.component.html',
  styleUrl: './update-eot.component.scss',
  providers: [DatePipe]
})
export class UpdateEotComponent implements OnInit {

  projectId: any;
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

  eotCard: any = { id: 0, eotDays: 0, eotDuration: '', originalFinishDate: '' };
  EotModel: any = { eotDays: 0, eotApprovedDays: 0, eotFinishDate: '', eotReason: '', eotAttachment: '' };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
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

          this.eotCard = {
            id: this.projectId,
            eotDays: this.projectDetails?.duration || 0,
            eotDuration: this.projectDetails?.durationDays || 0,
            originalFinishDate: this.datePipe.transform(this.projectDetails?.originalFinishDate, 'yyyy-mm-dd')
          };
          this.EotModel['eotFinishDate'] = this.datePipe.transform(this.projectDetails?.originalFinishDate, 'yyyy-mm-dd');
          this.cdr.detectChanges();
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

  onCardSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.projectsService.updateEot(this.eotCard).subscribe(res => {
      console.log(res);
      this.isLoading = false;
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Eot Updated successfully' });
    }, (error) => {
      this.isLoading = false;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
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
