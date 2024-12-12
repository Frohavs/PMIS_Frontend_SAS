import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { end } from '@popperjs/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AreaDistrictService } from 'src/app/services/area-district.service';
import { FactoryService } from 'src/app/services/factory.service';
import { ProjectSitesService } from 'src/app/services/project-sites.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.scss'
})
export class AddSiteComponent implements OnInit {

  projectId: number;
  boqId: number;
  isLoading: boolean;
  addSiteForm: FormGroup;

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


  districts: any[] = [];
  areas: any[] = [];
  units: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private projectSitesService: ProjectSitesService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private areaDistrictService: AreaDistrictService,
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
      this.addSiteForm.patchValue({ latitude: this.lat, longitude: this.lng });
      this.cdr.detectChanges();
    }
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.boqId = params['siteId'];
    });
  }

  initAddBoqForm() {
    this.addSiteForm = this.formBuilder.group({
      name: ['', Validators.required],
      abbreviation: ['', Validators.required],
      value: ['', Validators.required],
      weight: ['', Validators.required],
      remainAmount: [''],
      startDate: ['', Validators.required],
      duration: ['', Validators.required],
      endDate: [{ value: '', disabled: true }, Validators.required],
      latitude: ['24.66911551123412', Validators.required],
      longitude: ['46.690065163710585', Validators.required],
      districtIds: ['', Validators.required],
      areaIds: ['', Validators.required],

    });

    // this.addSiteForm.get('districtIds')?.valueChanges.subscribe((id: number) => {
    //   if (id) {
    //     this.areaDistrictService.getAreaById(id).subscribe(res => {
    //       this.areas = res.data;
    //       this.cdr.detectChanges();
    //     });
    //   }
    // });
    this.addSiteForm.get('duration')?.valueChanges.subscribe((duration) => {
      this.addSiteForm.patchValue({
        endDate: '' // Clear `endDate` initially
      });

      const startDate = this.addSiteForm.get('startDate')?.value;

      if (startDate && +duration && !isNaN(+duration)) {
        const start = new Date(startDate); // Parse `startDate` string into a Date object
        const calculatedEndDate = new Date(start);
        calculatedEndDate.setDate(start.getDate() + +duration); // Add `duration` days

        // Format `calculatedEndDate` as YYYY-MM-DD
        const year = calculatedEndDate.getFullYear();
        const month = String(calculatedEndDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(calculatedEndDate.getDate()).padStart(2, '0'); // Ensure 2 digits

        const formattedDate = `${year}-${month}-${day}`; // Construct YYYY-MM-DD format

        // Patch `endDate` in the form
        this.addSiteForm.patchValue({
          endDate: formattedDate,
        });
      }
    });
  }

  getLookups() {
    this.areaDistrictService.getDistricts().subscribe(res => {
      this.districts = res.data;
      this.cdr.detectChanges();
    });
    this.areaDistrictService.getAreas().subscribe(res => {
      this.areas = res.data;
      this.cdr.detectChanges();
    })
  }

  saveChanges() {
    if (!this.addSiteForm.valid) {
      this.addSiteForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.addSiteForm.value,
      projectId: +this.projectId,
      districtIds: [+this.addSiteForm.value.districtIds],
      areaIds: [+this.addSiteForm.value.areaIds],
      value: +this.addSiteForm.value.value,
      weight: +this.addSiteForm.value.weight,

    }
    delete payload['remainAmount']

    if (!this.boqId) {
      this.projectSitesService.addSite(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigateByUrl(`projects/project-sites/${this.projectId}`);
          this.showAlert({ icon: 'success', title: 'Success!', text: 'Site Added successfully!' });
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
