import { Component } from '@angular/core';

// A page is just a component. Inline `template` here instead of a separate
// .html file — both are valid; inline is handy for small pages.
@Component({
  selector: 'app-dashboard',
  template: `
    <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
    <p class="text-slate-500">This page is rendered by the router.</p>
    
  `,
})
export class DashboardComponent {}
