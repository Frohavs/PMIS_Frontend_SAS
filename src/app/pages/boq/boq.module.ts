import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoqRoutingModule } from './boq-routing.module';
import { BoqComponent } from './boq.component';
import { AddBoqComponent } from './add-boq/add-boq.component';
import { OverviewComponent } from './overview/overview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';


@NgModule({
  declarations: [
    BoqComponent,
    OverviewComponent,
    AddBoqComponent,
  ],
  imports: [
    CommonModule,
    BoqRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    TranslateModule,
    SweetAlert2Module.forChild(),
    SharedModule
  ]
})
export class BoqModule { }
