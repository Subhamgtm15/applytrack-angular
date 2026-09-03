import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  // Small presentational component, so the template stays inline.
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
        (click)="cancel.emit()"
      >
        <div
          class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          role="dialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <h2 class="text-lg font-semibold text-slate-900">{{ title() }}</h2>
          @if (message()) {
            <p class="mt-2 text-sm text-slate-500">{{ message() }}</p>
          }
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              (click)="cancel.emit()"
              class="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {{ cancelLabel() }}
            </button>
            <button
              type="button"
              (click)="confirm.emit()"
              class="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Are you sure?');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
