import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NewUserService } from 'src/app/services/new-user.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  Add_text: string;
  Search_text: string;
  dataList: any[] = []

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private newUserService: NewUserService
  ) {
    this.Add_text = this.translate.instant('PROJECTS.Add_Project');
    this.Search_text = this.translate.instant('PROJECTS.Search');
  }

  ngOnInit(): void {
    this.initializeProjectData()
  }

  initializeProjectData() {
    this.dataList = [{projectName: ''}];
    this.cdr.detectChanges();
    // this.newUserService.getAll().subscribe(res => {

    // })
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(project => {
      project.checked = isChecked ? true : false;
    });
  }

  checkUser(event: Event, id: string) {
    // const isChecked = (<HTMLInputElement>event.target).checked;
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/create')
  }

  editUser(user: any) {
    this.router.navigateByUrl('projects/edit/' + user.id)
  }

  deleteUser(user: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.newUserService.deleteUser(user.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeProjectData();
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

  checkAdmin(userName: string) {
    console.log(userName);
    return userName === 'SuperAdmin' ? false : true;

  }
}
