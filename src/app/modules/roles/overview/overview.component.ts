import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PermissionService } from 'src/app/services/permission.service';
import { RoleService } from 'src/app/services/role.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  roles: any[] = [];
  permissionList: any[] = [];
  permissionModelValue: any = { roleId: null, permissionIds: [] };

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  roleModel: { name: string } = { name: '' };
  @ViewChild('addModal') addModal!: any;
  @ViewChild('permissionModal') permissionModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private roleService: RoleService,
    private permissionService: PermissionService,
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
    this.roleModel = { name: '' };

    this.modalService.open(this.addModal, this.modalConfig);
  }

  openPermissionModal(role: any) {
    this.permissionService.getAll().subscribe(res => {
      this.permissionList = res?.data;

      const permissionIds: number[] = []
      for (const element of role.permissions) {
        permissionIds.push(element.id);
      }

      const updatedOriginal = this.permissionList.map((item: any) => ({
        ...item,
        checked: permissionIds.includes(item.id) ? true : item.checked || false
      }));
      this.permissionList = updatedOriginal;

      this.permissionModelValue.roleId = role.id;
      this.permissionModelValue.permissionIds = permissionIds;
      const modalRef = this.modalService.open(this.permissionModal, this.modalConfig);

      modalRef.result.then((data) => { }, (reason) => {
        this.permissionModelValue = { roleId: null, permissionIds: [] };
      });
      this.cdr.detectChanges();
    });
  }

  onCheckboxChange(event: Event, permission: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      // Add ID to array if not already present
      if (!this.permissionModelValue.permissionIds?.includes(permission?.id)) {
        this.permissionModelValue.permissionIds.push(permission?.id);
      }
    } else {
      // Remove ID from array if present
      this.permissionModelValue.permissionIds = this.permissionModelValue.permissionIds.filter((permissionId: any) => permissionId !== permission.id);
    }
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }

    this.isLoading = true;

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: 'Role created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: 'Please try again',
    };

    const completeFn = () => {
      this.isLoading = false;
      this.initializeRoleData();
      this.roleModel = { name: '' };
    };
    const createFn = () => {
      this.roleService.addRole({ name: this.roleModel.name }).subscribe({
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
    createFn();
  }

  onPermissionSubmit() {
    this.isLoading = true;
    this.roleService.addRolePermissions(this.permissionModelValue).subscribe(res => {
      this.isLoading = false;
      this.permissionModelValue = { userId: null, permissionIds: [] };
      this.modalService.dismissAll();
      this.initializeRoleData();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Permissions Added successfully!' });
    }, (error) => {
      this.isLoading = false;
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
}
