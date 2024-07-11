import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable, of, Subscription } from 'rxjs';
import { GroupsService } from 'src/app/services/groups.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  groups$: Observable<any>;

  Add_text: string;
  Search_text: string;
  dataColumns: any[] = []
  dataList: any[] = []

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('addModal') addModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  groupModel: { id: number | null, name: string, isActive: boolean } = { id: null, name: '', isActive: true };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private groupsService: GroupsService,

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
    this.initializeGroupDate()
  }

  initializeGroupDate() {
    this.groups$ = this.groupsService.getAll();
  }

  addGroup() {
    this.modalService.open(this.addModal, this.modalConfig);
  }

  editRecord(group: any) {
    this.groupModel = group;
    this.modalService.open(this.addModal, this.modalConfig)
  }

  deleteRecord(group: any) {
    this.isLoading = true;
    this.groupsService.deleteGroup(group.id).subscribe({
      next: (res) => {
        console.log(res);
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Group Deleted successfully!' });
        this.isLoading = false;
      },
      error: (error) => {
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
        this.isLoading = false;
      }
    })
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
      text: 'Please try again',
    };

    const completeFn = () => {
      this.isLoading = false;
      this.initializeGroupDate();
      this.groupModel = { id: null, name: '', isActive: true };
    };

    const updateFn = () => {
      this.groupsService.updateGroup({ id: this.groupModel.id, name: this.groupModel.name, isActive: this.groupModel.isActive }).subscribe({
        next: (res) => {
          console.log(res);
          this.modalService.dismissAll();
          successAlert.text = 'Group updated successfully!';
          this.showAlert(successAlert);
        },
        error: (error) => {
          this.showAlert(errorAlert);
          this.isLoading = false;
        },
        complete: completeFn,
      });
    };
    const createFn = () => {
      this.groupsService.addGroup({ name: this.groupModel.name, isActive: this.groupModel.isActive }).subscribe({
        next: (res) => {
          console.log(res);
          this.modalService.dismissAll();
          this.showAlert(successAlert);
        },
        error: (error) => {
          this.showAlert(errorAlert);
          this.isLoading = false;
        },
        complete: completeFn,
      });
    };
    if (this.groupModel.id) {
      updateFn();
    } else {
      createFn();
    }
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
