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
  constructor(public layoutUi: LayoutUiService) {}

  get isCollapsed(): boolean {
    return this.layoutUi.sidebarCollapsed;
  }

  ngOnInit(): void {
    this.layoutUi.setSidebarCollapsed(this.layoutUi.sidebarCollapsed);
  }

  toggleSidebar(): void {
    if (window.matchMedia('(max-width: 980px)').matches) {
      this.layoutUi.toggleMobileMenu();
      return;
    }

    this.layoutUi.toggleSidebarCollapsed();
  }

  onNavItemClick(): void {
    if (window.matchMedia('(max-width: 980px)').matches) {
      this.layoutUi.closeMobileMenu();
    }
  }

  onSpinWheelClick(): void {
    this.onNavItemClick();
  }
}
