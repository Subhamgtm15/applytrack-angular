import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideMapPin, LucidePencil, LucideTrash2 } from '@lucide/angular';
import { StatusColorDirective } from '../../directives/status-color.directive';
import { Application } from '../../models/application.model';

// A single applications-table row. Presentational only: it takes an application
// via input() and emits a delete request via output() — the parent owns the logic.
@Component({
  selector: 'app-application-row',
  host: { class: 'block' },
  imports: [RouterLink, DatePipe, StatusColorDirective, LucideMapPin, LucidePencil, LucideTrash2],
  template: `
    <div
      class="grid grid-cols-[2.2fr_1.8fr_1.2fr_1.6fr_1fr_1fr_88px] items-center gap-4 px-6 py-4"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white"
          [class]="avatarColor(application().company)"
        >
          {{ application().company.charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-900">{{ application().company }}</p>
          <p class="text-sm capitalize text-slate-500">{{ application().jobType }}</p>
        </div>
      </div>
      <div class="min-w-0">
        <p class="truncate font-semibold text-slate-900">{{ application().role }}</p>
        <p class="text-sm text-slate-500">{{ application().salary || '-' }}</p>
      </div>
      <div>
        <span [appStatusColor]="application().status">{{ application().status }}</span>
      </div>
      <div class="flex min-w-0 items-center gap-2 text-sm text-slate-500">
        <svg lucideMapPin class="h-4 w-4 shrink-0 text-slate-400"></svg>
        <span class="truncate">{{ application().location }}</span>
      </div>
      <div class="text-sm text-slate-500">{{ application().dateApplied | date: 'MMM d' }}</div>
      <div class="text-sm text-amber-600">
        {{ application().followUpDate ? (application().followUpDate | date: 'MMM d') : '-' }}
      </div>
      <div class="flex items-center justify-end gap-1 text-slate-400">
        <a
          [routerLink]="['/addapplication', application().id]"
          class="rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Edit"
        >
          <svg lucidePencil class="h-4 w-4"></svg>
        </a>
        <button
          (click)="delete.emit(application().id)"
          class="rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-red-500"
          aria-label="Delete"
        >
          <svg lucideTrash2 class="h-4 w-4"></svg>
        </button>
      </div>
    </div>
  `,
})
export class ApplicationRowComponent {
  // Data in (parent → child).
  readonly application = input.required<Application>();

  // Event out (child → parent): the id the parent should delete.
  readonly delete = output<number>();

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
}
