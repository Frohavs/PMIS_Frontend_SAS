import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { GroupsComponent } from './groups.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { AddGroupComponent } from './add-group/add-group.component';


@NgModule({
  declarations: [
    GroupsComponent,
    OverviewComponent,
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    WidgetsModule
  ]
})
export class GroupsModule { }
