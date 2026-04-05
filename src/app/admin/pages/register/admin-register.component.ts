import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type AdminGroupRow } from '../../admin-mock-data';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-register.component.html'
})
export class AdminRegisterComponent {
  groups: AdminGroupRow[] = [];
  statusMessage = '';

  memberForm!: ReturnType<AdminRegisterComponent['createEmptyForm']>;

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
    this.memberForm = this.createEmptyForm();
  }

  get nextUserId(): string {
    return this.memberForm.userId;
  }

  createMember(): void {
    this.adminConsoleStateService.createMember({
      userId: this.memberForm.userId,
      name: this.memberForm.name,
      mobile: this.memberForm.mobile,
      username: this.memberForm.username,
      password: this.memberForm.password,
      sponsor: this.memberForm.sponsor,
      packageAmount: `${this.memberForm.planAmount} Rs`,
      joiningDate: `${this.memberForm.joiningDate} 00:00:00`,
      team: this.memberForm.team,
      address: this.memberForm.address,
      city: this.memberForm.city,
      pincode: this.memberForm.pincode,
      email: this.memberForm.email,
      status: 'Active',
      bankName: '',
      branch: '',
      accountNumber: '',
      ifscCode: '',
      upiId: ''
    });

    this.statusMessage = 'User created and assigned in mock admin state.';
    this.resetForm();
    this.refreshData();
  }

  resetForm(): void {
    this.memberForm = this.createEmptyForm();
  }

  private refreshData(): void {
    this.groups = this.adminConsoleStateService.getGroups();
  }

  private createEmptyForm() {
    const nextId = this.adminConsoleStateService.getMembers().length + 1;
    const userId = `USM${String(98000 + nextId).padStart(5, '0')}`;
    return {
      userId,
      planAmount: '500000',
      team: this.adminConsoleStateService.getGroups()[0]?.groupName ?? '',
      sponsor: 'USM90001',
      name: '',
      mobile: '',
      email: '',
      address: '',
      city: '',
      pincode: '',
      username: userId,
      password: 'N4P8Q2LM',
      joiningDate: '2026-04-05'
    };
  }
}