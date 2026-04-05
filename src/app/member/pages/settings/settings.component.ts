import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { memberIcons } from '../../member-icons';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  readonly settingsIcon = memberIcons.settings;
  readonly passwordIcon = memberIcons.password;
  readonly closeIcon = memberIcons.close;
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
