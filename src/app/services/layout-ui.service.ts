import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutUiService {
  private readonly sidebarStorageKey = 'memberSidebarCollapsed';
  private readonly mobileMenuOpenState = signal(false);
  private readonly sidebarCollapsedState = signal(this.readSidebarCollapsed());

  constructor() {
    this.applySidebarWidth();
  }

  get mobileMenuOpen(): boolean {
    return this.mobileMenuOpenState();
  }

  get sidebarCollapsed(): boolean {
    return this.sidebarCollapsedState();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpenState.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpenState.set(false);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedState.set(collapsed);
    localStorage.setItem(this.sidebarStorageKey, String(collapsed));
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

  private readSidebarCollapsed(): boolean {
    return localStorage.getItem(this.sidebarStorageKey) === 'true';
  }
}
