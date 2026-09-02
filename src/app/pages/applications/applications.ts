import { Component, inject } from '@angular/core';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-applications',
  template: `
    <h1 class="text-2xl font-bold text-slate-900 mb-1">Applications</h1>
    <p class="text-slate-500 mb-6">
      {{ appService.filteredApplications().length }} of {{ appService.applications().length }} applications
    </p>

    <input
      type="text"
      placeholder="Search by company or role..."
      [value]="appService.search()"
      (input)="onSearch($event)"
      class="w-full sm:w-80 mb-6 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <div class="space-y-3">
      @for (app of appService.filteredApplications(); track app.id) {
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
  `,
})
export class ApplicationsComponent {
  // inject() grabs the shared singleton service (Angular's DI).
  readonly appService = inject(ApplicationService);

  // Reads the input's value and pushes it into the service's search signal.
  onSearch(event: Event): void {
    this.appService.setSearch((event.target as HTMLInputElement).value);
  }

  constructor(){
    console.log(this.appService.applications()) 
  }
}
