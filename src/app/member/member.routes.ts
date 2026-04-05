import { Routes } from '@angular/router';
import { memberGuard } from '../core/guards/auth.guards';
import { memberPageRoutes } from './member-navigation';

export const memberRoutes: Routes = [
  ...memberPageRoutes.map((route) => ({
    ...route,
    canActivate: [memberGuard]
  })),
  {
    path: 'schemes',
    redirectTo: 'teams',
    pathMatch: 'full'
  },
  {
    path: 'users',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];