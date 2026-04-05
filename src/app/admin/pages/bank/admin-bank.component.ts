import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { type AdminBankProfileRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { createActionColumn } from '../../../shared/components/data-grid/grid-helpers';

@Component({
  standalone: true,
  selector: 'app-admin-bank',
  imports: [CommonModule, FormsModule, FontAwesomeModule, DataGridComponent],
  templateUrl: './admin-bank.component.html'
})
export class AdminBankComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly refreshIcon = adminUiIcons.refresh;
  readonly profileColumnDefs: ColDef<AdminBankProfileRow>[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'name', headerName: 'Name', minWidth: 160 },
    { field: 'team', headerName: 'Team', minWidth: 160 },
    { field: 'bankName', headerName: 'Bank Name', minWidth: 180 },
    { field: 'branch', headerName: 'Branch', minWidth: 150 },
    { field: 'accountNumber', headerName: 'Account Number', minWidth: 180 },
    { field: 'ifscCode', headerName: 'IFSC', minWidth: 130 },
    createActionColumn<AdminBankProfileRow>([
      { label: 'Edit', onClick: (row) => this.editProfile(row) }
    ])
  ];
  profiles: AdminBankProfileRow[] = [];
  selectedUserId = '';
  statusMessage = '';
  bankForm: AdminBankProfileRow = this.createEmptyForm();

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  editProfile(profile: AdminBankProfileRow): void {
    this.selectedUserId = profile.userId;
    this.bankForm = { ...profile };
  }

  saveProfile(): void {
    if (!this.selectedUserId) {
      return;
    }

    this.adminConsoleStateService.updateBankProfile(this.selectedUserId, this.bankForm);
    this.statusMessage = 'Bank profile updated in mock admin state.';
    this.refreshData();
  }

  applyBulkTemplate(): void {
    this.adminConsoleStateService.applyBulkBankTemplate();
    this.statusMessage = 'Mock bank template applied.';
    this.refreshData();
  }

  private refreshData(): void {
    this.profiles = this.adminConsoleStateService.getBankProfiles();
    if (!this.selectedUserId && this.profiles.length > 0) {
      this.editProfile(this.profiles[0]);
    }
  }

  private createEmptyForm(): AdminBankProfileRow {
    return {
      userId: '',
      name: '',
      team: '',
      bankName: '',
      branch: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      address: ''
    };
  }
}