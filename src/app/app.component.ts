import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutUiService } from './services/layout-ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'USM Dashboard';
  showLayout = false;
  isLoading = false;

  private loadingStart = 0;
  private loadingTimeout = 0;
  private readonly minLoadingMs = 1500;

  navItems = [
    { label: 'Home', link: '#' },
    { label: 'Analytics', link: '#' },
    { label: 'Reports', link: '#' },
    { label: 'Settings', link: '#' }
  ];

  welcomeMessage = 'Monitor your data and insights here.';

  constructor(private router: Router, public layoutUi: LayoutUiService) {
    // Ensure we set layout visibility for the initial load.
    this.updateLayout(this.router.url);

    // Update layout visibility and loading indicator on navigation events.
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.setLoading(true);
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.setLoading(false);
      }

      if (event instanceof NavigationEnd) {
        const url = (event.urlAfterRedirects || event.url).split('?')[0];
        this.updateLayout(url);
        this.layoutUi.closeMobileMenu();
      }
    });
  }

  private setLoading(loading: boolean) {
    if (loading) {
      this.loadingStart = Date.now();
      this.isLoading = true;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = 0;
      }
      return;
    }

    const elapsed = Date.now() - this.loadingStart;
    const remaining = Math.max(0, this.minLoadingMs - elapsed);

    if (remaining > 0) {
      this.loadingTimeout = window.setTimeout(() => {
        this.isLoading = false;
        this.loadingTimeout = 0;
      }, remaining);
    } else {
      this.isLoading = false;
    }
  }

  private updateLayout(url: string) {
    const path = url.split('?')[0];
    this.showLayout = path !== '/';
  }
}
