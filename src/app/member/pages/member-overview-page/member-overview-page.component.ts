import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';
import { memberIcons, type MemberIconKey } from '../../member-icons';

@Component({
  standalone: true,
  selector: 'app-member-overview-page',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './member-overview-page.component.html',
  styleUrls: ['./member-overview-page.component.scss']
})
export class MemberOverviewPageComponent {
  constructor(private readonly route: ActivatedRoute) {}

  get title(): string {
    return this.route.snapshot.data['title'] ?? 'Overview';
  }

  get description(): string {
    return this.route.snapshot.data['description'] ?? '';
  }

  get icon() {
    const iconKey = (this.route.snapshot.data['iconKey'] ?? 'dashboard') as MemberIconKey;
    return memberIcons[iconKey] ?? memberIcons.dashboard;
  }
}