import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';

interface InvoiceStatusDummyItem {
  label: string;
  totalPercent: number;
  paidPercent: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  invoiceStatusDummy: InvoiceStatusDummyItem[] = [
    { label: 'Nov', totalPercent: 56, paidPercent: 32 },
    { label: 'Dec', totalPercent: 60, paidPercent: 38 },
    { label: 'Jan', totalPercent: 70, paidPercent: 50 },
    { label: 'Feb', totalPercent: 82, paidPercent: 62 },
    { label: 'Mar', totalPercent: 94, paidPercent: 73 },
    { label: 'Apr', totalPercent: 100, paidPercent: 80 },
  ];

  saudiMapCenter: google.maps.LatLngLiteral = { lat: 24.7136, lng: 46.6753 };
  saudiMapZoom = 12;
  saudiMapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
  };
  saudiMarkerPosition: google.maps.LatLngLiteral = { lat: 24.7136, lng: 46.6753 };
  saudiMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  @ViewChild('modal') private modalComponent: ModalComponent;

  async openModal() {
    return await this.modalComponent.open();
  }
}
