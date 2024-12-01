import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
import { FactoryService } from 'src/app/services/factory.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { MirService } from 'src/app/services/mir.service';
import { SweetAlertOptions } from 'sweetalert2';


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


  factories: any[] = [];
  mirStatus: any[] = [];
  mirTypes: any[] = [];
  boqList: any[] = [];
  mirBoqs: any[] = [];

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
    private formBuilder: FormBuilder,
    private mirService: MirService,
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
      this.getProjectIdDependentLists();
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
      quantity: [''],
      boqId: [null],
      factoryId: ['', Validators.required],
    });
  }

  getLookups() {
    this.lookupService.getMIRStatuses().subscribe(res => {
      this.mirStatus = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getMIRTypes().subscribe(res => {
      this.mirTypes = res.data;
      this.cdr.detectChanges();
    });
  }

  getProjectIdDependentLists() {
    this.factoryService.getAll(this.projectId).subscribe(res => {
      this.factories = res.data.items;
      this.cdr.detectChanges();
    });
    this.lookupService.getBoqsByProjectId(this.projectId).subscribe(res => {
      this.boqList = res.data;
      this.cdr.detectChanges();
    });
  }

  addQuantity() {
    this.mirBoqs.push({
      boqId: this.addFactoryForm.value.boqId,
      quantity: this.addFactoryForm.value.quantity
    });
    this.addFactoryForm.patchValue({ boqId: null });
    this.addFactoryForm.patchValue({ quantity: '' });
    this.cdr.detectChanges();
  }

  deleteBoq(boq: any) {
    const result = this.mirBoqs.filter(item => item.boq !== boq.boq);
    this.mirBoqs = result;
  }

  saveChanges() {
    if (!this.addFactoryForm.valid || !this.mirBoqs.length) {
      this.addFactoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      ...this.addFactoryForm.value,
      projectId: +this.projectId,
      typeId: +this.addFactoryForm.value.typeId,
      factoryId: +this.addFactoryForm.value.factoryId,
    }
    payload.mirBoqs = this.mirBoqs;

    delete payload.boqId;
    delete payload.quantity;


    if (!this.boqId) {
      this.mirService.addMir(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/mir-list/${this.projectId}`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Mir Added successfully!' });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          this.isLoading = false;
        }
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
