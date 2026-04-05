import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  showChangePasswordPopup = false;
  currentPassword = '';
  newPassword = '';
  reenterPassword = '';
  statusMessage = '';

  openChangePasswordPopup(): void {
    this.statusMessage = '';
    this.showChangePasswordPopup = true;
  }

  closeChangePasswordPopup(): void {
    this.showChangePasswordPopup = false;
    this.statusMessage = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.reenterPassword = '';
  }

  changePassword(): void {
    this.statusMessage = 'Password changes will be enabled soon after security settings are upgraded. Your current password stays active for now.';
    this.currentPassword = '';
    this.newPassword = '';
    this.reenterPassword = '';
  }
}
