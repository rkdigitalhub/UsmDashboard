import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RouterLink } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Chart, type TooltipItem, registerables } from 'chart.js';
import {
  adminDashboardTasks,
  adminGroupProgress,
  adminGroups,
  adminMetrics,
  adminPaymentRequests,
  adminRecentMembers,
  adminRecentWinners,
  adminSpinSchedules,
  type AdminMetric,
  type AdminTrendPoint
} from '../../admin-mock-data';
import { adminMenuIcons, adminUiIcons } from '../../admin-icons';
import { AdminAnalyticsService } from '../../services/admin-analytics.service';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { createStatusColumn } from '../../../shared/components/data-grid/grid-helpers';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, FontAwesomeModule, DataGridComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('revenueChartCanvas') private revenueChartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('memberGrowthChartCanvas') private memberGrowthChartCanvas?: ElementRef<HTMLCanvasElement>;

  readonly metrics = adminMetrics;
  readonly tasks = adminDashboardTasks;
  readonly teams = adminGroups;
  readonly paymentQueue = adminPaymentRequests;
  readonly recentMembers = adminRecentMembers;
  readonly recentWinners = adminRecentWinners;
  readonly groupProgress = adminGroupProgress;
  readonly spinSchedules = adminSpinSchedules;
  readonly openIcon = adminUiIcons.open;
  readonly exportIcon = adminUiIcons.export;
  readonly manageIcon = adminUiIcons.schedule;
  readonly spinScheduleColumnDefs: ColDef[] = [
    { field: 'team', headerName: 'Team', minWidth: 180 },
    { field: 'month', headerName: 'Month', minWidth: 140 },
    { field: 'date', headerName: 'Date', minWidth: 130 },
    { field: 'time', headerName: 'Time', minWidth: 120 },
    createStatusColumn('status', 'Status', ['Scheduled'])
  ];
  readonly paymentQueueColumnDefs: ColDef[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'name', headerName: 'Name', minWidth: 160 },
    { field: 'channel', headerName: 'Channel', minWidth: 130 },
    { field: 'team', headerName: 'Team', minWidth: 170 },
    createStatusColumn('status', 'Status', ['Matched'])
  ];
  readonly recentMemberColumnDefs: ColDef[] = [
    { field: 'userId', headerName: 'User ID', minWidth: 130 },
    { field: 'name', headerName: 'Name', minWidth: 160 },
    { field: 'team', headerName: 'Team', minWidth: 170 },
    { field: 'joinDate', headerName: 'Join Date', minWidth: 140 },
    { field: 'mobile', headerName: 'Mobile', minWidth: 140 },
    createStatusColumn('status', 'Status', ['Active'])
  ];
  statusMessage = '';

  revenueTrend: AdminTrendPoint[] = [];
  memberGrowth: AdminTrendPoint[] = [];
  analyticsSource: 'api' | 'demo' = 'demo';

  private revenueChart?: Chart;
  private memberGrowthChart?: Chart;

  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  ngAfterViewInit(): void {
    this.adminAnalyticsService.getDashboardAnalytics().subscribe((analytics) => {
      this.revenueTrend = analytics.revenueTrend;
      this.memberGrowth = analytics.memberGrowth;
      this.analyticsSource = analytics.source;

      this.renderRevenueChart();
      this.renderMemberGrowthChart();
    });
  }

  ngOnDestroy(): void {
    this.revenueChart?.destroy();
    this.memberGrowthChart?.destroy();
  }

  get revenueChartMeta(): string {
    return this.analyticsSource === 'api' ? 'Live API feed' : 'Demo API feed';
  }

  get memberGrowthMeta(): string {
    if (this.memberGrowth.length < 2) {
      return 'Awaiting trend data';
    }

    const latest = this.memberGrowth[this.memberGrowth.length - 1]?.value ?? 0;
    const previous = this.memberGrowth[this.memberGrowth.length - 2]?.value ?? 0;
    const difference = latest - previous;

    return `${difference >= 0 ? '+' : ''}${difference} vs previous month`;
  }

  get nextSpinSummary(): string {
    const nextSchedule = this.spinSchedules.find((schedule) => schedule.status === 'Scheduled');
    return nextSchedule ? `${nextSchedule.team} on ${nextSchedule.date} at ${nextSchedule.time}` : 'No active schedule published';
  }

  exportSummary(): void {
    this.statusMessage = 'Mock payment summary export prepared.';
  }

  getMetricIcon(metric: AdminMetric): IconDefinition {
    switch (metric.icon) {
      case 'groups':
        return adminMenuIcons.groups;
      case 'payments':
        return adminMenuIcons.payments;
      case 'trophy':
        return adminMenuIcons.winners;
      case 'cluster':
        return adminMenuIcons.schedule;
      default:
        return adminMenuIcons.dashboard;
    }
  }

  private renderRevenueChart(): void {
    const canvas = this.revenueChartCanvas?.nativeElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const gradient = context.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(43, 99, 188, 0.28)');
    gradient.addColorStop(1, 'rgba(43, 99, 188, 0.03)');

    this.revenueChart?.destroy();
    this.revenueChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.revenueTrend.map((point) => point.label),
        datasets: [
          {
            data: this.revenueTrend.map((point) => point.value),
            borderColor: '#0b1323',
            backgroundColor: gradient,
            fill: true,
            tension: 0.34,
            borderWidth: 3,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: '#2d62b7',
            pointBorderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: '#0b1323',
            borderColor: 'rgba(45, 98, 183, 0.22)',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: 'rgba(229, 239, 255, 0.9)',
            callbacks: {
              label: (tooltipItem: TooltipItem<'line'>) => `Revenue: ${tooltipItem.parsed.y} lakh INR`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: 'rgba(54, 85, 138, 0.72)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgba(54, 85, 138, 0.72)',
              callback: (value) => `${value}L INR`
            },
            grid: {
              color: 'rgba(11, 19, 35, 0.08)'
            }
          }
        }
      }
    });
  }

  private renderMemberGrowthChart(): void {
    const canvas = this.memberGrowthChartCanvas?.nativeElement;

    if (!canvas) {
      return;
    }

    this.memberGrowthChart?.destroy();
    this.memberGrowthChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.memberGrowth.map((point) => point.label),
        datasets: [
          {
            data: this.memberGrowth.map((point) => point.value),
            backgroundColor: [
              'rgba(11, 19, 35, 0.94)',
              'rgba(14, 26, 48, 0.92)',
              'rgba(18, 36, 64, 0.9)',
              'rgba(21, 43, 78, 0.88)',
              'rgba(25, 53, 93, 0.86)',
              'rgba(31, 62, 110, 0.84)',
              'rgba(37, 74, 128, 0.82)',
              'rgba(43, 86, 148, 0.8)',
              'rgba(45, 98, 183, 0.78)',
              'rgba(63, 113, 196, 0.76)',
              'rgba(88, 133, 209, 0.74)',
              'rgba(117, 156, 222, 0.72)'
            ],
            borderRadius: 10,
            borderSkipped: false,
            maxBarThickness: 26
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: '#0b1323',
            borderColor: 'rgba(45, 98, 183, 0.22)',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: 'rgba(229, 239, 255, 0.9)',
            callbacks: {
              label: (tooltipItem: TooltipItem<'bar'>) => `Members: ${tooltipItem.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: 'rgba(54, 85, 138, 0.72)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgba(54, 85, 138, 0.72)'
            },
            grid: {
              color: 'rgba(11, 19, 35, 0.08)'
            }
          }
        }
      }
    });
  }
}