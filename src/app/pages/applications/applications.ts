import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationService, SortOption } from '../../services/application.service';
import { ApplicationStatus, JobType } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  imports: [RouterLink],
  template: `
    <div class="flex items-center justify-between mb-1">
      <h1 class="text-2xl font-bold text-slate-900">Applications</h1>
      <a
        routerLink="/addapplication"
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"
        >+ New Application</a
      >
    </div>
    <p class="text-slate-500 mb-6">
      {{ appService.filteredApplications().length }} of {{ appService.applications().length }} applications
    </p>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Search by company or role..."
        [value]="appService.search()"
        (input)="onSearch($event)"
        class="w-full sm:w-80 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        [value]="appService.statusFilter()"
        (change)="onStatusChange($event)"
        class="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All status</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
        <option value="follow-up">Follow-up</option>
      </select>
      <select
        [value]="appService.typeFilter()"
        (change)="onTypeChange($event)"
        class="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All types</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="remote">Remote</option>
        <option value="contract">Contract</option>
        <option value="freelance">Freelance</option>
        <option value="internship">Internship</option>
      </select>
      <select
        [value]="appService.sort()"
        (change)="onSortChange($event)"
        class="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="company-asc">Company A–Z</option>
      </select>
    </div>

    <div class="space-y-3">
      @for (app of appService.pagedApplications(); track app.id) {
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4">
          <div>
            <p class="font-semibold text-slate-900">{{ app.role }}</p>
            <p class="text-sm text-slate-500">{{ app.company }} · {{ app.location }}</p>
          </div>
          <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
            {{ app.status }}
          </span>
        </div>
      } @empty {
        <div class="text-center py-12 text-slate-400">No applications match your search.</div>
      }
    </div>

    <div class="flex items-center justify-between mt-6">
      <button
        (click)="appService.prevPage()"
        [disabled]="appService.page() === 1"
        class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm text-slate-500">
        Page {{ appService.page() }} of {{ appService.totalPages() }}
      </span>
      <button
        (click)="appService.nextPage()"
        [disabled]="appService.page() === appService.totalPages()"
        class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  `,
})
export class ApplicationsComponent {
  // inject() grabs the shared singleton service (Angular's DI).
  readonly appService = inject(ApplicationService);

  // Reads the input's value and pushes it into the service's search signal.
  onSearch(event: Event): void {
    this.appService.setSearch((event.target as HTMLInputElement).value);
  }

  // Reads the selected status and pushes it into the service's status-filter signal.
  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | ApplicationStatus;
    this.appService.setStatusFilter(value);
  }

  // Reads the selected job type and pushes it into the service's type-filter signal.
  onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | JobType;
    this.appService.setTypeFilter(value);
  }

  // Reads the selected sort option and pushes it into the service's sort signal.
  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.appService.setSort(value);
  }

  constructor(){
    console.log(this.appService.applications()) 
  }
}
