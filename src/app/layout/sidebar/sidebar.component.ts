import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutUiService } from '../../services/layout-ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;

  constructor(public layoutUi: LayoutUiService) {}

  ngOnInit(): void {
    this.applySidebarWidth();
  }

  toggleSidebar(): void {
    if (window.matchMedia('(max-width: 980px)').matches) {
      this.layoutUi.toggleMobileMenu();
      return;
    }

    this.isCollapsed = !this.isCollapsed;
    this.applySidebarWidth();
  }

  onNavItemClick(): void {
    if (window.matchMedia('(max-width: 980px)').matches) {
      this.layoutUi.closeMobileMenu();
    }
  }

  private applySidebarWidth(): void {
    const width = this.isCollapsed ? '84px' : '220px';
    document.documentElement.style.setProperty('--sidebar-width', width);
  }
}
