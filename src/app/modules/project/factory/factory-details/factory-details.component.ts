import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/modules/auth';
import { FactoryService } from 'src/app/services/factory.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-factory-details',
  templateUrl: './factory-details.component.html',
  styleUrl: './factory-details.component.scss'
})
export class FactoryDetailsComponent implements OnInit {


  factoryId: number;
  projectId: number;
  factoryDetails: any;
  isLoading: boolean;

  userId: any;
  markerPosition: google.maps.LatLngLiteral | null = null;
  options: google.maps.MapOptions = {
    center: { lat: 24.774265, lng: 46.738586 },
    zoom: 11
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false // Enable marker dragging
  };

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('approveModal') approveModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  approveModelData: any = { accepted: true, note: '', id: 0, approval: 0 }

  constructor(
    private router: Router,
    private _location: Location,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private factoryService: FactoryService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?.id;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.factoryId = +params['factoryId'];
      if (this.factoryId) {
        this.getFactoryDetails()
      }
    });
  }

  getFactoryDetails() {
    this.factoryService.getById(this.factoryId).subscribe(res => {
      this.factoryDetails = res.data;
      this.markerPosition = { lat: +this.factoryDetails?.latitude, lng: +this.factoryDetails?.longitude };
      this.options.center = { lat: +this.factoryDetails?.latitude, lng: +this.factoryDetails?.longitude };
      this.cdr.detectChanges();
    });
  }

  fireApproveModal() {
    if (this.factoryDetails.approvals.length === 2 || this.factoryDetails.approvals.length === 3) return;
    this.modalService.open(this.approveModal, this.modalConfig);
  }

  onApproveSubmit() {
    if (this.factoryDetails.approvals.length === 2 || this.factoryDetails.approvals.length === 3) return;
    this.approveModelData.approval = this.factoryDetails.approvals.length + 1;
    const payload = {
      status: this.approveModelData.approval,
      accepted: this.approveModelData.accepted,
      note: this.approveModelData.note,
      userId: +this.userId,
      factoryId: this.factoryId
    }
    this.factoryService.approveFactory(payload).subscribe(res => {

      this.getFactoryDetails();
      this.approveModelData = { accepted: true, notes: '', id: this.factoryId, approval: 0 };
      this.showAlert({ icon: 'success', title: 'Success!', text: 'approved successfully!' });
      this.modalService.dismissAll();
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
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

  back() {
    this._location.back();
  }
}
