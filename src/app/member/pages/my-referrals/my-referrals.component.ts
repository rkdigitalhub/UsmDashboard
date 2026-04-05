import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService, AppUser, SafeAppUser } from '../../../services/auth.service';
import { memberIcons } from '../../member-icons';

@Component({
  standalone: true,
  selector: 'app-my-referrals',
  imports: [NgIf, NgFor, FontAwesomeModule],
  templateUrl: './my-referrals.component.html',
  styleUrls: ['./my-referrals.component.scss']
})
export class MyReferralsComponent implements OnInit {
  readonly referralsIcon = memberIcons.referrals;
  readonly refreshIcon = memberIcons.refresh;
  isLoading = false;
  errorMessage = '';
  headers: string[] = [];
  rows: string[][] = [];

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.loadReferrals();
  }

  loadReferrals(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.headers = [];
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
    this.headers = ['User ID', 'Name', 'Mobile', 'City', 'Scheme'];
    this.rows = this.buildReferralRows(currentUser, users);

    if (!this.rows.length) {
      this.errorMessage = 'No referral records available.';
    }
  }

  private buildReferralRows(currentUser: SafeAppUser, users: AppUser[]): string[][] {
    const otherUsers = users.filter((user) => user.userId !== currentUser.userId);
    if (!otherUsers.length) {
      return [];
    }

    const startIndex = (Number(currentUser.userId.replace(/\D/g, '')) || 0) % otherUsers.length;
    const referralCount = Math.min(5, otherUsers.length);

    return Array.from({ length: referralCount }, (_, offset) => {
      const user = otherUsers[(startIndex + offset) % otherUsers.length];

      return [
        user.userId,
        user.name,
        user.mobile ?? '--',
        user.location || '--',
        user.schemeName || '--'
      ];
    });
  }
}
