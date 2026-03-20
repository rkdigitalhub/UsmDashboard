import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-my-referrals',
  imports: [NgIf, NgFor],
  templateUrl: './my-referrals.component.html',
  styleUrls: ['./my-referrals.component.scss']
})
export class MyReferralsComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  headers: string[] = [];
  rows: string[][] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadReferrals();
  }

  loadReferrals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getDirectReferralsPage().subscribe({
      next: (htmlText) => {
        this.isLoading = false;
        this.mapReferralsFromHtml(htmlText);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load referrals right now.';
        console.error('Direct referrals API error', err);
      }
    });
  }

  private mapReferralsFromHtml(html: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = Array.from(doc.querySelectorAll('table'));

    if (!tables.length) {
      this.errorMessage = 'No referral table found in API response.';
      this.headers = [];
      this.rows = [];
      return;
    }

    const picked = this.pickBestTable(tables);
    const headers = Array.from(picked.querySelectorAll('thead th'))
      .map((th) => th.textContent?.trim() ?? '')
      .filter(Boolean);

    const bodyRows = Array.from(picked.querySelectorAll('tbody tr'));
    const rows = bodyRows
      .map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent?.trim() ?? ''))
      .filter((cells) => cells.some((cell) => cell.length > 0));

    if (!headers.length && rows.length) {
      this.headers = rows[0].map((_, index) => `Column ${index + 1}`);
    } else {
      this.headers = headers;
    }

    this.rows = rows;

    if (!this.rows.length) {
      this.errorMessage = 'No referral records available.';
    }
  }

  private pickBestTable(tables: HTMLTableElement[]): HTMLTableElement {
    const keywords = ['referral', 'direct', 'sponsor', 'member', 'name', 'mobile', 'id'];
    let bestTable = tables[0];
    let bestScore = -1;

    for (const table of tables) {
      const tableText = (table.textContent || '').toLowerCase();
      const rowCount = table.querySelectorAll('tbody tr').length;
      const score = keywords.reduce((acc, key) => acc + (tableText.includes(key) ? 1 : 0), 0) + rowCount;

      if (score > bestScore) {
        bestScore = score;
        bestTable = table;
      }
    }

    return bestTable;
  }
}
