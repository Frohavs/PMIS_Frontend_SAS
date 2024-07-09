import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ROLES } from './mock-data';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {

  isCollapsed1 = false;
  isLoading = false;

  roles = ROLES;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(private router: Router, private renderer: Renderer2, private modalService: NgbModal) { }

  navigateEdit() {
    this.router.navigateByUrl('/companies/edit/1452')
  }

  addUser(modal: any) {
    this.modalService.open(modal, this.modalConfig);
  }

}
