import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { HseService } from 'src/app/services/hse.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-hse-finding-create',
  templateUrl: './hse-finding-create.component.html',
  styleUrl: './hse-finding-create.component.scss'
})
export class HseFindingCreateComponent implements OnInit {
  projectId: number;
  hseId: number;
  isLoading: boolean;
  addFindingForm: FormGroup;

  options: google.maps.MapOptions = {
    center: { lat: 24.774265, lng: 46.738586 },
    zoom: 7
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: true // Enable marker dragging
  };

  markerPosition: google.maps.LatLngLiteral = { lat: 24.66911551123412, lng: 46.690065163710585 };

  lat: number = this.markerPosition.lat;
  lng: number = this.markerPosition.lng;


  factoriesCR: any[] = [];
  factoryFields: any[] = [];
  units: any[] = [];
  private updating = false;
  private updatingVat = false;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('crModal') crModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  crNumber: string;
  crNameEn: string;
  crNameAr: string;
  crAttachment: string;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private hseService: HseService,
    private attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initAddBoqForm();
    this.getBoqId();
    this.getLookups();
  }

  // Event handler for map click to set marker
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.lat = event.latLng.lat();
      this.lng = event.latLng.lng();
      // console.log(`Marker set at: Latitude: ${this.lat}, Longitude: ${this.lng}`);
      this.addFindingForm.patchValue({ latitude: this.lat, longitude: this.lng });
      this.cdr.detectChanges();
    }
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.hseId = params['hseId'];
    });

  }

  initAddBoqForm() {
    this.addFindingForm = this.formBuilder.group({
      street: ['', Validators.required],
      latitude: ['24.66911551123412', Validators.required],
      longitude: ['46.690065163710585', Validators.required],
      locationRemarks: ['', Validators.required],
      hseFindings: ['', Validators.required],
      findingRemarks: ['', Validators.required],
      dueDate: ['', Validators.required],
      categoryId: ['', Validators.required],
      classificationId: ['', Validators.required],
      evidences: [null, Validators.required],
    });
  }

  getLookups() {
    this.lookupService.getFactoryCRS().subscribe(res => {
      this.factoriesCR = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getFactoryFields().subscribe(res => {
      this.factoryFields = res.data;
      this.cdr.detectChanges();
    })
  }



  saveChanges() {
    if (!this.addFindingForm.valid) {
      this.addFindingForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      ...this.addFindingForm.value,
      projectId: +this.projectId,
    }
    this.hseService.createFinding(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl(`projects/factory-list/${this.projectId}`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        this.isLoading = false;
      }
    });

  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.crAttachment = file.name;
        this.cdr.detectChanges();
      }, (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try Upload again' });
      });
    }

  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
