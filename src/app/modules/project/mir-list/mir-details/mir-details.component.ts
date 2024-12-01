import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/modules/auth';
import { SweetAlertOptions } from 'sweetalert2';
import { MirService } from 'src/app/services/mir.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';

@Component({
  selector: 'app-mir-details',
  templateUrl: './mir-details.component.html',
  styleUrl: './mir-details.component.scss'
})
export class MirDetailsComponent implements OnInit {

  mirId: number;
  projectId: number;
  mirDetails: any;
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
    private mirService: MirService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?.id;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.mirId = +params['mirId'];
      if (this.mirId) {
        this.getFactoryDetails()
      }
    });

    this.getLookups();
  }

  getFactoryDetails() {
    this.mirService.getById(this.mirId).subscribe(res => {
      this.mirDetails = res.data;
      this.cdr.detectChanges();
      this.lookupService.getMIRStatuses().subscribe(res => {
        if (this.mirDetails.statusId === 1) {
          this.statusList = [res.data[0]];
        } else {
          this.statusList = res.data.slice(1);
        }
        this.statusId = this.mirDetails.statusId > 2 ? this.mirDetails.statusId : '';
        this.cdr.detectChanges();
      });
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

  saveNote() {
    const payload = {
      mirId: this.mirId,
      note: this.note,
      type: +this.noteType
    }

    this.mirService.createNote(payload).subscribe(res => {
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
      id: this.mirId,
      status: +this.statusId,
      mirBoqs: this.mirDetails.mirBoqs.map(({ boqTitle, ...rest }: any) => rest),
    }
    this.mirService.updateMir(payload).subscribe(res => {
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
