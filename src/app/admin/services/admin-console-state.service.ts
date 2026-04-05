import { Injectable } from '@angular/core';

import {
  adminBankProfiles,
  adminGroups,
  adminHandCashPayments,
  adminMembers,
  adminPaymentRequests,
  adminSpinSchedules,
  adminWinners,
  type AdminBankProfileRow,
  type AdminCashRow,
  type AdminGroupRow,
  type AdminMemberRow,
  type AdminPaymentRequestRow,
  type AdminSpinScheduleRow,
  type AdminWinnerRow
} from '../admin-mock-data';

interface AdminConsoleState {
  groups: AdminGroupRow[];
  members: AdminMemberRow[];
  bankProfiles: AdminBankProfileRow[];
  onlinePayments: AdminPaymentRequestRow[];
  handCashPayments: AdminCashRow[];
  schedules: AdminSpinScheduleRow[];
  winners: AdminWinnerRow[];
}

@Injectable({ providedIn: 'root' })
export class AdminConsoleStateService {
  private readonly storageKey = 'adminConsoleMockState';
  private state: AdminConsoleState = this.loadState();

  getGroups(): AdminGroupRow[] {
    return this.clone(this.state.groups);
  }

  getMembers(): AdminMemberRow[] {
    return this.clone(this.state.members);
  }

  getBankProfiles(): AdminBankProfileRow[] {
    return this.clone(this.state.bankProfiles);
  }

  getOnlinePayments(): AdminPaymentRequestRow[] {
    return this.clone(this.state.onlinePayments);
  }

  getHandCashPayments(): AdminCashRow[] {
    return this.clone(this.state.handCashPayments);
  }

  getSchedules(): AdminSpinScheduleRow[] {
    return this.clone(this.state.schedules);
  }

  getWinners(): AdminWinnerRow[] {
    return this.clone(this.state.winners);
  }

  createGroup(group: Omit<AdminGroupRow, 'id' | 'vacancy'>): AdminGroupRow {
    const nextGroup: AdminGroupRow = {
      ...group,
      id: this.getNextNumericId(this.state.groups),
      vacancy: Math.max(group.totalMembers - group.joinedMembers, 0)
    };

    this.state.groups = [nextGroup, ...this.state.groups];
    this.persist();
    return this.cloneItem(nextGroup);
  }

  updateGroup(id: number, updates: Partial<AdminGroupRow>): void {
    this.state.groups = this.state.groups.map((group) => {
      if (group.id !== id) {
        return group;
      }

      const nextGroup = { ...group, ...updates };
      nextGroup.vacancy = Math.max(nextGroup.totalMembers - nextGroup.joinedMembers, 0);
      return nextGroup;
    });

    this.persist();
  }

  deleteGroup(id: number): void {
    this.state.groups = this.state.groups.filter((group) => group.id !== id);
    this.persist();
  }

  createMember(member: Omit<AdminMemberRow, 'id'>): AdminMemberRow {
    const nextMember: AdminMemberRow = {
      ...member,
      id: this.getNextNumericId(this.state.members)
    };

    this.state.members = [nextMember, ...this.state.members];
    this.state.bankProfiles = [this.toBankProfile(nextMember), ...this.state.bankProfiles];
    this.adjustGroupOccupancy(undefined, nextMember.team, 1);
    this.persist();
    return this.cloneItem(nextMember);
  }

  updateMember(userId: string, updates: Partial<AdminMemberRow>): void {
    let previousTeam = '';
    let nextTeam = '';
    let updatedMember: AdminMemberRow | undefined;

    this.state.members = this.state.members.map((member) => {
      if (member.userId !== userId) {
        return member;
      }

      previousTeam = member.team;
      updatedMember = { ...member, ...updates };
      nextTeam = updatedMember.team;
      return updatedMember;
    });

    if (!updatedMember) {
      return;
    }

    this.state.bankProfiles = this.state.bankProfiles.map((profile) =>
      profile.userId === userId ? this.toBankProfile(updatedMember as AdminMemberRow) : profile
    );

    this.syncLinkedRecordsForMember(updatedMember);

    if (previousTeam && nextTeam && previousTeam !== nextTeam) {
      this.adjustGroupOccupancy(previousTeam, nextTeam, 1);
    }

    this.persist();
  }

  deleteMember(userId: string): void {
    const member = this.state.members.find((entry) => entry.userId === userId);
    if (!member) {
      return;
    }

    this.state.members = this.state.members.filter((entry) => entry.userId !== userId);
    this.state.bankProfiles = this.state.bankProfiles.filter((entry) => entry.userId !== userId);
    this.state.onlinePayments = this.state.onlinePayments.filter((entry) => entry.userId !== userId);
    this.state.handCashPayments = this.state.handCashPayments.filter((entry) => entry.userId !== userId);
    this.state.winners = this.state.winners.filter((entry) => entry.userId !== userId);
    this.adjustGroupOccupancy(member.team, undefined, 1);
    this.persist();
  }

  updateBankProfile(userId: string, updates: Partial<AdminBankProfileRow>): void {
    this.state.bankProfiles = this.state.bankProfiles.map((profile) =>
      profile.userId === userId ? { ...profile, ...updates } : profile
    );

    this.state.members = this.state.members.map((member) => {
      if (member.userId !== userId) {
        return member;
      }

      return {
        ...member,
        bankName: updates.bankName ?? member.bankName,
        branch: updates.branch ?? member.branch,
        accountNumber: updates.accountNumber ?? member.accountNumber,
        ifscCode: updates.ifscCode ?? member.ifscCode,
        upiId: updates.upiId ?? member.upiId
      };
    });

    this.persist();
  }

