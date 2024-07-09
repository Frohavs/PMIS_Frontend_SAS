import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../i18n';
import { CompaniesComponent } from './companies.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { OverviewComponent } from './overview/overview.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    CompaniesComponent,
    OverviewComponent,
    CompanyDetailsComponent,
    AddCompanyComponent
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    SharedModule,
    TranslationModule,
    TranslateModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
  ]
})
export class CompaniesModule { }
