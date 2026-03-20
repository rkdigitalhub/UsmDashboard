import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  welcomeTitle = 'Welcome';
  welcomeSubtext = 'Dashboard data will appear here once loaded.';

  investment = '--';
  winningAmountInvestorBenefit = '--';
  monthlyInterestInvestorBenefit = '--';

  referralRewardsLeader = '--';
  incentiveRewardsLeader = '--';
  redeemRewardsWalletLeader = '--';
  premiumRewardLeader = '--';

  nextSpinNotification = 'Next spin wheel details will appear after data load.';
  showRewardsPopup = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard() {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getIndex().subscribe({
      next: (html) => {
        this.isLoading = false;
        this.mapDashboardFromHtml(html);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load dashboard data right now.';
        console.error('Dashboard API error', error);
      }
    });
  }

  private mapDashboardFromHtml(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const getText = (selector: string) => doc.querySelector(selector)?.textContent?.trim() ?? '';
    const statValues = Array.from(doc.querySelectorAll('.count-num.card-title.m-0'))
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean);

    const welcomeHeading = getText('.buy-coin h3.card-title');
    const memberCode = getText('.buy-coin h5.card-title');
    const groupName = getText('.buy-coin p.w-100');

    this.welcomeTitle = welcomeHeading || 'Welcome';
    this.welcomeSubtext = [memberCode, groupName].filter(Boolean).join(' • ') || 'Dashboard data loaded successfully.';

    this.investment = statValues[0] || '--';
    this.referralRewardsLeader = statValues[1] || '--';
    this.monthlyInterestInvestorBenefit = statValues[2] || '--';
    this.winningAmountInvestorBenefit = statValues[3] || '--';

    // Leader rewards are mapped from available summary values until dedicated API fields are available.
    this.incentiveRewardsLeader = this.monthlyInterestInvestorBenefit;
    this.redeemRewardsWalletLeader = this.referralRewardsLeader;
    this.premiumRewardLeader = getText('.buy-coin .btn') || 'Premium Reward Pending';

    const nextSpinText = getText('#nav-openorder tbody tr td:nth-child(2)');
    this.nextSpinNotification = nextSpinText
      ? `Next spin wheel settlement: ${nextSpinText}`
      : 'Next spin wheel notification will be announced soon.';
  }

  openRewardsPopup(): void {
    this.showRewardsPopup = true;
  }

  closeRewardsPopup(): void {
    this.showRewardsPopup = false;
  }

}
