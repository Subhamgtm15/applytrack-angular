import { Injectable, computed, signal } from '@angular/core';
import { Application, ApplicationStatus, JobType } from '../models/application.model';
import { MOCK_APPLICATIONS } from '../data/mock-applications';

// The three ways the list can be ordered.
export type SortOption = 'date-desc' | 'date-asc' | 'company-asc';

// The shared store for job applications — this is the Angular equivalent
// of your Zustand store. @Injectable + providedIn:'root' makes it a singleton.
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  // Private writable signal holds the actual list.
  private readonly _applications = signal<Application[]>(MOCK_APPLICATIONS);

  // Public read-only view so components can read but not overwrite the array.
  readonly applications = this._applications.asReadonly();

  // The current search term (writable only inside the service).
  private readonly _search = signal('');
  readonly search = this._search.asReadonly();

  // The current status filter — "all" or a specific status.
  private readonly _statusFilter = signal<'all' | ApplicationStatus>('all');
  readonly statusFilter = this._statusFilter.asReadonly();

  // The current job-type filter — "all" or a specific job type.
  private readonly _typeFilter = signal<'all' | JobType>('all');
  readonly typeFilter = this._typeFilter.asReadonly();

  // The current sort order.
  private readonly _sort = signal<SortOption>('date-desc');
  readonly sort = this._sort.asReadonly();

  // How many rows per page (a plain constant — it never changes, so no signal).
  readonly pageSize = 5;

  // The current page number (1-based).
  private readonly _page = signal(1);
  readonly page = this._page.asReadonly();

  // Derived list: recomputes whenever the data, search, status, OR type changes.
  readonly filteredApplications = computed(() => {
    const term = this._search().toLowerCase().trim();
    const status = this._statusFilter();
    const type = this._typeFilter();
    return this._applications().filter((app) => {
      const matchesSearch =
        !term ||
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || app.status === status;
      const matchesType = type === 'all' || app.jobType === type;
      return matchesSearch && matchesStatus && matchesType;
    });
  });

  // Second computed: sorts the already-filtered list. It reads filteredApplications
  // (another computed) — computeds can depend on other computeds.
  readonly sortedApplications = computed(() => {
    const option = this._sort();
    // Copy first: Array.sort() mutates in place, and a computed must stay pure.
    const list = [...this.filteredApplications()];
    return list.sort((a, b) => {
      if (option === 'date-asc') {
        return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
      }
      if (option === 'company-asc') {
        return a.company.localeCompare(b.company);
      }
      // date-desc: newest first
      return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
    });
  });

  // How many pages the filtered list needs (at least 1).
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredApplications().length / this.pageSize)),
  );

  // Third computed in the chain: slice the sorted list down to the current page.
  readonly pagedApplications = computed(() => {
    const start = (this._page() - 1) * this.pageSize;
    return this.sortedApplications().slice(start, start + this.pageSize);
  });

  setSearch(value: string): void {
    this._search.set(value);
    this._page.set(1); // changing a filter jumps back to the first page
  }

  setStatusFilter(status: 'all' | ApplicationStatus): void {
    this._statusFilter.set(status);
    this._page.set(1);
  }

  setTypeFilter(type: 'all' | JobType): void {
    this._typeFilter.set(type);
    this._page.set(1);
  }

  setSort(option: SortOption): void {
    this._sort.set(option);
    this._page.set(1);
  }

  nextPage(): void {
    this._page.update((p) => Math.min(p + 1, this.totalPages()));
  }

  prevPage(): void {
    this._page.update((p) => Math.max(p - 1, 1));
  }

  constructor() {
    // Read the signal by calling it — logs the current list to the console.
    console.log(this._applications());
  }
}
