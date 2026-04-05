import { Routes } from '@angular/router';
import { adminMatchGuard, guestOnlyGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestOnlyGuard],
    loadComponent: () => import('./auth/pages/login/login.component').then((module) => module.LoginComponent),
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canMatch: [adminMatchGuard],
    loadChildren: () => import('./admin/admin.routes').then((module) => module.adminRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./member/member.routes').then((module) => module.memberRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];