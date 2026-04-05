import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { type AdminGroupRow, type AdminMemberRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { createActionColumn, createStatusColumn } from '../../../shared/components/data-grid/grid-helpers';

@Component({
  standalone: true,
  selector: 'app-admin-members',
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatFormFieldModule, MatSelectModule, DataGridComponent],
  templateUrl: './admin-members.component.html'
})
export class AdminMembersComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly deleteIcon = adminUiIcons.delete;
  readonly memberColumnDefs: ColDef<AdminMemberRow>[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'name', headerName: 'Name', minWidth: 170 },
    { field: 'mobile', headerName: 'Mobile', minWidth: 140 },
    { field: 'joiningDate', headerName: 'Joining Date', minWidth: 170 },
    { field: 'team', headerName: 'Team', minWidth: 170 },
    createStatusColumn('status', 'Status', ['Active']),
    createActionColumn<AdminMemberRow>([
      { label: 'Edit', onClick: (row) => this.editMember(row) },
      { label: 'Delete', kind: 'danger', onClick: (row) => this.deleteMember(row.userId) }
    ])
  ];
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
      packageAmount: '500000 INR',
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