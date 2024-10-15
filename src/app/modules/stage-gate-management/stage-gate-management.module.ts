import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StageGateManagementRoutingModule } from './stage-gate-management-routing.module';
import { StageGateManagementComponent } from './stage-gate-management.component';
import { OverviewComponent } from './overview/overview.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StageGateManagementComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    StageGateManagementRoutingModule,
    FormsModule,
    SharedModule,
    WidgetsModule,
    TranslateModule,
    SweetAlert2Module.forChild(),

  ]
})
export class StageGateManagementModule { }
