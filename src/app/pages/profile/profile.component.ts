import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, SafeAppUser } from '../../services/auth.service';

interface UserProfile {
  name: string;
  address: string;
  city: string;
  mobile: string;
  email: string;
  pincode: string;
}

interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
}

@Component({
  standalone: true,
  imports: [FormsModule, NgIf],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUserId = '';

  profile: UserProfile = {
    name: '',
    address: '',
    city: '',
    mobile: '',
    email: '',
    pincode: ''
  };

  bankDetails: BankDetails = {
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    upiId: ''
  };

  savedMessage = '';
  private messageTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.loadCurrentUserProfile();
  }

  private loadCurrentUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    this.currentUserId = currentUser.userId;

    this.profile = {
      name: currentUser.name,
      address: currentUser.address ?? '',
      city: currentUser.location,
      mobile: currentUser.mobile ?? '',
      email: currentUser.email ?? '',
      pincode: ''
    };

    const pincodeMatch = (currentUser.address ?? '').match(/(\d{6})(?!.*\d)/);
    if (pincodeMatch) {
      this.profile.pincode = pincodeMatch[1];
    }

    this.bankDetails = {
      accountHolder: currentUser.name,
      bankName: currentUser.bankName,
      accountNumber: currentUser.accountNumber ?? '',
      ifscCode: currentUser.ifscCode ?? '',
      branch: currentUser.branch,
      upiId: ''
    };

    this.mergeSavedProfile(currentUser);
  }

  private mergeSavedProfile(currentUser: SafeAppUser): void {
    const savedProfileKey = this.getUserProfileStorageKey(currentUser.userId);
    const savedBankKey = this.getUserBankStorageKey(currentUser.userId);

    const savedProfile = localStorage.getItem(savedProfileKey);
    if (savedProfile) {
      try {
        this.profile = { ...this.profile, ...JSON.parse(savedProfile) as Partial<UserProfile> };
      } catch {
        localStorage.removeItem(savedProfileKey);
      }
    }

    const savedBank = localStorage.getItem(savedBankKey);
    if (savedBank) {
      try {
        this.bankDetails = { ...this.bankDetails, ...JSON.parse(savedBank) as Partial<BankDetails> };
      } catch {
        localStorage.removeItem(savedBankKey);
      }
    }
  }

  private getUserProfileStorageKey(userId: string): string {
    return `userProfile:${userId}`;
  }

  private getUserBankStorageKey(userId: string): string {
    return `userBankDetails:${userId}`;
  }

  saveProfile() {
    if (!this.currentUserId) {
      return;
    }

    this.savedMessage = 'Profile updates will be available soon once security system is upgraded. Your current details stay safely as they are for now.';

    if (this.messageTimeoutId) {
      clearTimeout(this.messageTimeoutId);
    }

    this.messageTimeoutId = setTimeout(() => {
      this.savedMessage = '';
      this.messageTimeoutId = null;
    }, 3500);
  }
}
