import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LayoutUiService } from '../../services/layout-ui.service';
import { memberIcons } from '../../member/member-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  readonly menuIcon = memberIcons.menu;
  readonly logoutIcon = memberIcons.logout;
  readonly profileIcon = memberIcons.profile;
  pageTitle = 'Dashboard';
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly layoutUi: LayoutUiService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateTitle();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateTitle());
  }

  private updateTitle(): void {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.pageTitle = route.snapshot.data['title'] ?? 'Dashboard';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleMenu(): void {
    this.layoutUi.toggleMobileMenu();
  }
}
