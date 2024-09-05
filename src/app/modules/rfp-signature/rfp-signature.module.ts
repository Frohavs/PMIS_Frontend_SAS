import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfpSignatureRoutingModule } from './rfp-signature-routing.module';
import { RfpSignatureComponent } from './rfp-signature.component';
import { OverviewComponent } from './overview/overview.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxCurrencyDirective } from 'ngx-currency';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AddRfpComponent } from './add-rfp/add-rfp.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { AddSubCategoryComponent } from './sub-category/add-sub-category/add-sub-category.component';


@NgModule({
  declarations: [
    RfpSignatureComponent,
    OverviewComponent,
    AddRfpComponent,
    CategoryComponent,
    AddCategoryComponent,
    SubCategoryComponent,
    AddSubCategoryComponent
  ],
  imports: [
    CommonModule,
    RfpSignatureRoutingModule,
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
export class RfpSignatureModule { }
