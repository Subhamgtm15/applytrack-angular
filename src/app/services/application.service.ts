import { Injectable, signal } from '@angular/core';
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
}
