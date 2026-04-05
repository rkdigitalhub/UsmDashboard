import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { LayoutUiService } from '../../services/layout-ui.service';
import { memberSidebarItems, memberIcons, type MemberNavItem } from '../../member/member-navigation';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly collapseIcon = memberIcons.collapse;
  readonly navigationItems = memberSidebarItems;

  constructor(public layoutUi: LayoutUiService) {}

  get isCollapsed(): boolean {
    return this.layoutUi.sidebarCollapsed;
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

  getIcon(item: MemberNavItem) {
    return memberIcons[item.icon];
  }
}
