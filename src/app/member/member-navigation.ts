import { Routes } from '@angular/router';
import { memberIcons, type MemberIconKey } from './member-icons';

interface MemberRouteDefinition {
  path: string;
  label: string;
  icon: MemberIconKey;
  showInSidebar?: boolean;
  loadComponent: NonNullable<Routes[number]['loadComponent']>;
  description?: string;
}

export interface MemberNavItem {
  label: string;
  route: string;
  icon: MemberIconKey;
}

const memberInfoPageLoader = () =>
  import('./pages/member-overview-page/member-overview-page.component').then((module) => module.MemberOverviewPageComponent);

const memberRouteDefinitions: MemberRouteDefinition[] = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((module) => module.DashboardComponent),
    description: 'Review your current membership status, benefits, and next draw schedule.'
  },
  {
    path: 'profile',
    label: 'My Profile',
    icon: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then((module) => module.ProfileComponent),
    description: 'Maintain your personal details and payout bank information.'
  },
  {
    path: 'teams',
    label: 'Teams',
    icon: 'teams',
    loadComponent: () => import('./pages/schemes/schemes.component').then((module) => module.SchemesComponent),
    description: 'Track your subscribed teams and explore available teams.'
  },
  {
    path: 'my-referrals',
    label: 'Referral Network',
    icon: 'referrals',
    loadComponent: () => import('./pages/my-referrals/my-referrals.component').then((module) => module.MyReferralsComponent),
    description: 'View the members connected to your referral chain.'
  },
  {
    path: 'transactions',
    label: 'Payment History',
    icon: 'transactions',
    loadComponent: memberInfoPageLoader,
    description: 'Review your payment activity, payouts, and settlement updates.'
  },
  {
    path: 'reports',
    label: 'Earnings Report',
    icon: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then((module) => module.ReportsComponent),
    description: 'Check your month-wise earning projection and settlement totals.'
  },
  {
    path: 'settings',
    label: 'Account Settings',
    icon: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then((module) => module.SettingsComponent),
    description: 'Update password preferences and account access settings.'
  },
  {
    path: 'spin-wheel',
    label: 'Lucky Draw',
    icon: 'spin',
    loadComponent: () => import('./pages/spin-wheel/spin-wheel.component').then((module) => module.SpinWheelComponent),
    description: 'Join the scheduled draw when your member access window opens.'
  }
];

export const memberSidebarItems: MemberNavItem[] = memberRouteDefinitions
  .filter((route) => route.showInSidebar !== false)
  .map((route) => ({
    label: route.label,
    route: `/${route.path}`,
    icon: route.icon
  }));

export const memberPageRoutes: Routes = memberRouteDefinitions.map((route) => ({
  path: route.path,
  loadComponent: route.loadComponent,
  data: {
    title: route.label,
    iconKey: route.icon,
    description: route.description
  }
}));

export { memberIcons };