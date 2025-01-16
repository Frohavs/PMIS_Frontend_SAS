import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/modules/auth';
import { SweetAlertOptions } from 'sweetalert2';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { RfiService } from 'src/app/services/rfi.service';


@Component({
  selector: 'app-rfi-details',
  templateUrl: './rfi-details.component.html',
  styleUrl: './rfi-details.component.scss'
})
export class RfiDetailsComponent implements OnInit {
  rfiId: number;
  projectId: number;
  rfiDetails: any;
  isLoading: boolean;

  statusId: any = '';
  noteType: any = '';
  note = '';
  statusList: any[] = [];
  noteTypes: any[] = [];

  quantityEdit: any;

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
    private rfiService: RfiService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?.id;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.rfiId = +params['rfiId'];
      if (this.rfiId) {
        this.getFactoryDetails()
      }
    });

    this.getLookups();
  }

  getFactoryDetails() {
    this.rfiService.getById(this.rfiId).subscribe(res => {
      this.rfiDetails = res.data;
      console.log(this.rfiDetails);
      
      this.cdr.detectChanges();
      this.lookupService.getRFIStatuses().subscribe(res => {
        if (this.rfiDetails.statusId === 1) {
          this.statusList = [res.data[0]];
        } else {
          this.statusList = res.data.slice(1);
        }
        this.statusId = this.rfiDetails.statusId > 2 ? this.rfiDetails.statusId : '';
        this.cdr.detectChanges();
      });
    });
  }
  getLookups() {
    this.lookupService.getRFINoteTypes().subscribe(res => {
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

  saveNote() {
    const payload = {
      rfiId: this.rfiId,
      note: this.note,
      type: +this.noteType
    }

    this.rfiService.createNote(payload).subscribe(res => {
      this.getFactoryDetails();
      this.note = '';
      this.noteType = '';
      this.showAlert({ icon: 'success', title: 'Success!', text: 'updated successfully!' });
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
  }

  changeStatus() {
    const payload = {
      id: this.rfiId,
      status: +this.statusId,
      rfiBoqs: this.rfiDetails.rfiBoqs.map(({ boqTitle, ...rest }: any) => rest),
    }
    this.rfiService.updateRfi(payload).subscribe(res => {
      this.getFactoryDetails();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'updated successfully!' });
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });
  }

  detectChange(event: any, item: any) {
    if(event.target.value === 0 || event.target.value === '') return;
    console.log(event.target.value);
    item.quantity = +event.target.value;
    console.log(item);


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


