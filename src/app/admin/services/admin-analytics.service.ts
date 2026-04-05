import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  type AdminTrendPoint,
  adminMemberGrowth,
  adminRevenueTrend
} from '../admin-mock-data';

export interface AdminDashboardAnalytics {
  revenueTrend: AdminTrendPoint[];
  memberGrowth: AdminTrendPoint[];
  source: 'api' | 'demo';
}

interface AdminDashboardAnalyticsResponse {
  revenueTrend?: AdminTrendPoint[];
  memberGrowth?: AdminTrendPoint[];
}

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsService {
  private readonly dashboardApiUrl = '/api/admin/dashboard-analytics';
  private readonly fallbackApiUrl = 'assets/admin-dashboard-analytics.json';

  constructor(private readonly http: HttpClient) {}

  getDashboardAnalytics(): Observable<AdminDashboardAnalytics> {
    return this.http.get<AdminDashboardAnalyticsResponse>(this.dashboardApiUrl).pipe(
      map((response) => this.mapResponse(response, 'api')),
      catchError(() =>
        this.http.get<AdminDashboardAnalyticsResponse>(this.fallbackApiUrl).pipe(
          map((response) => this.mapResponse(response, 'demo')),
          catchError(() => of(this.getFallbackAnalytics()))
        )
      )
    );
  }

  private mapResponse(
    response: AdminDashboardAnalyticsResponse | null | undefined,
    source: 'api' | 'demo'
  ): AdminDashboardAnalytics {
    return {
      revenueTrend: this.sanitizeTrendPoints(response?.revenueTrend, adminRevenueTrend),
      memberGrowth: this.sanitizeTrendPoints(response?.memberGrowth, adminMemberGrowth),
      source
    };
  }

  private sanitizeTrendPoints(
    points: AdminTrendPoint[] | null | undefined,
    fallback: AdminTrendPoint[]
  ): AdminTrendPoint[] {
    if (!Array.isArray(points) || points.length === 0) {
      return fallback;
    }

    const sanitized = points
      .filter((point) => point && typeof point.label === 'string' && Number.isFinite(point.value))
      .map((point) => ({
        label: point.label,
        value: Number(point.value)
      }));

    return sanitized.length > 0 ? sanitized : fallback;
  }

  private getFallbackAnalytics(): AdminDashboardAnalytics {
    return {
      revenueTrend: adminRevenueTrend,
      memberGrowth: adminMemberGrowth,
      source: 'demo'
    };
  }
}