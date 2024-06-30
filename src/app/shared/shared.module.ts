import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';

import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PmisTableComponent } from './components/pmis-table/pmis-table.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    ProfileComponent,
    PmisTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    OverlayModule,
    CdkMenuModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    HeaderComponent,
    SidenavComponent,
    ProfileComponent,
    PmisTableComponent,
    OverlayModule,
    CdkMenuModule,
  ],
})
export class SharedModule {}
