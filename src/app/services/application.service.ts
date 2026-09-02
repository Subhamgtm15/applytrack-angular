import { Injectable, computed, signal } from '@angular/core';
import { Application } from '../models/application.model';
import { MOCK_APPLICATIONS } from '../data/mock-applications';

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

  // Derived list: recomputes automatically whenever the data OR the search changes.
  readonly filteredApplications = computed(() => {
    const term = this._search().toLowerCase().trim();
    if (!term) return this._applications();
    return this._applications().filter(
      (app) =>
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term),
    );
  });

  setSearch(value: string): void {
    this._search.set(value);
  }

  constructor() {
    // Read the signal by calling it — logs the current list to the console.
    console.log(this._applications());
  }
}
