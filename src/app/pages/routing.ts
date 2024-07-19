import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'companies',
    loadChildren: () => import('../modules/companies/companies.module').then((m) => m.CompaniesModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'groups',
    loadChildren: () => import('../modules/groups/groups.module').then((m) => m.GroupsModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'projects',
    loadChildren: () => import('../modules/project/project.module').then((m) => m.ProjectModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'manage/users',
    loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'manage/roles',
    loadChildren: () => import('../modules/roles/roles.module').then((m) => m.RolesModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'vendors',
    loadChildren: () => import('../pages/vendors/vendors.module').then((m) => m.VendorsModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'tracking',
    loadChildren: () => import('../pages/tracking/tracking.module').then((m) => m.TrackingModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  {
    path: '',
    redirectTo: '/companies',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
