import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ROLES } from './mock-data';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent implements OnInit {

  companyId: number;
  themeColor: string;
  companyDetails: any;
  isCollapsed1 = false;
  isLoading = false;

  roles = ROLES;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.companyId = +params['id'];
      if (this.companyId) {
        this.companyService.getByID(this.companyId).subscribe(res => {
          this.companyDetails = res.data;
          this.themeColor = this.companyDetails?.themeColor;
          this.cdr.detectChanges();
        })
      }
    });
  }

  navigateEdit() {
    this.router.navigateByUrl('/companies/edit/1452')
  }

  addUser(modal: any) {
    this.modalService.open(modal, this.modalConfig);
  }

}
