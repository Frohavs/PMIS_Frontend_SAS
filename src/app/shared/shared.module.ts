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
import { PmisTabsComponent } from './pmis-tabs/pmis-tabs.component';
import { PmisAccordionComponent } from './components/pmis-accordion/pmis-accordion.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    ProfileComponent,
    PmisTableComponent,
    PmisTabsComponent,
    PmisAccordionComponent,
    BreadcrumbComponent
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
    PmisTabsComponent,
    PmisAccordionComponent,
    BreadcrumbComponent,

    OverlayModule,
    CdkMenuModule,
  ],
})
export class SharedModule {}
