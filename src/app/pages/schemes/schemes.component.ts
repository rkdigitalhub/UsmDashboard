import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface Team {
  id: number;
  name: string;
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
    { id: 1, name: 'Team Alpha' },
    { id: 2, name: 'Team Beta' }
  ];

  availableTeams: Team[] = [
    { id: 3, name: 'Team Gamma' },
    { id: 4, name: 'Team Delta' },
    { id: 5, name: 'Team Epsilon' },
    { id: 6, name: 'Team Zeta' }
  ];

  showPopup = false;
  selectedTeam: Team | null = null;

  groupHeaders: string[] = [];
  groupRows: string[][] = [];
  groupLoading = false;
  groupError = '';

  constructor(private apiService: ApiService) {}

  subscribeTeam(team: Team): void {
    this.availableTeams = this.availableTeams.filter((item) => item.id !== team.id);
    this.myTeams = [...this.myTeams, team];
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
