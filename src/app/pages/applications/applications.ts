import { Component, inject } from '@angular/core';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-applications',
  template: `
    <h1 class="text-2xl font-bold text-slate-900 mb-1">Applications</h1>
    <p class="text-slate-500 mb-6">{{ appService.applications().length }} tracked applications</p>

    <div class="space-y-3">
      @for (app of appService.applications(); track app.id) {
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4">
          <div>
            <p class="font-semibold text-slate-900">{{ app.role }}</p>
            <p class="text-sm text-slate-500">{{ app.company }} · {{ app.location }}</p>
          </div>
          <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
            {{ app.status }}
          </span>
        </div>
      }
    </div>
  `,
})
export class ApplicationsComponent {
  // inject() grabs the shared singleton service (Angular's DI).
  readonly appService = inject(ApplicationService);
}
