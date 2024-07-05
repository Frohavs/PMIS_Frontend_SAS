import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { GroupsComponent } from './groups.component';


@NgModule({
  declarations: [
    GroupsComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
