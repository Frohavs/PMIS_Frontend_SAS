import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    HeaderComponent,
    SidenavComponent,
    ProfileComponent
  ],
})
export class SharedModule {}
