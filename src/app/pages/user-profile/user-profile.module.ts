import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TranslationModule } from 'src/app/modules/i18n';



@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserProfileComponent,
      },
    ]),
    ReactiveFormsModule,
    WidgetsModule,
    SharedModule,
    TranslationModule,
    TranslateModule,
    SweetAlert2Module.forChild(),
  ]
})
export class UserProfileModule { }
