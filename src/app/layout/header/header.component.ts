import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LayoutUiService } from '../../services/layout-ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard';

  constructor(private router: Router, private layoutUi: LayoutUiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateTitle(this.router.url);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateTitle(event.urlAfterRedirects || event.url));
  }

  private updateTitle(url: string) {
    const route = url.split('?')[0].replace(/^\//, '');

    const titleMap: Record<string, string> = {
      '': 'Login',
      'dashboard': 'Dashboard',
      'teams': 'Teams',
      'schemes': 'Teams',
      'users': 'Users',
      'spin-wheel': 'Spin Wheel',
      'transactions': 'Transactions',
      'reports': 'Reports',
      'my-referrals': 'My Referrals',
      'settings': 'Settings',
      'profile': 'Profile'
    };

    this.pageTitle = titleMap[route] || 'Page';
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