  createSchedule(schedule: Omit<AdminSpinScheduleRow, 'id'>): void {
    const nextSchedule: AdminSpinScheduleRow = {
      ...schedule,
      id: this.getNextNumericId(this.state.schedules)
    };

    this.state.schedules = [nextSchedule, ...this.state.schedules];
    this.persist();
  }

  updateSchedule(id: number, updates: Partial<AdminSpinScheduleRow>): void {
    this.state.schedules = this.state.schedules.map((schedule) =>
      schedule.id === id ? { ...schedule, ...updates } : schedule
    );
    this.persist();
  }

  deleteSchedule(id: number): void {
    this.state.schedules = this.state.schedules.filter((schedule) => schedule.id !== id);
    this.persist();
  }

  createWinner(winner: Omit<AdminWinnerRow, 'id'>): void {
    const nextWinner: AdminWinnerRow = {
      ...winner,
      id: this.getNextNumericId(this.state.winners)
    };

    this.state.winners = [nextWinner, ...this.state.winners];
    this.persist();
  }

  updateWinner(id: number, updates: Partial<AdminWinnerRow>): void {
    this.state.winners = this.state.winners.map((winner) =>
      winner.id === id ? { ...winner, ...updates } : winner
    );
    this.persist();
  }

  deleteWinner(id: number): void {
    this.state.winners = this.state.winners.filter((winner) => winner.id !== id);
    this.persist();
  }

  updateOnlinePaymentStatus(id: number, status: string): void {
    this.state.onlinePayments = this.state.onlinePayments.map((payment) =>
      payment.id === id ? { ...payment, status } : payment
    );
    this.persist();
  }

  updateHandCashStatus(id: number, status: string): void {
    this.state.handCashPayments = this.state.handCashPayments.map((payment) =>
      payment.id === id ? { ...payment, status } : payment
    );
    this.persist();
  }

  applyBulkBankTemplate(): void {
    this.state.bankProfiles = this.state.bankProfiles.map((profile) => ({
      ...profile,
      branch: profile.branch || 'Main Branch'
    }));
    this.persist();
  }

  reset(): void {
    localStorage.removeItem(this.storageKey);
    this.state = this.loadState();
  }

  private loadState(): AdminConsoleState {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.getSeedState();
    }

    try {
      const parsed = JSON.parse(raw) as AdminConsoleState;
      return {
        groups: parsed.groups ?? this.clone(adminGroups),
        members: parsed.members ?? this.clone(adminMembers),
        bankProfiles: parsed.bankProfiles ?? this.clone(adminBankProfiles),
        onlinePayments: parsed.onlinePayments ?? this.clone(adminPaymentRequests),
        handCashPayments: parsed.handCashPayments ?? this.clone(adminHandCashPayments),
        schedules: parsed.schedules ?? this.clone(adminSpinSchedules),
        winners: parsed.winners ?? this.clone(adminWinners)
      };
    } catch {
      localStorage.removeItem(this.storageKey);
      return this.getSeedState();
    }
  }

  private getSeedState(): AdminConsoleState {
    return {
      groups: this.clone(adminGroups),
      members: this.clone(adminMembers),
      bankProfiles: this.clone(adminBankProfiles),
      onlinePayments: this.clone(adminPaymentRequests),
      handCashPayments: this.clone(adminHandCashPayments),
      schedules: this.clone(adminSpinSchedules),
      winners: this.clone(adminWinners)
    };
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  private syncLinkedRecordsForMember(member: AdminMemberRow): void {
    this.state.onlinePayments = this.state.onlinePayments.map((payment) =>
      payment.userId === member.userId
        ? { ...payment, name: member.name, team: member.team }
        : payment
    );

    this.state.handCashPayments = this.state.handCashPayments.map((payment) =>
      payment.userId === member.userId
        ? { ...payment, userName: member.name, team: member.team }
        : payment
    );

    this.state.winners = this.state.winners.map((winner) =>
      winner.userId === member.userId
        ? { ...winner, name: member.name, group: member.team }
        : winner
    );
  }

  private adjustGroupOccupancy(previousTeam: string | undefined, nextTeam: string | undefined, count: number): void {
    this.state.groups = this.state.groups.map((group) => {
      if (previousTeam && group.groupName === previousTeam) {
        const joinedMembers = Math.max(group.joinedMembers - count, 0);
        return { ...group, joinedMembers, vacancy: Math.max(group.totalMembers - joinedMembers, 0) };
      }

      if (nextTeam && group.groupName === nextTeam) {
        const joinedMembers = Math.min(group.joinedMembers + count, group.totalMembers);
        return { ...group, joinedMembers, vacancy: Math.max(group.totalMembers - joinedMembers, 0) };
      }

      return group;
    });
  }

  private toBankProfile(member: AdminMemberRow): AdminBankProfileRow {
    return {
      userId: member.userId,
      name: member.name,
      team: member.team,
      bankName: member.bankName,
      branch: member.branch,
      accountNumber: member.accountNumber,
      ifscCode: member.ifscCode,
      upiId: member.upiId,
      address: `${member.address}, ${member.city} - ${member.pincode}`
    };
  }

  private getNextNumericId<T extends { id: number }>(items: T[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  private cloneItem<T>(value: T): T {
    return this.clone(value);
  }
}