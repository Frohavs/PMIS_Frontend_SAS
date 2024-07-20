import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorsComponent } from './vendors.component';
import { OverviewComponent } from './overview/overview.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';


@NgModule({
  declarations: [
    VendorsComponent,
    OverviewComponent,
    AddVendorComponent
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    TranslateModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class VendorsModule { }
