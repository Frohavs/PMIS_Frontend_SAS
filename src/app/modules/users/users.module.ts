import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { OverviewComponent } from './overview/overview.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    SharedModule
  ]
})
export class UsersModule { }
