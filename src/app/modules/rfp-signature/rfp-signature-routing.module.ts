import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfpSignatureComponent } from './rfp-signature.component';
import { OverviewComponent } from './overview/overview.component';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AddRfpComponent } from './add-rfp/add-rfp.component';

const routes: Routes = [
  {
    path: '',
    component: RfpSignatureComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'add',
        component: AddRfpComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'sub-category',
        component: SubCategoryComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfpSignatureRoutingModule { }
