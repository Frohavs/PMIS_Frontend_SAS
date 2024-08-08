import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectInfoComponent } from './update-project-info/update-project-info.component';
import { UpdateProjectStaffComponent } from './update-project-info/update-project-staff/update-project-staff.component';
import { UpdateProgressInfoComponent } from './update-project-info/update-progress-info/update-progress-info.component';
import { ProjectStageUpdateComponent } from './update-project-info/project-stage-update/project-stage-update.component';
import { UpdateInfoComponent } from './update-project-info/update-info/update-info.component';
import { UpdateEotComponent } from './update-project-info/update-info/update-eot/update-eot.component';
import { UpdateVariationOrderComponent } from './update-project-info/update-info/update-variation-order/update-variation-order.component';
import { AddBoqComponent } from './add-boq/add-boq.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import { CashFlowComponent } from './cash-flow/cash-flow.component';
import { AddCashFlowComponent } from './cash-flow/add-cash-flow/add-cash-flow.component';
import { CashFlowDetailsComponent } from './cash-flow/cash-flow-details/cash-flow-details.component';
import { MilestoneListComponent } from './milestone-list/milestone-list.component';
import { AddMilestoneComponent } from './milestone-list/add-milestone/add-milestone.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'create',
        component: CreateProjectComponent,
      },
      {
        path: 'boq-list/:id',
        component: BoqListComponent,
      },
      {
        path: 'add-boq/:id',
        component: AddBoqComponent,
      },
      {
        path: 'edit/:id',
        component: CreateProjectComponent,
      },
      {
        path: 'update-project-info/:id',
        component: UpdateProjectInfoComponent,
      },
      {
        path: 'update-project-staff/:id',
        component: UpdateProjectStaffComponent,
      },
      {
        path: 'update-info/:id',
        component: UpdateInfoComponent,
      },
      {
        path: 'update-progress-info/:id',
        component: UpdateProgressInfoComponent,
      },
      {
        path: 'project-stage-update/:id',
        component: ProjectStageUpdateComponent,
      },
      {
        path: 'update-eot/:id',
        component: UpdateEotComponent,
      },
      {
        path: 'update-variation/:id',
        component: UpdateVariationOrderComponent,
      },

      {
        path: 'cash-flow/:id',
        component: CashFlowComponent,
      },
      {
        path: 'add-cash-flow/:id',
        component: AddCashFlowComponent,
      },
      {
        path: 'cash-details/:id',
        component: CashFlowDetailsComponent,
      },

      {
        path: 'milestone_list/:id',
        component: MilestoneListComponent,
      },
      {
        path: 'add-milestone/:id',
        component: AddMilestoneComponent,
      },
      {
        path: 'edit-milestone/:id',
        component: AddMilestoneComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
