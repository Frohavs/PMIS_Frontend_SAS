import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfpManagementService } from 'src/app/services/rfp-managment.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-rfp-details',
  templateUrl: './rfp-details.component.html',
  styleUrl: './rfp-details.component.scss'
})
export class RfpDetailsComponent implements OnInit {

  rfpDetails: any;
  rfpLogs: any;
  rfpId: number;
  projectId: number;
  isLoading: boolean;

  statusId: any = '';
  noteType: any = '';
  note = '';
  statusList: any[] = [];
  noteTypes: any[] = [];


  userId: any;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('approveModal') approveModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private router: Router,
    private _location: Location,
    private lookupService: LookupService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private rfpManagementService: RfpManagementService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.rfpId = +params['rfpId'];
      if (this.rfpId) {
        this.getRFPDetails();
        this.getRFPLogs();
      }
    });

    this.getLookups();
  }

  getRFPDetails() {
    this.rfpManagementService.getRFPById(this.rfpId).subscribe(res => {
      this.rfpDetails = res.data;
      this.cdr.detectChanges();

    });
  }
  getRFPLogs() {
    this.rfpManagementService.getRFPLogsById(this.rfpId).subscribe(res => {
      this.rfpLogs = res.data;
      this.cdr.detectChanges();

    });
  }
  getLookups() {
    this.lookupService.getMIRNoteTypes().subscribe(res => {
      this.noteTypes = res.data;
      this.cdr.detectChanges();
    });
  }

  numbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode != 43) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getNoteType(type: any) {
    const result = this.noteTypes.find(x => x.id === type)?.name;
    return result
  }

  navigateQuestionsPage(id: any) {
    if(this.rfpDetails.status === 'Decline') return;
    this.router.navigate(['rfp_management/initial-check-questions'], { queryParams: { rfpId: id } });
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
