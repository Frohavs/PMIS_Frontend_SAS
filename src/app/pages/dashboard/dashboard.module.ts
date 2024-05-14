import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [DashboardComponent, HomeComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
