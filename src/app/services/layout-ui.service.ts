import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutUiService {
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
