import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
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
  private readonly destroyRef = inject(DestroyRef);

  private loadingStart = 0;
  private loadingTimeout = 0;
  private readonly minLoadingMs = 250;

  constructor(private router: Router, public layoutUi: LayoutUiService) {
    this.updateLayout(this.router.url);

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
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
    this.showLayout = path !== '/' && !path.startsWith('/admin');
  }
}
