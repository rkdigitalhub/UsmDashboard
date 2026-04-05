import { Routes } from '@angular/router';
import { adminMenuIcons } from './admin-icons';

export type AdminIconKey = keyof typeof adminMenuIcons;

export interface AdminNavItem {
  label: string;
  path: string;
  route: string;
  icon: AdminIconKey;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

interface AdminRouteDefinition {
  path: string;
  label: string;
  section: string;
  icon: AdminIconKey;
  loadComponent: NonNullable<Routes[number]['loadComponent']>;
}

const placeholderPageLoader = () =>
  import('./pages/admin-placeholder-page.component').then((module) => module.AdminPlaceholderPageComponent);

const adminRouteDefinitions: AdminRouteDefinition[] = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    section: 'Operations Hub',
    icon: 'dashboard',
    loadComponent: () => import('./pages/admin-dashboard.component').then((module) => module.AdminDashboardComponent)
  },
  {
    path: 'groups',
    label: 'Team Setup',
    section: 'Operations Hub',
    icon: 'groups',
    loadComponent: () => import('./pages/admin-groups.component').then((module) => module.AdminGroupsComponent)
  },
  {
    path: 'spin-schedule',
    label: 'Spin Schedule',
    section: 'Operations Hub',
    icon: 'schedule',
    loadComponent: () => import('./pages/admin-spin-schedule.component').then((module) => module.AdminSpinScheduleComponent)
  },
  {
    path: 'reports',
    label: 'Reports',
    section: 'Operations Hub',
    icon: 'reports',
    loadComponent: placeholderPageLoader
  },
  {
    path: 'register',
    label: 'User Onboarding',
    section: 'Member Control',
    icon: 'register',
    loadComponent: () => import('./pages/admin-register.component').then((module) => module.AdminRegisterComponent)
  },
  {
    path: 'members',
    label: 'User Directory',
    section: 'Member Control',
    icon: 'members',
    loadComponent: () => import('./pages/admin-members.component').then((module) => module.AdminMembersComponent)
  },
  {
    path: 'set-round-winner',
    label: 'Winner Control',
    section: 'Member Control',
    icon: 'winners',
    loadComponent: () => import('./pages/admin-winners.component').then((module) => module.AdminWinnersComponent)
  },
  {
    path: 'payments',
    label: 'Payment Operations',
    section: 'Finance Desk',
    icon: 'payments',
    loadComponent: () => import('./pages/admin-payments.component').then((module) => module.AdminPaymentsComponent)
  },
  {
    path: 'bank',
    label: 'Bank Profiles',
    section: 'Finance Desk',
    icon: 'bank',
    loadComponent: () => import('./pages/admin-bank.component').then((module) => module.AdminBankComponent)
  },
  {
    path: 'hand-cash',
    label: 'Hand Cash',
    section: 'Finance Desk',
    icon: 'cash',
    loadComponent: () => import('./pages/admin-hand-cash.component').then((module) => module.AdminHandCashComponent)
  }
];

export const adminNavSections: AdminNavSection[] = adminRouteDefinitions.reduce<AdminNavSection[]>((sections, route) => {
  const section = sections.find((entry) => entry.title === route.section);
  const item: AdminNavItem = {
    label: route.label,
    path: route.path,
    route: `/admin/${route.path}`,
    icon: route.icon
  };

  if (section) {
    section.items.push(item);
    return sections;
  }

  return [...sections, { title: route.section, items: [item] }];
}, []);

export const adminChildRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ...adminRouteDefinitions.map((route) => ({
    path: route.path,
    loadComponent: route.loadComponent,
    data: {
      title: route.label,
      section: route.section
    }
  })),
  { path: '**', redirectTo: 'dashboard' }
];