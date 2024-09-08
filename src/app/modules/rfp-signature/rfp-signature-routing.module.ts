import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfpSignatureComponent } from './rfp-signature.component';
import { OverviewComponent } from './overview/overview.component';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AddRfpComponent } from './add-rfp/add-rfp.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { AddSubCategoryComponent } from './sub-category/add-sub-category/add-sub-category.component';
import { RfpDetailsComponent } from './rfp-details/rfp-details.component';

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
        path: 'details/:id',
        component: RfpDetailsComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'add-category',
        component: AddCategoryComponent,
      },
      {
        path: 'edit-category/:id',
        component: AddCategoryComponent,
      },
      {
        path: 'sub-category',
        component: SubCategoryComponent,
      },
      {
        path: 'add-sub-category',
        component: AddSubCategoryComponent,
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
