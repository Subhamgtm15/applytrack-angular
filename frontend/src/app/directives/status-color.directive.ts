import { Directive, HostBinding, Input } from '@angular/core';

// Turns any element into a status pill: <span [appStatusColor]="app.status">…</span>.
// Demonstrates a custom attribute directive with @Input + @HostBinding.
@Directive({
  selector: '[appStatusColor]',
})
export class StatusColorDirective {
  @Input('appStatusColor') status = '';

  // Binds the full pill class string onto the host element, chosen by status.
  @HostBinding('class')
  get classes(): string {
    const base = 'inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1';
    const colors: Record<string, string> = {
      applied: 'bg-blue-50 text-blue-600 ring-blue-100',
      interview: 'bg-purple-50 text-purple-600 ring-purple-100',
      offer: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
      rejected: 'bg-red-50 text-red-600 ring-red-100',
      'follow-up': 'bg-amber-50 text-amber-600 ring-amber-100',
    };
    return `${base} ${colors[this.status] ?? colors['follow-up']}`;
  }
}
