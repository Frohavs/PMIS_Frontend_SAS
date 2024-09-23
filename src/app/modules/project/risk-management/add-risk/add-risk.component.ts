import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { ObsService } from 'src/app/services/obs.service';
import { SweetAlertOptions } from 'sweetalert2';
import { RiskManagementService } from 'src/app/services/risk-managment.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-add-risk',
  templateUrl: './add-risk.component.html',
  styleUrl: './add-risk.component.scss'
})
export class AddRiskComponent implements OnInit {

  projectId: number;
  riskId: number;
  isLoading: boolean;
  addRiskForm: FormGroup;

  currentStep: number = 0;
  formsCount = 2;
  riskScore = 0;

  scores = [1,2,3,4,5];
  riskTypes: any[] = [];
  riskConsequences: any[] = [];
  riskCategories: any[] = [];
  riskEffectiveParties: any[] = [];

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private riskManagementService: RiskManagementService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initObsForm();
    this.getRiskId();
    this.getLookups();
    this.getScoreValue();
  }

  getRiskId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.riskId = params['riskId'];
    });
  }

  getLookups() {
    this.lookupService.getRiskTypes().subscribe(res => {
      this.riskTypes = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRiskConsequences().subscribe(res => {
      this.riskConsequences = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRiskCategories().subscribe(res => {
      this.riskCategories = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getRiskEffectiveParties().subscribe(res => {
      this.riskEffectiveParties = res.data;
      this.cdr.detectChanges();
    });
  }

  initObsForm() {
    this.addRiskForm = this.formBuilder.group({
      type: [null, Validators.required],
      consequenceId: [null, Validators.required],
      effectivePartyId: [null, Validators.required],
      categoryId: [null, Validators.required],
      description: ['', Validators.required],
      causes: ['', Validators.required],
      owner: ['', Validators.required],

      likelihood: ['', Validators.required],
      time: ['', Validators.required],
      reputation: ['', Validators.required],
      community: ['', Validators.required],
      performance: ['', Validators.required],
      cost: ['', Validators.required],
      score: [''],
    });
  }

  getScoreValue() {
    this.addRiskForm.valueChanges
      .pipe(
        map((formValues) => {
          const likelihood = Number(formValues.likelihood || 0);
          const time = Number(formValues.time || 0);
          const reputation = Number(formValues.reputation || 0);
          const community = Number(formValues.community || 0);
          const performance = Number(formValues.performance || 0);
          const cost = Number(formValues.cost || 0);

          // Get the maximum value of time, reputation, community, performance, cost
          const maxValue = Math.max(time, reputation, community, performance, cost);

          // Calculate score as likelihood * maxValue
          return likelihood * maxValue;
        })
      )
      .subscribe((score) => {
        // Update the score field in the form
        const scoreControl = this.addRiskForm.get('score');
        if (scoreControl) {
          scoreControl.setValue(score, { emitEvent: false });
        }
      });
  }

  nextStep() {
    const nextStep = this.currentStep + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep = nextStep;
  }

  prevStep() {
    const prevStep = this.currentStep - 1;
    this.currentStep = prevStep;
  }

  saveChanges() {
    if (!this.addRiskForm.valid) {
      this.addRiskForm.markAllAsTouched();
      return;
    }
    for (let key in this.addRiskForm.value) {
      if (!isNaN(Number(this.addRiskForm.value[key])) && this.addRiskForm.value[key] !== "") {
        this.addRiskForm.value[key] = Number(this.addRiskForm.value[key]);
      }
    }
    this.isLoading = true;
    const payload = {
      ...this.addRiskForm.value,
      projectId: +this.projectId,

    }
    this.riskManagementService.addRisk(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigateByUrl(`projects/risk-management/${this.projectId}`);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Risk Added successfully!' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        this.isLoading = false;
      }
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
