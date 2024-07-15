import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { RolesComponent } from './roles.component';
import { OverviewComponent } from './overview/overview.component';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    RolesComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    WidgetsModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class RolesModule { }
