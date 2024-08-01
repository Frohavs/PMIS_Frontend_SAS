import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NewUserService } from 'src/app/services/new-user.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;

  permissionList: any[] = [];

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };


  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('permissionModal') permissionModal!: any;
  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  permissionModelValue: any = { userId: null, permissionIds: [] };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private permissionService: PermissionService,
    private newUserService: NewUserService
  ) {
    this.Add_text = this.translate.instant('USERS.Add_User');
    this.Search_text = this.translate.instant('USERS.Search');
  }

  ngOnInit(): void {
    this.initializeUserData();
    this.getPermissionList();
  }

  initializeUserData() {
    this.newUserService.getAll().subscribe(res => {
      this.totalCount = res?.data?.totalcount;
      this.dataList = res?.data?.items;
      this.cdr.detectChanges();
    });
  }

  getPermissionList() {
    this.permissionService.getAll().subscribe(res => {
      this.permissionList = res?.data;
      this.cdr.detectChanges();
    });
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(user => {
      user.checked = isChecked ? true : false;
    });
  }

  checkUser(event: Event, id: string) {
    // const isChecked = (<HTMLInputElement>event.target).checked;
  }

  redirectToNew() {
    this.router.navigateByUrl('manage/users/add')
  }


  editUser(user: any) {
    this.router.navigateByUrl('manage/users/edit/' + user.id)
  }

  deleteUser(user: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.newUserService.deleteUser(user.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Group Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeUserData();
            }, 500);
          },
          error: (error) => {
            this.isLoading = false;
            this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          }
        });
      }
    });
  }

  openPermissionModal(user: any) {
    // console.log(user);

    this.permissionModelValue.userId = user.id;
    const modalRef = this.modalService.open(this.permissionModal, this.modalConfig);

    modalRef.result.then((data) => { }, (reason) => {
      // on dismiss
      this.permissionModelValue = { userId: null, permissionIds: [] };
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
    // console.log(this.permissionModelValue);
  }

  onSubmit() {
    this.isLoading = true;
    this.newUserService.addUserPermissions(this.permissionModelValue).subscribe(res => {
      this.isLoading = false;
      this.permissionModelValue = { userId: null, permissionIds: [] };
      this.modalService.dismissAll();
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Permissions Added successfully!' });
    }, (error) => {
      this.isLoading = false;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  checkAdmin(userName: string) {
    return userName === 'SuperAdmin' ? false : true;
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
