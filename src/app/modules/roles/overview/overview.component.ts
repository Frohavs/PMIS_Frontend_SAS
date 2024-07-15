import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  roles: any[] = [];

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  roleModel: { id: number | null, name: string, isActive: boolean } = { id: null, name: '', isActive: true };
  @ViewChild('addModal') addModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    this.initializeRoleData();
  }

  initializeRoleData() {
    this.roleService.getAll().subscribe(res => {
      this.roles = res.data;
      this.cdr.detectChanges();
    });
  }

  addRole() {
    this.roleModel = { id: null, name: '', isActive: true };

    this.modalService.open(this.addModal, this.modalConfig);
  }

  editRole(role: any) {
    this.roleModel = role;
    this.modalService.open(this.addModal, this.modalConfig)
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
      this.initializeRoleData();
      this.roleModel = { id: null, name: '', isActive: true };
    };

    const updateFn = () => {
      this.roleService.updateRole({ id: this.roleModel.id, name: this.roleModel.name, isActive: this.roleModel.isActive }).subscribe({
        next: (res) => {
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
      this.roleService.addRole({ name: this.roleModel.name, isActive: this.roleModel.isActive }).subscribe({
        next: (res) => {
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
    if (this.roleModel.id) {
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
