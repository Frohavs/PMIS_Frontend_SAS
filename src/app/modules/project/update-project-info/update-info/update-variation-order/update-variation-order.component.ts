import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
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
  selectedFile: File;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('UpdateModal') UpdateModal!: any;
  VoCard: any = { id: 0, voValue: 0, voApprovedValue: 0, voUpdatedValue: 0 };
  VoModel = { voValue: 0, isIncrement: true, voUpdatedValue: 0, voReason: '', voAttachment: '' };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private attachmentService: AttachmentService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.resetModalValues()
      }
    });
  }

  resetModalValues() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      console.log(res.data);

      this.VoCard = {
        id: this.projectId,
        voValue: this.projectDetails?.vo?.originalValue,
        voApprovedValue: this.projectDetails?.vo?.voValue,
        voUpdatedValue: this.projectDetails?.vo?.updatedValue || this.projectDetails?.vo.originalValue
      };

      this.VoModel['voValue'] = 0;
      this.VoModel['voUpdatedValue'] = this.projectDetails?.vo?.updatedValue || this.projectDetails?.vo.originalValue;
      this.VoModel['voReason'] = '';
      debugger
      this.cdr.detectChanges();
    });
  }

  onVoValueInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.VoModel['voUpdatedValue'] = (this.projectDetails.vo?.updatedValue || this.projectDetails?.vo.originalValue) + (+value);
    if (this.VoModel['isIncrement']) {
      this.VoModel['voUpdatedValue'] = (this.projectDetails.vo?.updatedValue || this.projectDetails?.vo.originalValue) + (this.VoModel['voValue']);
    } else {
      this.VoModel['voUpdatedValue'] = (this.projectDetails.vo?.updatedValue || this.projectDetails?.vo.originalValue) - (this.VoModel['voValue']);
    }
  }

  onIsIncrementChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.VoModel['voUpdatedValue'] = this.projectDetails.originalValue + (this.VoModel['voValue']);
    } else {
      this.VoModel['voUpdatedValue'] = this.projectDetails.originalValue - (this.VoModel['voValue']);
    }
  }

  updateEot() {
    const modalRef = this.modalService.open(this.UpdateModal, this.modalConfig);
    modalRef.result.then((data) => { }, (reason) => {
      // on dismiss
      this.resetModalValues();
    });
  }

  onFileSelected(event: any) {
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.VoModel['voAttachment'] = this.selectedFile.name;
    });
  }

  onSubmit(event: Event, myForm: NgForm) {
    console.log(this.VoModel);
    if (myForm && myForm.invalid) {
      return;
    }
    this.isLoading = true;
    const payload = {
      voValue: this.VoModel.voValue,
      voAttachment: this.VoModel.voAttachment,
      voReason: this.VoModel.voReason,
      id: +this.projectId,
      isIncrement: this.VoModel.isIncrement,
    }
    this.projectsService.updateVariation(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({ icon: 'success', title: 'Success!', text: 'VO Updated successfully' });
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      }
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
