import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { AuthService, AppUser, SafeAppUser } from '../../../services/auth.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { memberIcons } from '../../member-icons';

interface ReferralRow {
  userId: string;
  name: string;
  mobile: string;
  city: string;
  scheme: string;
}

@Component({
  standalone: true,
  selector: 'app-my-referrals',
  imports: [NgIf, FontAwesomeModule, DataGridComponent],
  templateUrl: './my-referrals.component.html',
  styleUrls: ['./my-referrals.component.scss']
})
export class MyReferralsComponent implements OnInit {
  readonly referralsIcon = memberIcons.referrals;
  readonly refreshIcon = memberIcons.refresh;
  readonly referralColumnDefs: ColDef<ReferralRow>[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 140 },
    { field: 'name', headerName: 'Name', minWidth: 180 },
    { field: 'mobile', headerName: 'Mobile', minWidth: 150 },
    { field: 'city', headerName: 'City', minWidth: 160 },
    { field: 'scheme', headerName: 'Scheme', minWidth: 170 }
  ];
  isLoading = false;
  errorMessage = '';
  rows: ReferralRow[] = [];

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.loadReferrals();
  }

  loadReferrals(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.rows = [];
      this.errorMessage = 'Logged in user information is unavailable.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.isLoading = false;
        this.mapReferralsFromUsers(currentUser, users);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load referrals right now.';
        console.error('Referrals data error', err);
      }
    });
  }

  private mapReferralsFromUsers(currentUser: SafeAppUser, users: AppUser[]): void {
    this.rows = this.buildReferralRows(currentUser, users);

    if (!this.rows.length) {
      this.errorMessage = 'No referral records available.';
    }
  }

  private buildReferralRows(currentUser: SafeAppUser, users: AppUser[]): ReferralRow[] {
    const otherUsers = users.filter((user) => user.userId !== currentUser.userId && user.schemeName === currentUser.schemeName);
    if (!otherUsers.length) {
      return [];
    }

    const startIndex = (Number(currentUser.userId.replace(/\D/g, '')) || 0) % otherUsers.length;
    const referralCount = Math.min(5, otherUsers.length);

    return Array.from({ length: referralCount }, (_, offset) => {
      const user = otherUsers[(startIndex + offset) % otherUsers.length];

      return {
        userId: user.userId,
        name: user.name,
        mobile: user.mobile ?? '--',
        city: user.location || '--',
        scheme: user.schemeName || '--'
      };
    });
  }
}
