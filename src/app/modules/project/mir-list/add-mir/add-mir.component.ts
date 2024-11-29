import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { FactoryService } from 'src/app/services/factory.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { BoqService } from 'src/app/services/boq.service';


@Component({
  selector: 'app-add-mir',
  templateUrl: './add-mir.component.html',
  styleUrl: './add-mir.component.scss'
})
export class AddMirComponent implements OnInit {
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


  factoryNames: any[] = [];
  mirStatus: any[] = [];
  mirTypes: any[] = [];
  boqList: any[] = [];
  units: any[] = [];

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
    private boqService: BoqService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
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

      this.addFactoryForm.patchValue({ latitude: this.lat, longitude: this.lng });
      this.cdr.detectChanges();
    }
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.getBoqList();
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.boqId = params['boqId'];
    });
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.boqId = +queryParams?.boqId;
  }

  initAddBoqForm() {
    this.addFactoryForm = this.formBuilder.group({
      latitude: ['24.66911551123412', Validators.required],
      longitude: ['46.690065163710585', Validators.required],
      assignedDate: ['', Validators.required],
      typeId: ['', Validators.required],
      nameId: ['', Validators.required],
      quantity: ['', Validators.required],
      boqId: ['', Validators.required],
    });
  }

  getLookups() {
    // this.lookupService.getMIRNames().subscribe(res => {
    //   this.factoryNames = res.data;
    //   this.cdr.detectChanges();
    // });
    this.lookupService.getMIRStatuses().subscribe(res => {
      this.mirStatus = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getMIRTypes().subscribe(res => {
      this.mirTypes = res.data;
      this.cdr.detectChanges();
    });
  }

  getBoqList() {
    this.boqService.getAll(this.projectId).subscribe(res => {
      this.boqList = res.data.items;
      debugger
      this.cdr.detectChanges();
    });
  }

  addQuantity() {

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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);
      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.crAttachment = res.data;
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
          approveletterAttachment: res.data
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
          lastFinancialAttachment: res.data
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
          profileAttachment: res.data
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
