import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICreateAccount, inits } from 'src/app/modules/wizards/create-account.helper';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-step-create',
  templateUrl: './step-create.component.html',
  styleUrl: './step-create.component.scss'
})
export class StepCreateComponent implements OnInit, OnDestroy {

  projectId: number;
  projectDetails: any;

  reportId: number;
  reportDetails: any;

  addReportForm: FormGroup;
  formsCount = 3;
  account$: BehaviorSubject<ICreateAccount> =
    new BehaviorSubject<ICreateAccount>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
    swalOptions: SweetAlertOptions = { buttonsStyling: false };
    @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
    modalConfig: NgbModalOptions = {
      modalDialogClass: 'modal-dialog modal-dialog-centered mw-600px',
    };
  private unsubscribe: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((res) => {
      this.projectId = +res['id'];
      this.monthlyReportsService.getProjectData(this.projectId).subscribe((res) => {
        this.projectDetails = res.data;
        console.log('this.projectDetails', this.projectDetails);

        this.cdr.detectChanges();
      })
    });

    this.activatedRoute.queryParams.subscribe((res) => {
      this.reportId = +res['reportId'];
      if (this.reportId) {
        this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
          this.reportDetails = res.data;
          console.log(this.reportDetails);
          this.cdr.detectChanges();
        });
      }
    });

    this.initReportForm();
  }

  initReportForm() {
    this.addReportForm = this.formBuilder.group({
      actualEndDate: [null],
      expectedEndDate: [null],
      delayDays: [''],
      scurveValue: [''],
      resourcePlanValue: [''],
    });
  }

  updateAccount = (part: Partial<any>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  Submit() {
    const payload = { id: this.reportId, ...this.addReportForm.value }
    this.monthlyReportsService.createMonthlyReportData(payload).subscribe((res) => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Details Added successfully!' });
      setTimeout(() => {
        this.back();
      }, 2000);

    }, (error) => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
