import { AppUser } from './auth.service';

export interface TeamConfig {
  id: number;
  name: string;
  startingDate: string;
  nextSpinDateText: string;
  investmentAmount: number;
  tenureMonths: number;
}

export const TEAM_CONFIGS: TeamConfig[] = [
  {
    id: 1,
    name: 'THE UNIVERSE',
    startingDate: '05 Apr 2026',
    nextSpinDateText: 'May 5, 2026, 11:00 AM',
    investmentAmount: 500000,
    tenureMonths: 20
  },
  {
    id: 2,
    name: 'NOVA EMPIRE',
    startingDate: '15 Apr 2026',
    nextSpinDateText: 'May 10, 2026, 11:00 AM',
    investmentAmount: 500000,
    tenureMonths: 20
  }
];

export function getTeamConfig(teamName: string): TeamConfig | undefined {
  return TEAM_CONFIGS.find((team) => team.name === teamName);
}

export function getUsersForTeam(users: AppUser[], teamName: string): AppUser[] {
  return users.filter((user) => user.schemeName === teamName);
}
