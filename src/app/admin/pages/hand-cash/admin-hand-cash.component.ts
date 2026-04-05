import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { type AdminCashRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { createActionColumn, createStatusColumn } from '../../../shared/components/data-grid/grid-helpers';

@Component({
  standalone: true,
  selector: 'app-admin-hand-cash',
  imports: [CommonModule, FontAwesomeModule, DataGridComponent],
  templateUrl: './admin-hand-cash.component.html'
})
export class AdminHandCashComponent {
  readonly exportIcon = adminUiIcons.export;
  readonly verifyIcon = adminUiIcons.verify;
  readonly postIcon = adminUiIcons.post;
  readonly paymentColumnDefs: ColDef<AdminCashRow>[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'userName', headerName: 'Name', minWidth: 160 },
    { field: 'team', headerName: 'Team', minWidth: 160 },
    { field: 'collector', headerName: 'Collector', minWidth: 150 },
    { field: 'receivedOn', headerName: 'Received On', minWidth: 140 },
    { field: 'receiptNo', headerName: 'Receipt No', minWidth: 140 },
    { field: 'amount', headerName: 'Amount', minWidth: 120, valueFormatter: (params) => `${params.value ?? '--'} INR` },
    createStatusColumn('status', 'Status', ['Received', 'Posted']),
    createActionColumn<AdminCashRow>([
      { label: 'Verify', onClick: (row) => this.updatePaymentStatus(row.id, 'Received') },
      { label: 'Post', kind: 'success', onClick: (row) => this.updatePaymentStatus(row.id, 'Posted') }
    ])
  ];
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