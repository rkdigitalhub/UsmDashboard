import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService, SafeAppUser } from '../../../services/auth.service';
import { memberIcons } from '../../member-icons';
import { SpinScheduleService } from '../../../services/spin-schedule.service';

interface BenefitScheduleRow {
  round: number;
  investment: number;
  profitFrom25: number;
  settlement: number;
  interest: number;
  total: number;
}

interface DashboardSnapshot {
  investment: string;
  winningAmountInvestorBenefit: string;
  monthlyInterestInvestorBenefit: string;
  referralRewardsLeader: string;
  incentiveRewardsLeader: string;
  redeemRewardsWalletLeader: string;
  premiumRewardLeader: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly dashboardIcon = memberIcons.dashboard;
  readonly walletIcon = memberIcons.wallet;
  readonly rewardIcon = memberIcons.reward;
  readonly scheduleIcon = memberIcons.schedule;
  private readonly dashboardSpinTeamName = 'THE UNIVERSE';
  private readonly fixedInvestmentAmount = 500000;
  private readonly baseInvestmentAmount = 250000;
  private readonly benefitSchedule: BenefitScheduleRow[] = [
    { round: 1, investment: 250000, profitFrom25: 62500, settlement: 312500, interest: 0, total: 312500 },
    { round: 2, investment: 250000, profitFrom25: 67500, settlement: 317500, interest: 5000, total: 322500 },
    { round: 3, investment: 250000, profitFrom25: 72500, settlement: 322500, interest: 10000, total: 332500 },
    { round: 4, investment: 250000, profitFrom25: 77500, settlement: 327500, interest: 15000, total: 342500 },
    { round: 5, investment: 250000, profitFrom25: 82500, settlement: 332500, interest: 20000, total: 352500 },
    { round: 6, investment: 250000, profitFrom25: 95000, settlement: 345000, interest: 25000, total: 370000 },
    { round: 7, investment: 250000, profitFrom25: 100000, settlement: 350000, interest: 32500, total: 382500 },
    { round: 8, investment: 250000, profitFrom25: 105000, settlement: 355000, interest: 40000, total: 395000 },
    { round: 9, investment: 250000, profitFrom25: 110000, settlement: 360000, interest: 47500, total: 407500 },
    { round: 10, investment: 250000, profitFrom25: 115000, settlement: 365000, interest: 55000, total: 420000 },
    { round: 11, investment: 250000, profitFrom25: 127500, settlement: 377500, interest: 62500, total: 440000 },
    { round: 12, investment: 250000, profitFrom25: 132500, settlement: 382500, interest: 72500, total: 455000 },
    { round: 13, investment: 250000, profitFrom25: 137500, settlement: 387500, interest: 82500, total: 470000 },
    { round: 14, investment: 250000, profitFrom25: 142500, settlement: 392500, interest: 92500, total: 485000 },
    { round: 15, investment: 250000, profitFrom25: 147500, settlement: 397500, interest: 102500, total: 500000 },
    { round: 16, investment: 250000, profitFrom25: 160000, settlement: 410000, interest: 112500, total: 522500 },
    { round: 17, investment: 250000, profitFrom25: 165000, settlement: 415000, interest: 125000, total: 540000 },
    { round: 18, investment: 250000, profitFrom25: 170000, settlement: 420000, interest: 137500, total: 557500 },
    { round: 19, investment: 250000, profitFrom25: 175000, settlement: 425000, interest: 150000, total: 575000 },
    { round: 20, investment: 250000, profitFrom25: 180000, settlement: 430000, interest: 162500, total: 592500 }
  ].map((row) => this.scaleBenefitRow(row));

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

  nextSpinTeamName = '--';
  nextSpinDateText = '--';
  nextSpinCountdown = '--';
  private countdownTimerId: number | null = null;
  private nextSpinTargetIstMs: number | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly spinScheduleService: SpinScheduleService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    if (this.countdownTimerId !== null) {
      window.clearInterval(this.countdownTimerId);
      this.countdownTimerId = null;
    }
  }

  private loadDashboard() {
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.errorMessage = 'Logged in user information is unavailable.';
      return;
    }

    this.bindCurrentUser(currentUser);
    const snapshot = this.createMockSnapshot(currentUser);
    this.applySnapshot(snapshot);
    const spinSchedule = this.spinScheduleService.getSpinSchedule(currentUser);
    this.setNextSpinSchedule(this.dashboardSpinTeamName, spinSchedule.dateText);
  }

  private bindCurrentUser(user: SafeAppUser): void {
    this.welcomeTitle = `Welcome, ${user.name}`;
    this.welcomeSubtext = `${user.userId} • Member dashboard for THE UNIVERSE plan`;
  }

  private createMockSnapshot(user: SafeAppUser): DashboardSnapshot {
    const scheduleRow = this.getBenefitScheduleRow(user);

    return {
      investment: this.formatCurrency(scheduleRow.investment),
      winningAmountInvestorBenefit: this.formatCurrency(0),
      monthlyInterestInvestorBenefit: this.formatCurrency(0),
      referralRewardsLeader: '0',
      incentiveRewardsLeader: '0',
      redeemRewardsWalletLeader: '0',
      premiumRewardLeader: '--'
    };
  }

  private getBenefitScheduleRow(user: SafeAppUser): BenefitScheduleRow {
    const seed = Number(user.userId.replace(/\D/g, '')) || 0;
    return this.benefitSchedule[seed % this.benefitSchedule.length];
  }

  private scaleBenefitRow(row: BenefitScheduleRow): BenefitScheduleRow {
    const scale = this.fixedInvestmentAmount / this.baseInvestmentAmount;

    return {
      round: row.round,
      investment: this.fixedInvestmentAmount,
      profitFrom25: Math.round(row.profitFrom25 * scale),
      settlement: Math.round(row.settlement * scale),
      interest: Math.round(row.interest * scale),
      total: Math.round(row.total * scale)
    };
  }

  private applySnapshot(snapshot: DashboardSnapshot): void {
    this.investment = snapshot.investment;
    this.winningAmountInvestorBenefit = snapshot.winningAmountInvestorBenefit;
    this.monthlyInterestInvestorBenefit = snapshot.monthlyInterestInvestorBenefit;
    this.referralRewardsLeader = snapshot.referralRewardsLeader;
    this.incentiveRewardsLeader = snapshot.incentiveRewardsLeader;
    this.redeemRewardsWalletLeader = snapshot.redeemRewardsWalletLeader;
    this.premiumRewardLeader = snapshot.premiumRewardLeader;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  private setNextSpinSchedule(teamName: string, dateText: string): void {
    this.nextSpinTeamName = teamName;
    this.nextSpinDateText = dateText;

    const targetIstMs = this.parseIstDateToMs(dateText);
    this.nextSpinTargetIstMs = targetIstMs;

    if (this.countdownTimerId !== null) {
      window.clearInterval(this.countdownTimerId);
      this.countdownTimerId = null;
    }

    this.updateCountdown();
    this.countdownTimerId = window.setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown(): void {
    if (this.nextSpinTargetIstMs === null) {
      this.nextSpinCountdown = '--';
      return;
    }

    const nowIstMs = this.getCurrentIstMs();
    const remainingMs = Math.max(0, this.nextSpinTargetIstMs - nowIstMs);

    this.nextSpinCountdown = this.spinScheduleService.formatRemainingTime(remainingMs);
  }

  private getCurrentIstMs(): number {
    return this.spinScheduleService.getCurrentIstMs();
  }

  private parseIstDateToMs(dateText: string): number | null {
    return this.spinScheduleService.parseIstDateToMs(dateText);
  }
}
