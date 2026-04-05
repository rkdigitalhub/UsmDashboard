import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleQuestion,
  faIdBadge,
  faLock,
  faRightToBracket
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, FontAwesomeModule],
  selector:'app-login',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})
export class LoginComponent{
  readonly userIdIcon = faIdBadge;
  readonly passwordIcon = faLock;
  readonly helpIcon = faCircleQuestion;
  readonly loginIcon = faRightToBracket;

  userId = '';
  password = '';
  errorMessage = '';
  infoMessage = '';
  isSubmitting = false;

  constructor(private router: Router, private authService: AuthService) {}

  get canLogin(): boolean {
    const hasValidId = /^USM\d{5}$/i.test(this.userId.trim());
    const hasValidPassword = this.password.trim().length === 8;
    return hasValidId && hasValidPassword && !this.isSubmitting;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.infoMessage = '';
  }

  requestPasswordHelp(): void {
    this.errorMessage = '';
    this.infoMessage = 'Password help will be available soon once secure recovery is connected. Your login support experience is being prepared.';
  }

  login(): void {
    if (!this.canLogin) {
      this.errorMessage = 'Please enter a valid User ID (USMxxxxx) and the assigned 8-character password.';
      this.infoMessage = '';
      return;
    }

    this.errorMessage = '';
    this.infoMessage = '';
    this.isSubmitting = true;

    this.authService.login(this.userId, this.password).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          this.router.navigate([response.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard']);
        } else {
          this.errorMessage = response.message ?? 'Invalid user ID or password.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Static login data error', err);
        this.errorMessage = 'Login data could not be loaded.';
      }
    });
  }
}