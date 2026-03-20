import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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

  constructor(private apiService: ApiService) {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        this.profile = JSON.parse(saved);
      } catch {
        this.profile = this.profile;
      }
    }

    const savedBank = localStorage.getItem('userBankDetails');
    if (savedBank) {
      try {
        this.bankDetails = JSON.parse(savedBank);
      } catch {
        this.bankDetails = this.bankDetails;
      }
    }
  }

  ngOnInit(): void {
    this.loadServerProfile();
    this.loadServerBankDetails();
  }

  loadServerProfile() {
    this.apiService.getProfilePage().subscribe({
      next: (htmlText) => {
        this.mapProfileFromHtml(htmlText);
      },
      error: (err) => {
        console.error('Failed loading profile.php', err);
      }
    });
  }

  loadServerBankDetails() {
    this.apiService.getBankPage().subscribe({
      next: (htmlText) => {
        this.mapBankDetailsFromHtml(htmlText);
      },
      error: (err) => {
        console.error('Failed loading bank.php', err);
      }
    });
  }

  private mapProfileFromHtml(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const extractByName = (name: string) => {
      const el = doc.querySelector(`[name="${name}"]`) as HTMLInputElement | null;
      return el ? el.value : '';
    };

    // Fallback: if profile page contains text fields not using known names,
    // adjust selectors accordingly.
    const name = extractByName('name');
    if (name) {
      this.profile.name = name;
    }

    const address = extractByName('address');
    if (address) {
      this.profile.address = address;
    }

    const city = extractByName('city');
    if (city) {
      this.profile.city = city;
    }

    const mobile = extractByName('mobile');
    if (mobile) {
      this.profile.mobile = mobile;
    }

    const email = extractByName('email');
    if (email) {
      this.profile.email = email;
    }

    const pincode = extractByName('pincode');
    if (pincode) {
      this.profile.pincode = pincode;
    }
  }

  private mapBankDetailsFromHtml(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const extractByNames = (names: string[]) => {
      for (const name of names) {
        const el = doc.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el && el.value) {
          return el.value;
        }
      }
      return '';
    };

    const accountHolder = extractByNames(['account_holder', 'holder_name', 'acc_holder', 'name']);
    if (accountHolder) {
      this.bankDetails.accountHolder = accountHolder;
    }

    const bankName = extractByNames(['bank_name', 'bank', 'bname']);
    if (bankName) {
      this.bankDetails.bankName = bankName;
    }

    const accountNumber = extractByNames(['account_no', 'account_number', 'acc_no']);
    if (accountNumber) {
      this.bankDetails.accountNumber = accountNumber;
    }

    const ifscCode = extractByNames(['ifsc', 'ifsc_code', 'ifsccode']);
    if (ifscCode) {
      this.bankDetails.ifscCode = ifscCode;
    }

    const branch = extractByNames(['branch', 'bank_branch']);
    if (branch) {
      this.bankDetails.branch = branch;
    }

    const upiId = extractByNames(['upi', 'upi_id', 'upiid']);
    if (upiId) {
      this.bankDetails.upiId = upiId;
    }
  }

  saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
    localStorage.setItem('userBankDetails', JSON.stringify(this.bankDetails));
    this.savedMessage = 'Profile and bank details saved successfully.';
    setTimeout(() => (this.savedMessage = ''), 3000);
  }
}
