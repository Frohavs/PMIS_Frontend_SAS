import {NgModule} from '@angular/core';
import {KeeniconComponent} from './keenicon/keenicon.component';
import {CommonModule} from "@angular/common";
import { SignaturePadComponent } from '../layout/components/signature-pad/signature-pad.component';

@NgModule({
  declarations: [
    KeeniconComponent,
    SignaturePadComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    KeeniconComponent,
    SignaturePadComponent
  ]
})
export class SharedModule {
}
