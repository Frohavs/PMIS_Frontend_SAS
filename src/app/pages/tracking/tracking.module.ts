import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrackingComponent } from './tracking.component';
import { WidgetsModule } from 'src/app/_metronic/partials';



@NgModule({
  declarations: [TrackingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TrackingComponent,
      },
    ]),
    WidgetsModule,
  ]
})
export class TrackingModule { }
