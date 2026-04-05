import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminGroupRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-groups',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './admin-groups.component.html'
})
export class AdminGroupsComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly deleteIcon = adminUiIcons.delete;
  groups: AdminGroupRow[] = [];
  editingGroupId: number | null = null;
  statusMessage = '';

  teamForm = this.createEmptyForm();

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  get totalCapacity(): number {
    return this.groups.reduce((total, group) => total + group.totalMembers, 0);
  }

  get filledSeats(): number {
    return this.groups.reduce((total, group) => total + group.joinedMembers, 0);
  }

  saveGroup(): void {
    if (!this.teamForm.groupName.trim()) {
      this.statusMessage = 'Enter a team name before saving.';
      return;
    }

    const payload = {
      date: this.teamForm.date,
      groupName: this.teamForm.groupName.trim().toUpperCase(),
      planAmount: this.teamForm.planAmount,
      tenureMonths: this.teamForm.tenureMonths,
      totalMembers: this.teamForm.totalMembers,
      joinedMembers: this.teamForm.joinedMembers,
      roundCompleted: this.teamForm.roundCompleted,
      spinDate: this.teamForm.spinDate,
      spinTime: this.teamForm.spinTime,
      monthlyWindow: this.teamForm.monthlyWindow,
      status: this.teamForm.status
    };

    if (this.editingGroupId) {
      this.adminConsoleStateService.updateGroup(this.editingGroupId, payload);
      this.statusMessage = 'Team updated in mock admin state.';
    } else {
      this.adminConsoleStateService.createGroup(payload);
      this.statusMessage = 'Team created in mock admin state.';
    }

    this.cancelEdit();
    this.refreshData();
  }

  editGroup(group: AdminGroupRow): void {
    this.editingGroupId = group.id;
    this.teamForm = {
      date: group.date,
      groupName: group.groupName,
      planAmount: group.planAmount,
      tenureMonths: group.tenureMonths,
      totalMembers: group.totalMembers,
      joinedMembers: group.joinedMembers,
      roundCompleted: group.roundCompleted,
      spinDate: group.spinDate,
      spinTime: group.spinTime,
      monthlyWindow: group.monthlyWindow,
      status: group.status
    };
  }

  removeGroup(id: number): void {
    this.adminConsoleStateService.deleteGroup(id);
    this.statusMessage = 'Team removed from mock admin state.';
    if (this.editingGroupId === id) {
      this.cancelEdit();
    }
    this.refreshData();
  }

  cancelEdit(): void {
    this.editingGroupId = null;
    this.teamForm = this.createEmptyForm();
  }

  private refreshData(): void {
    this.groups = this.adminConsoleStateService.getGroups();
  }

  private createEmptyForm() {
    return {
      date: '2026-04-05',
      groupName: '',
      planAmount: '500000',
      tenureMonths: 20,
      totalMembers: 20,
      joinedMembers: 0,
      roundCompleted: 0,
      spinDate: '2026-05-05',
      spinTime: '11:00 AM',
      monthlyWindow: '5th of every month',
      status: 'Open'
    };
  }
}