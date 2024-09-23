import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { RiskManagementService } from 'src/app/services/risk-managment.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrl: './risk-details.component.scss'
})
export class RiskDetailsComponent implements OnInit, OnDestroy {
  projectId: any;
  projectDetails: any;
  ObsDetails: any;
  riskId: any;
  noteText: string;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isLoading = false;

  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private projectService: ProjectsService,
    private riskManagementService: RiskManagementService,
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
      this.riskId = +res['riskId'];
      this.getObsDetails(this.riskId);
    });
  }

  getObsDetails(id: number) {
    this.riskManagementService.getRisk(id).subscribe(res => {
      this.ObsDetails = res.data;
      this.cdr.detectChanges()
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


  ngOnDestroy(): void {

  }

}
