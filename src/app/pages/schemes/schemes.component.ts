import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService, AppUser } from '../../services/auth.service';

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
  imports: [CommonModule],
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent implements OnInit {
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

  groupHeaders: string[] = [];
  groupRows: string[][] = [];
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
    this.groupHeaders = [];
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
    const currentUserId = this.authService.getCurrentUser()?.userId;
    const teams = this.createTeamsFromUsers(users);

    if (!currentUserId) {
      this.myTeams = teams;
      this.availableTeams = [];
      return;
    }

    const currentUser = users.find((user) => user.userId === currentUserId);
    const currentSchemeName = currentUser?.schemeName;

    this.myTeams = teams.filter((team) => team.name === currentSchemeName);
    this.availableTeams = teams.filter((team) => team.name !== currentSchemeName);
  }

  private mapGroupTableFromUsers(users: AppUser[]): void {
    const teamUsers = this.selectedTeam
      ? users.filter((user) => user.schemeName === this.selectedTeam?.name)
      : users;

    this.groupHeaders = ['User ID', 'Name', 'Location', 'Bank', 'Branch', 'Investment', 'Tenure'];
    this.groupRows = teamUsers.map((user) => [
      user.userId,
      user.name,
      user.location,
      user.bankName || '--',
      user.branch || '--',
      user.schemeAmount.toString(),
      `${user.tenureMonths} months`
    ]);

    if (!this.groupRows.length) {
      this.groupError = 'No rows found in group data.';
    }
  }

  private createTeamsFromUsers(users: AppUser[]): Team[] {
    const teamsByName = new Map<string, AppUser[]>();

    for (const user of users) {
      const teamName = this.cleanText(user.schemeName) || 'THE UNIVERSE';
      const members = teamsByName.get(teamName) ?? [];
      members.push(user);
      teamsByName.set(teamName, members);
    }

    return Array.from(teamsByName.entries()).map(([name, members], index) => ({
      id: index + 1,
      name,
      subscribedCount: members.length,
      startingDate: '05 Apr 2026',
      investmentAmount: members[0]?.schemeAmount ?? 500000,
      tenureMonths: members[0]?.tenureMonths ?? 20
    }));
  }

  private cleanText(value: string | null): string {
    return (value || '').replace(/\s+/g, ' ').trim();
  }
}
