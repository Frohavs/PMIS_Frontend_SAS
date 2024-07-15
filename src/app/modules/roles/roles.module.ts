import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { RolesComponent } from './roles.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  declarations: [
    RolesComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    WidgetsModule,
    SharedModule
  ]
})
export class RolesModule { }
