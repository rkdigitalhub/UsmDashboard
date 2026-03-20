import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface Team {
  id: number;
  name: string;
  subscribedCount: number;
  startingDate: string;
  luckyDrawSelectedOn?: string;
}

@Component({
  standalone: true,
  selector: 'app-schemes',
  imports: [CommonModule],
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent {
  myTeams: Team[] = [
    { id: 1, name: 'THE SPARTANS', subscribedCount: 14, startingDate: '05 Apr 2026' },
    {
      id: 2,
      name: 'THE AVENGERS',
      subscribedCount: 18,
      startingDate: '12 Apr 2026',
      luckyDrawSelectedOn: '14 Mar 2026, 08:45 PM'
    }
  ];

  availableTeams: Team[] = [
    { id: 3, name: 'Team Gamma', subscribedCount: 9, startingDate: '20 Apr 2026' },
    { id: 4, name: 'Team Delta', subscribedCount: 12, startingDate: '24 Apr 2026' },
    { id: 5, name: 'Team Epsilon', subscribedCount: 16, startingDate: '28 Apr 2026' },
    { id: 6, name: 'Team Zeta', subscribedCount: 7, startingDate: '02 May 2026' }
  ];

  showPopup = false;
  selectedTeam: Team | null = null;
  showSelectionPopup = false;
  selectedClosedTeam: Team | null = null;
  showSubscribePopup = false;
  selectedSubscribeTeam: Team | null = null;
  subscribeMessage = '';
  private pendingApprovalTeamIds = new Set<number>();

  groupHeaders: string[] = [];
  groupRows: string[][] = [];
  groupLoading = false;
  groupError = '';

  constructor(private apiService: ApiService) {}

  openSubscribePopup(team: Team): void {
    this.selectedSubscribeTeam = team;
    this.showSubscribePopup = true;
  }

  closeSubscribePopup(): void {
    this.showSubscribePopup = false;
    this.selectedSubscribeTeam = null;
  }

  submitSubscribeRequest(): void {
    if (!this.selectedSubscribeTeam) {
      return;
    }

    this.pendingApprovalTeamIds.add(this.selectedSubscribeTeam.id);
    this.subscribeMessage = 'Your request has been submitted, admin will contact you for further updates!';
    this.closeSubscribePopup();
  }

  isPendingApproval(teamId: number): boolean {
    return this.pendingApprovalTeamIds.has(teamId);
  }

  isTeamClosed(team: Team): boolean {
    return Boolean(team.luckyDrawSelectedOn);
  }

  openSelectionPopup(team: Team): void {
    if (!team.luckyDrawSelectedOn) {
      return;
    }
    this.selectedClosedTeam = team;
    this.showSelectionPopup = true;
  }

  closeSelectionPopup(): void {
    this.showSelectionPopup = false;
    this.selectedClosedTeam = null;
  }

  openTeamDetails(team: Team): void {
    this.selectedTeam = team;
    this.showPopup = true;
    this.loadGroupData();
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedTeam = null;
  }

  private loadGroupData(): void {
    this.groupLoading = true;
    this.groupError = '';
    this.groupHeaders = [];
    this.groupRows = [];

    this.apiService.getGroupPage().subscribe({
      next: (htmlText) => {
        this.mapGroupTableFromHtml(htmlText);
        this.groupLoading = false;
      },
      error: () => {
        this.groupLoading = false;
        this.groupError = 'Unable to load group details.';
      }
    });
  }

  private mapGroupTableFromHtml(html: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      this.groupError = 'No table found in group data.';
      return;
    }

    const headerCells = Array.from(table.querySelectorAll('thead th')).map((cell) => this.cleanText(cell.textContent));
    if (headerCells.length) {
      this.groupHeaders = headerCells;
    }

    const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
    const rowsSource = bodyRows.length ? bodyRows : Array.from(table.querySelectorAll('tr'));

    const parsedRows = rowsSource
      .map((row) => Array.from(row.querySelectorAll('td')).map((cell) => this.cleanText(cell.textContent)))
      .filter((cells) => cells.length > 0);

    if (!this.groupHeaders.length && parsedRows.length) {
      this.groupHeaders = parsedRows[0].map((_, index) => `Column ${index + 1}`);
    }

    this.groupRows = parsedRows;

    if (!this.groupRows.length) {
      this.groupError = 'No rows found in group data.';
    }
  }

  private cleanText(value: string | null): string {
    return (value || '').replace(/\s+/g, ' ').trim();
  }
}
