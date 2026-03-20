import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SchemesComponent } from './pages/schemes/schemes.component';
import { UsersComponent } from './pages/users/users.component';
import { SpinWheelComponent } from './pages/spin-wheel/spin-wheel.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyReferralsComponent } from './pages/my-referrals/my-referrals.component';

export const routes: Routes = [

  { path:'', component: LoginComponent },

  { path:'dashboard', component: DashboardComponent },

  { path:'teams', component: SchemesComponent },
  { path:'schemes', redirectTo: 'teams', pathMatch: 'full' },

  { path:'users', component: UsersComponent },

  { path:'spin-wheel', component: SpinWheelComponent },

  { path:'transactions', component: TransactionsComponent },

  { path:'reports', component: ReportsComponent },

  { path:'settings', component: SettingsComponent },
  { path:'profile', component: ProfileComponent },
  { path:'my-referrals', component: MyReferralsComponent }

];