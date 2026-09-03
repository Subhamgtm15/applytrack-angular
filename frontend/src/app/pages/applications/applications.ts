import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { LucidePlus } from '@lucide/angular';
import { ApplicationRowComponent } from '../../components/application-row/application-row';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';
import { ApplicationService, SortOption } from '../../services/application.service';
import { ApplicationStatus, JobType } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ApplicationRowComponent,
    ConfirmDialogComponent,
    LucidePlus,
  ],
  templateUrl: './applications.html',
})
export class ApplicationsComponent {
  // inject() grabs the shared singleton service (Angular's DI).
  readonly appService = inject(ApplicationService);

  // The search box as a reactive control, so we can stream its keystrokes.
  readonly searchControl = new FormControl('', { nonNullable: true });

  // Id of the application awaiting delete confirmation (null = dialog closed).
  readonly pendingDeleteId = signal<number | null>(null);

  constructor() {
    // Type-ahead pipeline: wait for a 300ms pause, skip duplicate terms, then
    // switchMap to the latest server request — cancelling any in-flight one.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.appService.searchApplications(term)),
        takeUntilDestroyed(),
      )
      .subscribe();
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

  // Opens the confirmation box for the chosen application.
  onDelete(id: number): void {
    this.pendingDeleteId.set(id);
  }

  // Deletes after the user confirms, then closes the box.
  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      this.appService.deleteApplication(id).subscribe();
    }
    this.pendingDeleteId.set(null);
  }

  // Closes the box without deleting.
  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }
}
