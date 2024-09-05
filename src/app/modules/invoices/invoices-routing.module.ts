import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices.component';
import { OverviewComponent } from './overview/overview.component';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';

const routes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'expenditure',
        component: ExpenditureComponent,
      },
      {
        path: 'add',
        component: NewInvoiceComponent,
      },
      {
        path: 'details',
        component: InvoiceDetailsComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
