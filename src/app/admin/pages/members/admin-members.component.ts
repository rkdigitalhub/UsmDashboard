import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminGroupRow, type AdminMemberRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-members',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './admin-members.component.html'
})
export class AdminMembersComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly deleteIcon = adminUiIcons.delete;
  members: AdminMemberRow[] = [];
  groups: AdminGroupRow[] = [];
  selectedUserId = '';
  statusMessage = '';
  memberForm = this.createEmptyForm();

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  get profileOwner(): AdminMemberRow {
    return this.members.find((member) => member.userId === this.selectedUserId) ?? this.members[0];
  }

  editMember(member: AdminMemberRow): void {
    this.selectedUserId = member.userId;
    this.memberForm = { ...member };
  }

  saveMember(): void {
    if (!this.selectedUserId) {
      return;
    }

    this.adminConsoleStateService.updateMember(this.selectedUserId, this.memberForm);
    this.statusMessage = 'User updated in mock admin state.';
    this.refreshData();
    this.editMember(this.profileOwner);
  }

  deleteMember(userId: string): void {
    this.adminConsoleStateService.deleteMember(userId);
    this.statusMessage = 'User removed from mock admin state.';
    this.refreshData();
    if (this.members.length > 0) {
      this.editMember(this.members[0]);
    } else {
      this.selectedUserId = '';
      this.memberForm = this.createEmptyForm();
    }
  }

  private refreshData(): void {
    this.members = this.adminConsoleStateService.getMembers();
    this.groups = this.adminConsoleStateService.getGroups();
    if (!this.selectedUserId && this.members.length > 0) {
      this.editMember(this.members[0]);
    }
  }

  private createEmptyForm(): AdminMemberRow {
    return {
      id: 0,
      userId: '',
      name: '',
      mobile: '',
      username: '',
      password: '',
      sponsor: '',
      packageAmount: '500000 Rs',
      joiningDate: '2026-04-05 00:00:00',
      team: '',
      address: '',
      city: '',
      pincode: '',
      email: '',
      status: 'Active',
      bankName: '',
      branch: '',
      accountNumber: '',
      ifscCode: '',
      upiId: ''
    };
  }
}