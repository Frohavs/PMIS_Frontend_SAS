import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  Add_text: string;
  Search_text: string;
  dataColumns: any[] = []
  dataList: any[] = [
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-26.jpg',
      name: 'Group name',
      subName: 'type',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-3.jpg',
      name: 'Group name',
      subName: 'type',
      status: 'Inactive'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-8.jpg',
      name: 'Group name',
      subName: 'type',
      status: 'In Progress'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-9.jpg',
      name: 'Group name',
      subName: 'type',
      status: 'Active'
    },
    {
      id: '1452',
      img: './assets/media/stock/600x400/img-18.jpg',
      name: 'Group name',
      subName: 'type',
      status: 'Inactive'
    },
  ]

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('addModal') addModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  groupModel = { name: '' };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.Add_text = this.translate.instant('GROUPS.Add_Group'),
      this.Search_text = this.translate.instant('GROUPS.Search'),
      this.dataColumns = [
        { title: this.translate.instant('GROUPS.ID'), className: 'min-w-125px p-3 rounded-start' },
        { title: this.translate.instant('GROUPS.TITLE'), className: 'ps-4 min-w-300px' },
        { title: this.translate.instant('GROUPS.Status'), className: 'min-w-150px' },
        { title: '', className: 'min-w-200px text-end rounded-end' },
      ]
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  addGroup() {
    this.modalService.open(this.addModal, this.modalConfig);
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }

    this.isLoading = true;

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: 'Group created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    const completeFn = () => {
      this.isLoading = false;
    };

    const updateFn = () => {
      console.log('update');
    };
    const createFn = () => {
      console.log('create');

      // this.apiService.createUser(this.userModel).subscribe({
      //   next: () => {
      //     this.reloadEvent.emit(true);
      //   },
      //   error: (error) => {
      //     errorAlert.text = this.extractText(error.error);
      //     this.showAlert(errorAlert);
      //     this.isLoading = false;
      //   },
      //   complete: completeFn,
      // });
    };
    // updateFn();
    createFn();
    this.modalService.dismissAll();
    this.showAlert(successAlert);
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
