import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminBankProfileRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-bank',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './admin-bank.component.html'
})
export class AdminBankComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly refreshIcon = adminUiIcons.refresh;
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