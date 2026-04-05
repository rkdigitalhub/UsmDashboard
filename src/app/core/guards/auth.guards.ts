import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function getDefaultRoute(authService: AuthService, router: Router): UrlTree {
  const currentUser = authService.getCurrentUser();

  if (currentUser?.role === 'admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return router.createUrlTree(['/dashboard']);
}

function requireRole(role: 'admin' | 'member'): true | UrlTree {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.createUrlTree(['/']);
  }

  if (currentUser.role === role || (!currentUser.role && role === 'member')) {
    return true;
  }

  return getDefaultRoute(authService, router);
}

export const guestOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? getDefaultRoute(authService, router) : true;
};

export const memberGuard: CanActivateFn = () => requireRole('member');

export const adminGuard: CanActivateFn = () => requireRole('admin');

export const adminMatchGuard: CanMatchFn = () => requireRole('admin');