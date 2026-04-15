import { Injectable } from '@angular/core';
import { SafeAppUser } from './auth.service';

export interface SpinScheduleSnapshot {
  teamName: string;
  dateText: string;
  targetIstMs: number | null;
  remainingMs: number;
  remainingText: string;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpinScheduleService {
  private readonly nextSpinDateText = 'May 5, 2026, 11:00 AM';

  getSpinSchedule(user: SafeAppUser | null): SpinScheduleSnapshot {
    const targetIstMs = this.parseIstDateToMs(this.nextSpinDateText);
    const remainingMs = targetIstMs === null ? 0 : Math.max(0, targetIstMs - this.getCurrentIstMs());

    return {
      teamName: user?.schemeName?.trim() || 'THE UNIVERSE',
      dateText: this.nextSpinDateText,
      targetIstMs,
      remainingMs,
      remainingText: this.formatRemainingTime(remainingMs),
      isAvailable: remainingMs === 0
    };
  }

  getCurrentIstMs(): number {
    const utcMs = Date.now() + new Date().getTimezoneOffset() * 60_000;
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    return utcMs + istOffsetMs;
  }

  parseIstDateToMs(dateText: string): number | null {
    const normalized = dateText.includes(',')
      ? dateText
      : dateText.replace(' ', 'T');
    const parsed = Date.parse(`${normalized} GMT+0530`);
    return Number.isNaN(parsed) ? null : parsed;
  }

  formatRemainingTime(remainingMs: number): string {
    if (remainingMs <= 0) {
      return '0s';
    }

    const oneDayMs = 24 * 60 * 60 * 1000;
    if (remainingMs > oneDayMs) {
      const days = Math.floor(remainingMs / oneDayMs);
      return `${days} day${days === 1 ? '' : 's'}`;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (hours > 0 || minutes > 0) {
      parts.push(`${minutes}m`);
    }
    parts.push(`${seconds}s`);

    return parts.join(' ');
  }
}
