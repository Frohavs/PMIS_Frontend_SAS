import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { FactoryService } from 'src/app/services/factory.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-factory',
  templateUrl: './add-factory.component.html',
  styleUrl: './add-factory.component.scss'
})
export class AddFactoryComponent implements OnInit {
  projectId: number;
  boqId: number;
  isLoading: boolean;
  addFactoryForm: FormGroup;

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
    private factoryService: FactoryService,
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
      console.log(`Marker set at: Latitude: ${this.lat}, Longitude: ${this.lng}`);
      this.addFactoryForm.patchValue({ latitude: this.lat, longitude: this.lng });
      this.cdr.detectChanges();
    }
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.boqId = params['boqId'];
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.boqId = +queryParams?.boqId;
  }

  initAddBoqForm() {
    this.addFactoryForm = this.formBuilder.group({
      factoryCRId: ['', Validators.required],
      factoryFieldId: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      latitude: ['24.66911551123412', Validators.required],
      longitude: ['46.690065163710585', Validators.required],
      repreName: ['', Validators.required],
      reprePhone: ['', Validators.required],
      reprEmail: ['', Validators.required],
      profileAttachment: ['test123.pdf', Validators.required],
      projectSize: ['', Validators.required],
      numOfEmployess: ['', Validators.required],
      lastFinancialAttachment: ['test123.pdf', Validators.required],
      approveletterAttachment: ['test123.pdf', Validators.required],
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

  getVatID(value: string) {
    let id = 0;
    if (value == '0') {
      id = 1;
    } else if (value == '5') {
      id = 2;
    } else if (value == '15') {
      id = 3;
    }
    return id;
  }
  getVatValue(id: number) {
    let value = '';
    if (id == 1) {
      value = '0';
    } else if (id == 2) {
      value = '5';
    } else if (id == 3) {
      value = '10';
    }
    return value;

  }

  saveChanges() {
    if (!this.addFactoryForm.valid) {
      this.addFactoryForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.addFactoryForm.value,
      projectId: +this.projectId,
      year: +this.addFactoryForm.value.year,
      numOfEmployess: +this.addFactoryForm.value.numOfEmployess,
      factoryCRId: +this.addFactoryForm.value.factoryCRId,
      factoryFieldId: +this.addFactoryForm.value.factoryFieldId,

    }

    if (!this.boqId) {
      this.factoryService.addFactory(payload).subscribe({
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
  }

  openPopup() {
    this.modalService.open(this.crModal, this.modalConfig)
  }

  onAddFactoryCR(event: Event, myForm: NgForm) {
    const payload = {
      name: this.crNameEn,
      nameAr: this.crNameAr,
      attachment: this.crAttachment,
      crNumber: this.crNumber,
    }
    this.factoryService.addFactoryCR(payload).subscribe(res => {
      this.modalService.dismissAll();
      this.crNumber = '';
      this.crNameEn = '';
      this.crNameAr = '';
      this.crAttachment = '';
      this.showAlert({ icon: 'success', title: 'Success!', text: 'CR Added successfully!' });
      this.cdr.detectChanges();
      this.getLookups();
    }, (err) => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'error adding CR' });
    })
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

  onApproveFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.addFactoryForm.patchValue({
          approveletterAttachment: file.name
        })
      }, (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try Upload again' });
      });
    }
  }

  onLastFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.addFactoryForm.patchValue({
          lastFinancialAttachment: file.name
        })
      }, (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try Upload again' });
      });
    }
  }

  onProfileFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.addFactoryForm.patchValue({
          profileAttachment: file.name
        })
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
