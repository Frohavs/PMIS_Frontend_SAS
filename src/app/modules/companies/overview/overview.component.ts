import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CompanyService } from 'src/app/services/company.service';
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
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];

  isLoading = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private companyService: CompanyService,
  ) {
    this.Add_text = this.translate.instant('COMPANY.Add_Company'),
      this.Search_text = this.translate.instant('COMPANY.Search'),
      this.dataColumns = [
        { title: this.translate.instant('COMPANY.ID'), className: 'min-w-125px p-3 rounded-start' },
        { title: this.translate.instant('COMPANY.TITLE'), className: 'ps-4 min-w-250px' },
        { title: this.translate.instant('AUTH.INPUT.EMAIL'), className: 'min-w-125px' },
        { title: this.translate.instant('COMPANY.cr_number'), className: 'min-w-200px' },
        { title: this.translate.instant('COMPANY.notifications'), className: 'min-w-150px' },
        { title: '', className: 'min-w-200px text-end rounded-end' },
      ]
  }

  ngOnInit(): void {
    this.initializeCompanyList();
  }

  initializeCompanyList(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.companyService.getAll(pageIndex, search).subscribe(res => {
      for (const iterator of res.data.items) {
        this.dataList.push(
          {
            id: iterator.id,
            img: './assets/media/logos/froha_logo.png',
            nameAr: iterator.name,
            name: iterator.email,
            subName: iterator?.nameAr || '--',
            crNumber: iterator.crNumber,
            notifications: { smsNotification: iterator.smsNotification, mailNotification: iterator.mailNotification }
          }
        )
      }
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1) ;
      debugger
      this.cdr.detectChanges();
    });
  }

  searchKeyEmitter(searchText: string) {
    this.initializeCompanyList(1, searchText);
  }

  editRecord(company: any) {
    this.router.navigateByUrl('/companies/edit/' + company.id)
  }

  deleteRecord(company: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.companyService.deleteCompany(company.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Group Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeCompanyList();
            }, 500);
          },
          error: (error) => {
            this.isLoading = false;
            this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          }
        })
      }
    });

  }

  redirectToNew() {
    this.router.navigateByUrl('companies/add')
  }

  detailsClicked(row: any) {
    this.router.navigateByUrl('companies/' + row.id)
  }

  navigatePage(pageIndex: number) {
    this.initializeCompanyList(pageIndex)
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
