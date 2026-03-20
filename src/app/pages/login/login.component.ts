import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf],
  selector:'app-login',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})
export class LoginComponent{

  userId = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private router: Router, private apiService: ApiService) {}

  get canLogin(): boolean {
    const hasValidId = /^USM/.test(this.userId) && this.userId.length === 8;
    const hasValidPassword = this.password.length >= 6;
    return hasValidId && hasValidPassword && !this.isSubmitting;
  }

  clearError() {
    this.errorMessage = '';
  }

  login() {
    if (!this.canLogin) {
      this.errorMessage = 'Please enter a valid User ID (USMxxxx) and a password of at least 6 characters.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.apiService.login(this.userId, this.password).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response && response.status && response.status.toLowerCase() === 'success') {
          this.apiService.getIndex().subscribe({
            next: (indexResponse) => {
              console.log('index.php response:', indexResponse);
              this.router.navigate(['/dashboard']);
            },
            error: (indexErr) => {
              console.error('index.php API error', indexErr);
              this.router.navigate(['/dashboard']);
            }
          });
        } else {
          const serverMessage = response && response.message ? response.message : 'Invalid username or password.';
          this.errorMessage = serverMessage;
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Login API error', err);
        this.errorMessage = 'Login failed. Please check your network and try again.';
      }
    });
  }

}