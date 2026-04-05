import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type AdminGroupRow, type AdminSpinScheduleRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';

@Component({
  standalone: true,
  selector: 'app-admin-spin-schedule',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './admin-spin-schedule.component.html'
})
export class AdminSpinScheduleComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly deleteIcon = adminUiIcons.delete;
  schedules: AdminSpinScheduleRow[] = [];
  groups: AdminGroupRow[] = [];
  editingScheduleId: number | null = null;
  statusMessage = '';
  scheduleForm = this.createEmptyForm();

  constructor(private readonly adminConsoleStateService: AdminConsoleStateService) {
    this.refreshData();
  }

  saveSchedule(): void {
    const payload = {
      team: this.scheduleForm.team,
      month: this.scheduleForm.month,
      round: this.scheduleForm.round,
      date: this.scheduleForm.date,
      time: this.scheduleForm.time,
      timezone: this.scheduleForm.timezone,
      window: this.scheduleForm.window,
      status: this.scheduleForm.status
    };

    if (this.editingScheduleId) {
      this.adminConsoleStateService.updateSchedule(this.editingScheduleId, payload);
      this.statusMessage = 'Spin schedule updated in mock admin state.';
    } else {
      this.adminConsoleStateService.createSchedule(payload);
      this.statusMessage = 'Spin schedule created in mock admin state.';
    }

    this.cancelEdit();
    this.refreshData();
  }

  editSchedule(schedule: AdminSpinScheduleRow): void {
    this.editingScheduleId = schedule.id;
    this.scheduleForm = { ...schedule };
  }

  deleteSchedule(id: number): void {
    this.adminConsoleStateService.deleteSchedule(id);
    this.statusMessage = 'Spin schedule removed from mock admin state.';
    this.refreshData();
    if (this.editingScheduleId === id) {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingScheduleId = null;
    this.scheduleForm = this.createEmptyForm();
  }

  private refreshData(): void {
    this.schedules = this.adminConsoleStateService.getSchedules();
    this.groups = this.adminConsoleStateService.getGroups();
  }

  private createEmptyForm(): AdminSpinScheduleRow {
    return {
      id: 0,
      team: '',
      month: 'May 2026',
      round: 1,
      date: '2026-05-05',
      time: '11:00 AM',
      timezone: 'IST',
      window: 'Visible on exact start time',
      status: 'Scheduled'
    };
  }
}