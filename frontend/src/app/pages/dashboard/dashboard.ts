import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import {
  LucideHandshake,
  LucideClock3,
  LucideChevronRight,
  LucidePlus,
} from '@lucide/angular';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { StatusColorDirective } from '../../directives/status-color.directive';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatCardComponent,
    NgxChartsModule,
    RouterLink,
    DatePipe,
    StatusColorDirective,
    LucideHandshake,
    LucideClock3,
    LucideChevronRight,
    LucidePlus,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  readonly appService = inject(ApplicationService);
  private readonly auth = inject(AuthService);

  // The logged-in user's first name for the greeting.
  readonly firstName = computed(() => this.auth.user()?.fullName?.split(' ')[0] ?? 'there');

  // Format the weekly counts for ngx-charts ({ name, value }).
  readonly chartData = computed(() =>
    this.appService
      .weeklyActivity()
      .map((w) => ({ name: w.label, value: w.count, extra: { range: w.range } })),
  );

  // Single violet series to match the ApplyTrack chart.
  readonly scheme: Color = {
    name: 'activity',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#8b5cf6'],
  };

  // ngx-charts renders Y-axis ticks as floats (0.000000); show whole numbers only.
  formatCount(value: number): string {
    return Number.isInteger(value) ? String(value) : '';
  }

  // Deterministic avatar colour per company (first-letter badge).
  avatarColor(company: string): string {
    const palette = [
      'bg-indigo-500',
      'bg-blue-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-emerald-500',
      'bg-pink-500',
      'bg-cyan-500',
    ];
    let hash = 0;
    for (const ch of company) hash += ch.charCodeAt(0);
    return palette[hash % palette.length];
  }
}
