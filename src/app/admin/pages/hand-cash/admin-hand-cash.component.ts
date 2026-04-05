import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminCashRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-hand-cash',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-hand-cash.component.html'
})
export class AdminHandCashComponent {
  readonly exportIcon = adminUiIcons.export;
  readonly verifyIcon = adminUiIcons.verify;
  readonly postIcon = adminUiIcons.post;
  payments: AdminCashRow[] = [];
  statusMessage = '';

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  exportRegister(): void {
    this.statusMessage = 'Mock hand cash register export prepared.';
  }

  updatePaymentStatus(id: number, status: string): void {
    this.adminConsoleStateService.updateHandCashStatus(id, status);
    this.statusMessage = `Hand cash record marked as ${status}.`;
    this.refreshData();
  }

  private refreshData(): void {
    this.payments = this.adminConsoleStateService.getHandCashPayments();
  }
}