import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-site-studies-designs-dashboard',
  templateUrl: './site-studies-designs-dashboard.component.html',
  styleUrl: './site-studies-designs-dashboard.component.scss'
})
export class SiteStudiesDesignsDashboardComponent {

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor() {}

  async openModal() {
    return await this.modalComponent.open();
  }

}
