import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AreaDistrictService } from 'src/app/services/area-district.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ProjectLettersService } from 'src/app/services/project-letters.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-add-letter',

  templateUrl: './add-letter.component.html',
  styleUrl: './add-letter.component.scss'
})
export class AddLetterComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  addLetterForm: FormGroup;
  areas: any;
  stackHolders: any[] = [];
  Districts: any[] = [];


  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private lettersService: ProjectLettersService,
    private lookupService: LookupService,
    private areaDistrictService: AreaDistrictService,
  ) {
  }

  ngOnInit() {
    this.getProjectId();
    this.initializeCompanyForm();
    this.getLookups();

    this.addLetterForm.get('districtId')?.valueChanges.subscribe((id: number) => {
      if (id) {
        this.areaDistrictService.getAreaById(id).subscribe(res => {
          this.areas = res.data;
          this.cdr.detectChanges();
        });
      }
    })
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
      requestDate: ['', Validators.required],
      subject: ['', Validators.required],
      street: ['', Validators.required],
      stakeHolderId: [null, Validators.required],
      districtId: [null, Validators.required],
    });
  }
  editCompanyForm(data: any) {
    this.addLetterForm.patchValue({
      requestDate: data?.requestDate,
      stakeHolderId: data?.stakeHolderId,
      subject: data?.subject,
      districtId: data?.districtId,
      street: data?.street,
    });
  }

  getLookups() {
    this.lookupService.getStackHolders().subscribe(res => {
      this.stackHolders = res.data;
      this.cdr.detectChanges();
    });
    this.areaDistrictService.getDistricts().subscribe(res => {
      this.Districts = res.data;
      this.cdr.detectChanges();
    });
  }

  saveSettings() {
    const payload =
    {
      ...this.addLetterForm.value, projectId: this.projectId,
      stakeHolderId: +this.addLetterForm.value.stakeHolderId,
      districtId: +this.addLetterForm.value.districtId,
    }
    debugger
    this.lettersService.addLetter(payload).subscribe(res => {
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
