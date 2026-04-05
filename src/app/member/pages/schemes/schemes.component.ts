import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef } from 'ag-grid-community';
import { AuthService, AppUser } from '../../../services/auth.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { memberIcons } from '../../member-icons';

interface Team {
  id: number;
  name: string;
  subscribedCount: number;
  startingDate: string;
  investmentAmount: number;
  tenureMonths: number;
  luckyDrawSelectedOn?: string;
}

@Component({
  standalone: true,
  selector: 'app-schemes',
  imports: [CommonModule, FontAwesomeModule, DataGridComponent],
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent implements OnInit {
  readonly teamsIcon = memberIcons.teams;
  readonly detailsIcon = memberIcons.details;
  readonly subscribeIcon = memberIcons.subscribe;
  readonly closeIcon = memberIcons.close;
  myTeams: Team[] = [];

  availableTeams: Team[] = [];

  showPopup = false;
  selectedTeam: Team | null = null;
  showSelectionPopup = false;
  selectedClosedTeam: Team | null = null;
  showSubscribePopup = false;
  selectedSubscribeTeam: Team | null = null;
  subscribeMessage = '';
  private pendingApprovalTeamIds = new Set<number>();

  readonly groupColumnDefs: ColDef[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 140 },
    { field: 'name', headerName: 'Name', minWidth: 180 },
    { field: 'location', headerName: 'Location', minWidth: 180 }
  ];
  groupRows: Array<{ userId: string; name: string; location: string }> = [];
  groupLoading = false;
  groupError = '';

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.bindTeams(users);
      },
      error: () => {
        this.bindTeams([]);
        this.groupError = 'Unable to load team users.';
      }
    });
  }

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
    this.groupRows = [];

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.mapGroupTableFromUsers(users);
        this.groupLoading = false;
      },
      error: () => {
        this.groupLoading = false;
        this.groupError = 'Unable to load group details.';
      }
    });
  }

  private bindTeams(users: AppUser[]): void {
    const subscribedCount = users.length;
    this.myTeams = [{
      id: 1,
      name: 'THE UNIVERSE',
      subscribedCount,
      startingDate: '05 Apr 2026',
      investmentAmount: 500000,
      tenureMonths: 20
    }];
    this.availableTeams = [];
  }

  private mapGroupTableFromUsers(users: AppUser[]): void {
    this.groupRows = users.map((user) => ({
      userId: user.userId,
      name: user.name,
      location: user.location || '--'
    }));

    if (!this.groupRows.length) {
      this.groupError = 'No rows found in group data.';
    }
  }

  private cleanText(value: string | null): string {
    return (value || '').replace(/\s+/g, ' ').trim();
  }
}
