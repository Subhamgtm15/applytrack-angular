import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { LucideHandshake, LucideClock3 } from '@lucide/angular';
import { ApplicationService } from '../../services/application.service';
import { StatCardComponent } from '../../components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [StatCardComponent, NgxChartsModule, LucideHandshake, LucideClock3, DatePipe],
  template: `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Good to see you, Subham</h1>
      <p class="text-slate-500">Here's how your job hunt is going.</p>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-5">
      <app-stat-card
        title="Total Applied"
        [value]="appService.stats().total"
        subtitle="All applications"
        iconClass="bg-blue-100 text-blue-600"
        icon="briefcase"
      />
      <app-stat-card
        title="Interviews"
        [value]="appService.stats().interviews"
        subtitle="In progress"
        iconClass="bg-purple-100 text-purple-600"
        icon="handshake"
      />
      <app-stat-card
        title="Offers"
        [value]="appService.stats().offers"
        [subtitle]="appService.stats().offers > 0 ? 'Active' : 'None yet'"
        iconClass="bg-green-100 text-green-600"
        icon="badge"
      />
      <app-stat-card
        title="Rejections"
        [value]="appService.stats().rejections"
        [subtitle]="appService.stats().rejectionRate + '% of total'"
        iconClass="bg-red-100 text-red-600"
        icon="circle-x"
      />
      <app-stat-card
        title="Follow-ups"
        [value]="appService.stats().followUps"
        subtitle="Due soon"
        iconClass="bg-yellow-100 text-yellow-600"
        icon="clock"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
      <!-- Application activity chart -->
      <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Application Activity</h2>
            <p class="mt-1 text-sm text-slate-500">Applications submitted per week</p>
          </div>
          <span
            class="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700"
            >Week wise</span
          >
        </div>
        <div class="rounded-2xl bg-slate-50 p-4">
          <div style="height: 280px">
            <ngx-charts-bar-vertical
              [results]="chartData()"
              [scheme]="scheme"
              [xAxis]="true"
              [yAxis]="true"
              [roundEdges]="true"
              [barPadding]="90"
            />
          </div>
        </div>
      </div>

      <!-- Upcoming -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Upcoming</h2>
        <div class="space-y-4">
          @for (item of appService.upcoming(); track item.app.id) {
            <div class="flex items-center gap-3">
              <div
                class="shrink-0 rounded-xl p-2"
                [class]="
                  item.kind === 'Interview'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-yellow-100 text-yellow-600'
                "
              >
                @if (item.kind === 'Interview') {
                  <svg lucideHandshake class="h-4 w-4"></svg>
                } @else {
                  <svg lucideClock3 class="h-4 w-4"></svg>
                }
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-900">{{ item.app.company }}</p>
                <p class="text-xs text-slate-500">{{ item.app.role }} · {{ item.kind }}</p>
              </div>
              <span class="ml-auto shrink-0 text-xs text-slate-400">{{
                item.date | date: 'MMM d'
              }}</span>
            </div>
          } @empty {
            <p class="text-sm text-slate-400">No upcoming interviews or follow-ups.</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  readonly appService = inject(ApplicationService);

  // Format the weekly counts for ngx-charts ({ name, value }).
  readonly chartData = computed(() =>
    this.appService.weeklyActivity().map((w) => ({ name: w.label, value: w.count })),
  );

  // Single violet series to match the ApplyTrack chart.
  readonly scheme: Color = {
    name: 'activity',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#8b5cf6'],
  };
}
