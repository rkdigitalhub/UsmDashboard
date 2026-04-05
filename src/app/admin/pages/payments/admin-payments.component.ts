import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { type AdminCashRow, type AdminPaymentRequestRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { createActionColumn, createStatusColumn } from '../../../shared/components/data-grid/grid-helpers';

@Component({
  standalone: true,
  selector: 'app-admin-payments',
  imports: [CommonModule, FontAwesomeModule, DataGridComponent],
  templateUrl: './admin-payments.component.html'
})
export class AdminPaymentsComponent {
  readonly exportIcon = adminUiIcons.export;
  readonly matchIcon = adminUiIcons.match;
  readonly flagIcon = adminUiIcons.flag;
  readonly verifyIcon = adminUiIcons.verify;
  readonly postIcon = adminUiIcons.post;
  readonly onlinePaymentColumnDefs: ColDef<AdminPaymentRequestRow>[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'name', headerName: 'Name', minWidth: 160 },
    { field: 'team', headerName: 'Team', minWidth: 170 },
    { field: 'channel', headerName: 'Channel', minWidth: 130 },
    { field: 'reference', headerName: 'Reference', minWidth: 170 },
    { field: 'amount', headerName: 'Amount', minWidth: 120 },
    createStatusColumn('status', 'Status', ['Matched']),
    createActionColumn<AdminPaymentRequestRow>([
      { label: 'Match', onClick: (row) => this.updateOnlinePaymentStatus(row.id, 'Matched') },
      { label: 'Flag', kind: 'warning', onClick: (row) => this.updateOnlinePaymentStatus(row.id, 'Flagged') }
    ])
  ];
  readonly handCashColumnDefs: ColDef<AdminCashRow>[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'userName', headerName: 'Name', minWidth: 160 },
    { field: 'team', headerName: 'Team', minWidth: 160 },
    { field: 'collector', headerName: 'Collector', minWidth: 150 },
    { field: 'receiptNo', headerName: 'Receipt No', minWidth: 140 },
    { field: 'amount', headerName: 'Amount', minWidth: 120, valueFormatter: (params) => `${params.value ?? '--'} INR` },
    createStatusColumn('status', 'Status', ['Received', 'Posted']),
    createActionColumn<AdminCashRow>([
      { label: 'Verify', onClick: (row) => this.updateHandCashStatus(row.id, 'Received') },
      { label: 'Post', kind: 'success', onClick: (row) => this.updateHandCashStatus(row.id, 'Posted') }
    ])
  ];
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