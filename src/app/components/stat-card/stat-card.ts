import { Component, input } from '@angular/core';
import {
  LucideBriefcaseBusiness,
  LucideHandshake,
  LucideBadgeCheck,
  LucideCircleX,
  LucideClock3,
} from '@lucide/angular';

// The icon is chosen by NAME (a string prop). The card maps the name to the
// matching lucide icon with @switch.
@Component({
  selector: 'app-stat-card',
  imports: [
    LucideBriefcaseBusiness,
    LucideHandshake,
    LucideBadgeCheck,
    LucideCircleX,
    LucideClock3,
  ],
  template: `
    <article
      class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md text-slate-900"
    >
      <div class="flex items-start justify-between gap-2 sm:gap-4">
        <div class="min-w-0 space-y-1 sm:space-y-2">
          <p class="text-xs sm:text-sm font-medium text-slate-500">{{ title() }}</p>
          <p class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            {{ value() }}
          </p>
          <div class="text-xs sm:text-sm font-medium text-slate-500">{{ subtitle() }}</div>
        </div>
        <div class="shrink-0 rounded-xl sm:rounded-2xl p-2 sm:p-3" [class]="iconClass()">
          @switch (icon()) {
            @case ('briefcase') {
              <svg lucideBriefcaseBusiness class="h-4 w-4 sm:h-5 sm:w-5"></svg>
            }
            @case ('handshake') {
              <svg lucideHandshake class="h-4 w-4 sm:h-5 sm:w-5"></svg>
            }
            @case ('badge') {
              <svg lucideBadgeCheck class="h-4 w-4 sm:h-5 sm:w-5"></svg>
            }
            @case ('circle-x') {
              <svg lucideCircleX class="h-4 w-4 sm:h-5 sm:w-5"></svg>
            }
            @case ('clock') {
              <svg lucideClock3 class="h-4 w-4 sm:h-5 sm:w-5"></svg>
            }
          }
        </div>
      </div>
    </article>
  `,
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly subtitle = input<string>('');
  readonly iconClass = input.required<string>();
  // The icon name; mapped to a lucide icon in the template via @switch.
  readonly icon = input.required<string>();
}
