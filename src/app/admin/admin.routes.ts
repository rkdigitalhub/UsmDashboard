import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/auth.guards';
import { AdminShellComponent } from './admin-shell.component';
import { adminChildRoutes } from './admin-navigation';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: adminChildRoutes
  }
];