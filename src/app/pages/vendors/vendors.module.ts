import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorsComponent } from './vendors.component';
import { OverviewComponent } from './overview/overview.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';


@NgModule({
  declarations: [
    VendorsComponent,
    OverviewComponent,
    AddVendorComponent
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule
  ]
})
export class VendorsModule { }
