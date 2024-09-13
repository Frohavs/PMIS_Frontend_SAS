import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ObsService } from 'src/app/services/obs.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TimeScheduleService } from 'src/app/services/time-schedule.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-obs-details',
  templateUrl: './obs-details.component.html',
  styleUrl: './obs-details.component.scss'
})
export class ObsDetailsComponent implements OnInit, OnDestroy {


  projectId: any;
  projectDetails: any;
  ObsDetails: any;
  obsId: any;
  noteText: string;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isLoading = false;

  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private AuthService: ProjectsService,
    private projectService: ProjectsService,
    private obsService: ObsService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.projectId = +res['id'];
      this.projectService.getByID(this.projectId).subscribe(res => {
        this.projectDetails = res.data;
        this.cdr.detectChanges()
      });
    });
    this.activatedRoute.queryParams.subscribe(res => {
      this.obsId = +res['obsId'];
      this.getObsDetails(this.obsId);
    });
  }

  getObsDetails(id: number) {
    this.obsService.getOBS(id).subscribe(res => {
      this.ObsDetails = res.data;
      this.cdr.detectChanges()
    });
  }

  addNewNote() {
    if (!this.noteText) {
      return;
    }
    this.obsService.createNote({ note: this.noteText, obsId: this.obsId }).subscribe(res => {
      this.noteText = '';
      this.getObsDetails(this.obsId);
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  onApprove() {
    if (confirm('Are you sure you want to Approve Obs?') == true) {
      const payload = {
      id: this.obsId,
      status: this.ObsDetails.statusId + 1
    }
    this.obsService.updateOBSStatus(payload).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'obs approved successfully!' });
      this.getObsDetails(this.obsId);
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
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


  ngOnDestroy(): void {

  }
}
