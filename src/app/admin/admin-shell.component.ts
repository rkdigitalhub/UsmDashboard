import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { adminMenuIcons, adminUiIcons } from './admin-icons';
import { adminNavSections, type AdminIconKey } from './admin-navigation';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-shell',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, FontAwesomeModule],
  templateUrl: './admin-shell.component.html'
})
export class AdminShellComponent implements OnInit, OnDestroy {
  private readonly sidebarStateStorageKey = 'adminSidebarCollapsed';
  private readonly destroyRef = inject(DestroyRef);
  readonly mobileMenuIcon = adminUiIcons.mobileMenu;
  readonly collapseLeftIcon = adminUiIcons.collapseLeft;
  readonly collapseRightIcon = adminUiIcons.collapseRight;
  readonly navSections = adminNavSections;
  sidebarOpen = false;
  sidebarCollapsed = false;
  profileMenuOpen = false;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  get currentUserName(): string {
    return this.authService.getCurrentUser()?.name ?? 'Administrator';
  }

  get currentDateLabel(): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date());
  }

  get currentPageTitle(): string {
    return this.getCurrentRouteData('title', 'Dashboard');
  }

  get currentSectionTitle(): string {
    return this.getCurrentRouteData('section', 'Overview');
  }

  get adminInitials(): string {
    return this.currentUserName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getMenuIcon(icon: AdminIconKey): IconDefinition {
    return adminMenuIcons[icon] ?? adminUiIcons.warning;
  }

  ngOnInit(): void {
    document.body.classList.add('admin-mode');

    this.sidebarCollapsed = localStorage.getItem(this.sidebarStateStorageKey) === 'true';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.sidebarOpen = false;
        this.profileMenuOpen = false;
      });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('admin-mode');
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDesktopSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem(this.sidebarStateStorageKey, String(this.sidebarCollapsed));
  }

  toggleProfileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  signOut(): void {
    this.profileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.profileMenuOpen = false;
  }

  private getCurrentRouteData(key: 'section' | 'title', fallback: string): string {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.snapshot.data[key] ?? fallback;
  }
}