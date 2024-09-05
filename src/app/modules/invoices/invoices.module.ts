import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { InvoicesComponent } from './invoices.component';
import { OverviewComponent } from './overview/overview.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';


@NgModule({
  declarations: [
    InvoicesComponent,
    OverviewComponent,
    ExpenditureComponent,
    NewInvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    WidgetsModule,
    SweetAlert2Module.forChild(),
    SharedModule,
    NgxCurrencyDirective
  ]
})
export class InvoicesModule { }
