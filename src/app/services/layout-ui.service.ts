import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutUiService {
  mobileMenuOpen = false;
  sidebarCollapsed = false;

  constructor() {
    this.applySidebarWidth();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
    this.applySidebarWidth();
  }

  toggleSidebarCollapsed(): void {
    this.setSidebarCollapsed(!this.sidebarCollapsed);
  }

  private applySidebarWidth(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const width = this.sidebarCollapsed ? '84px' : '220px';
    document.documentElement.style.setProperty('--sidebar-width', width);
  }
}
