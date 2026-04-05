import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminMemberRow, type AdminWinnerRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-winners',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './admin-winners.component.html'
})
export class AdminWinnersComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly releaseIcon = adminUiIcons.release;
  readonly deleteIcon = adminUiIcons.delete;
  winners: AdminWinnerRow[] = [];
  members: AdminMemberRow[] = [];
  editingWinnerId: number | null = null;
  statusMessage = '';
  winnerForm = this.createEmptyForm();

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  onWinnerUserChange(): void {
    const member = this.members.find((entry) => entry.userId === this.winnerForm.userId);
    if (!member) {
      return;
    }

    this.winnerForm.name = member.name;
    this.winnerForm.group = member.team;
  }

  saveWinner(): void {
    const payload = {
      group: this.winnerForm.group,
      userId: this.winnerForm.userId,
      name: this.winnerForm.name,
      month: this.winnerForm.month,
      prize: this.winnerForm.prize,
      settlementMode: this.winnerForm.settlementMode,
      status: this.winnerForm.status
    };

    if (this.editingWinnerId) {
      this.adminConsoleStateService.updateWinner(this.editingWinnerId, payload);
      this.statusMessage = 'Winner updated in mock admin state.';
    } else {
      this.adminConsoleStateService.createWinner(payload);
      this.statusMessage = 'Winner assigned in mock admin state.';
    }

    this.cancelEdit();
    this.refreshData();
  }

  editWinner(winner: AdminWinnerRow): void {
    this.editingWinnerId = winner.id;
    this.winnerForm = { ...winner };
  }

  releaseWinner(id: number): void {
    this.adminConsoleStateService.updateWinner(id, { status: 'Released' });
    this.statusMessage = 'Winner marked as released.';
    this.refreshData();
  }

  deleteWinner(id: number): void {
    this.adminConsoleStateService.deleteWinner(id);
    this.statusMessage = 'Winner removed from mock admin state.';
    this.refreshData();
    if (this.editingWinnerId === id) {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingWinnerId = null;
    this.winnerForm = this.createEmptyForm();
  }

  private refreshData(): void {
    this.winners = this.adminConsoleStateService.getWinners();
    this.members = this.adminConsoleStateService.getMembers();
  }

  private createEmptyForm(): AdminWinnerRow {
    return {
      id: 0,
      group: '',
      userId: '',
      name: '',
      month: '2026-05',
      prize: '₹20,000',
      settlementMode: 'Bank transfer',
      status: 'Awaiting release'
    };
  }
}