import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { OverviewComponent } from './overview/overview.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TranslationModule } from '../i18n';


@NgModule({
  declarations: [
    UsersComponent,
    OverviewComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    SharedModule,
    TranslationModule,
    SweetAlert2Module.forChild(),
  ]
})
export class UsersModule { }
