import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NewUserService } from 'src/app/services/new-user.service';
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

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('addUserModal') addUserModal!: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private newUserService: NewUserService
  ) {
    this.Add_text = this.translate.instant('USERS.Add_User');
    this.Search_text = this.translate.instant('USERS.Search');
  }

  ngOnInit(): void {

    this.initializeGroupDate()
  }

  initializeGroupDate() {
    this.newUserService.getAll().subscribe(res => {
      this.dataList = res.data;
      this.cdr.detectChanges();
      console.log(this.dataList);

    })
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(user => {
      user.checked = isChecked ? true : false;
    });
  }

  checkUser(event: Event, id: string) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    console.log(id);
    console.log(isChecked);

  }

}
