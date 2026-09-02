import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideMapPin, LucidePencil, LucideTrash2, LucidePlus } from '@lucide/angular';
import { ApplicationService, SortOption } from '../../services/application.service';
import { ApplicationStatus, JobType } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  imports: [RouterLink, DatePipe, LucideMapPin, LucidePencil, LucideTrash2, LucidePlus],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">All Applications</h1>
        <p class="mt-1 text-sm text-slate-500">
          {{ appService.filteredApplications().length }} of
          {{ appService.applications().length }} applications
        </p>
      </div>
      <a
        routerLink="/addapplication"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <svg lucidePlus class="h-4 w-4"></svg>
        Add New
      </a>
    </div>

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

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <div class="min-w-205">
          <!-- Header row -->
          <div
            class="grid grid-cols-[2.2fr_1.8fr_1.2fr_1.6fr_1fr_1fr_88px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>Location</span>
            <span>Applied</span>
            <span>Follow-up</span>
            <span class="text-right">Actions</span>
          </div>

          <div class="divide-y divide-slate-100">
            @for (app of appService.pagedApplications(); track app.id) {
              <div
                class="grid grid-cols-[2.2fr_1.8fr_1.2fr_1.6fr_1fr_1fr_88px] items-center gap-4 px-6 py-4"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                    [class]="avatarColor(app.company)"
                  >
                    {{ app.company.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate font-semibold text-slate-900">{{ app.company }}</p>
                    <p class="text-sm capitalize text-slate-500">{{ app.jobType }}</p>
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="truncate font-semibold text-slate-900">{{ app.role }}</p>
                  <p class="text-sm text-slate-500">{{ app.salary || '-' }}</p>
                </div>
                <div>
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1"
                    [class]="statusBadge(app.status)"
                  >
                    {{ app.status }}
                  </span>
                </div>
                <div class="flex min-w-0 items-center gap-2 text-sm text-slate-500">
                  <svg lucideMapPin class="h-4 w-4 shrink-0 text-slate-400"></svg>
                  <span class="truncate">{{ app.location }}</span>
                </div>
                <div class="text-sm text-slate-500">{{ app.dateApplied | date: 'MMM d' }}</div>
                <div class="text-sm text-amber-600">
                  {{ app.followUpDate ? (app.followUpDate | date: 'MMM d') : '-' }}
                </div>
                <div class="flex items-center justify-end gap-1 text-slate-400">
                  <a
                    [routerLink]="['/addapplication', app.id]"
                    class="rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Edit"
                  >
                    <svg lucidePencil class="h-4 w-4"></svg>
                  </a>
                  <button
                    (click)="onDelete(app.id)"
                    class="rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <svg lucideTrash2 class="h-4 w-4"></svg>
                  </button>
                </div>
              </div>
            } @empty {
              <div class="px-6 py-12 text-center text-slate-400">
                No applications match your search.
              </div>
            }
          </div>
        </div>
      </div>
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

  // Confirms, then asks the service to remove the application.
  onDelete(id: number): void {
    if (confirm('Delete this application?')) {
      this.appService.deleteApplication(id);
    }
  }

  // Deterministic avatar colour per company (first-letter badge).
  avatarColor(company: string): string {
    const palette = [
      'bg-indigo-500',
      'bg-violet-500',
      'bg-sky-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-orange-500',
      'bg-rose-500',
      'bg-slate-900',
    ];
    let hash = 0;
    for (const ch of company) hash += ch.charCodeAt(0);
    return palette[hash % palette.length];
  }

  // Pill colours per application status (matches ApplyTrack).
  statusBadge(status: string): string {
    switch (status) {
      case 'applied':
        return 'bg-blue-50 text-blue-600 ring-blue-100';
      case 'interview':
        return 'bg-purple-50 text-purple-600 ring-purple-100';
      case 'offer':
        return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
      case 'rejected':
        return 'bg-red-50 text-red-600 ring-red-100';
      default:
        return 'bg-amber-50 text-amber-600 ring-amber-100';
    }
  }

  constructor(){
    console.log(this.appService.applications()) 
  }
}
