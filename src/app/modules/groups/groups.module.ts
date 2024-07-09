import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { GroupsComponent } from './groups.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    GroupsComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    WidgetsModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
  ]
})
export class GroupsModule { }
