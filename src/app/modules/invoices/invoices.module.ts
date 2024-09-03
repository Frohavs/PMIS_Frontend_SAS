import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { InvoicesComponent } from './invoices.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  declarations: [
    InvoicesComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    WidgetsModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class InvoicesModule { }
