import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { type AdminGroupRow, type AdminSpinScheduleRow } from '../../admin-mock-data';
import { adminUiIcons } from '../../admin-icons';
import { AdminConsoleStateService } from '../../services/admin-console-state.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { createActionColumn, createStatusColumn } from '../../../shared/components/data-grid/grid-helpers';

@Component({
  standalone: true,
  selector: 'app-admin-spin-schedule',
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatFormFieldModule, MatSelectModule, DataGridComponent],
  templateUrl: './admin-spin-schedule.component.html'
})
export class AdminSpinScheduleComponent {
  readonly editIcon = adminUiIcons.edit;
  readonly deleteIcon = adminUiIcons.delete;
  readonly scheduleColumnDefs: ColDef<AdminSpinScheduleRow>[] = [
    { field: 'team', headerName: 'Team', minWidth: 170 },
    { field: 'month', headerName: 'Month', minWidth: 140 },
    { field: 'round', headerName: 'Round', minWidth: 110 },
    { field: 'date', headerName: 'Date', minWidth: 130 },
    { field: 'time', headerName: 'Time', minWidth: 120 },
    createStatusColumn('status', 'Status', ['Scheduled']),
    createActionColumn<AdminSpinScheduleRow>([
      { label: 'Edit', onClick: (row) => this.editSchedule(row) },
      { label: 'Delete', kind: 'danger', onClick: (row) => this.deleteSchedule(row.id) }
    ])
  ];
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