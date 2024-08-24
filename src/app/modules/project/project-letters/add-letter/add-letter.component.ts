import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CompanyTypes } from 'src/app/modules/companies/add-company/company-types';
import { CompanyService } from 'src/app/services/company.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AreaDistrictService } from 'src/app/services/area-district.service';


@Component({
  selector: 'app-add-letter',

  templateUrl: './add-letter.component.html',
  styleUrl: './add-letter.component.scss'
})
export class AddLetterComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  addLetterForm: FormGroup;
  Districts: any[] = [];


  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private areaDistrictService: AreaDistrictService,
  ) {
  }

  ngOnInit() {
    this.getProjectId();
    this.initializeCompanyForm();
    this.getLookups();
  }


  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];

      if (this.projectId) {
        // this.companyService.getByID(this.projectId).subscribe(res => {
        //   setTimeout(() => {
        //     this.editCompanyForm(res.data);
        //     this.getSelectedVendors(res.data?.vendorIds);
        //   }, 500);
        // });
      }
    });
  }

  initializeCompanyForm() {
    this.addLetterForm = this.formBuilder.group({
      date: ['', Validators.required],
      body: ['', Validators.required],
      subject: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required],
      companyType: ['', Validators.required],
    });
  }
  editCompanyForm(data: any) {
    this.addLetterForm.patchValue({
      date: data?.name,
      body: data?.body,
      subject: data?.body,
      district: data?.body,
      street: data?.body,
      companyType: data?.companyTypeId,
    });
  }

  getLookups() {
    // this.areaDistrictService.getAreas().subscribe(res => {
      // this.municipalities = res.data;
    // });
    this.areaDistrictService.getDistricts().subscribe(res => {
      this.Districts = res.data;
      this.cdr.detectChanges();
    });
  }

  saveSettings() {
      const payload =
        { ...this.addLetterForm.value }
      this.companyService.addCompany(payload).subscribe(res => {
        this.router.navigateByUrl(`projects/project-letter/${this.projectId}`)
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Added successfully!' });
      })
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500);

  }

  back() {
    this._location.back();
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
