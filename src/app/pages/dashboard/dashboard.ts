import { Component, inject } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { StatCardComponent } from '../../components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [StatCardComponent],
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
  `,
})
export class DashboardComponent {
  readonly appService = inject(ApplicationService);
}
