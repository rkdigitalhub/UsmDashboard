import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-placeholder-page',
  imports: [CommonModule],
  templateUrl: './admin-placeholder-page.component.html'
})
export class AdminPlaceholderPageComponent {
  constructor(private readonly route: ActivatedRoute) {}

  get title(): string {
    return this.route.snapshot.data['title'] ?? 'Admin Workspace';
  }
}