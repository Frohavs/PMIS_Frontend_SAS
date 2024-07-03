import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../i18n';
import { CompaniesComponent } from './companies.component';


@NgModule({
  declarations: [
    CompaniesComponent
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    SharedModule,
    TranslationModule,
    TranslateModule
  ]
})
export class CompaniesModule { }
