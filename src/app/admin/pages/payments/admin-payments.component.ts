import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminCashRow, type AdminPaymentRequestRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-payments',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-payments.component.html'
})
export class AdminPaymentsComponent {
  readonly exportIcon = adminUiIcons.export;
  readonly matchIcon = adminUiIcons.match;
  readonly flagIcon = adminUiIcons.flag;
  readonly verifyIcon = adminUiIcons.verify;
  readonly postIcon = adminUiIcons.post;
  onlinePayments: AdminPaymentRequestRow[] = [];
  handCashPayments: AdminCashRow[] = [];
  statusMessage = '';

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  updateOnlinePaymentStatus(id: number, status: string): void {
    this.adminConsoleStateService.updateOnlinePaymentStatus(id, status);
    this.statusMessage = `Online payment marked as ${status}.`;
    this.refreshData();
  }

  updateHandCashStatus(id: number, status: string): void {
    this.adminConsoleStateService.updateHandCashStatus(id, status);
    this.statusMessage = `Hand cash entry marked as ${status}.`;
    this.refreshData();
  }

  exportPayments(): void {
    this.statusMessage = 'Mock payment export prepared.';
  }

  private refreshData(): void {
    this.onlinePayments = this.adminConsoleStateService.getOnlinePayments();
    this.handCashPayments = this.adminConsoleStateService.getHandCashPayments();
  }
}