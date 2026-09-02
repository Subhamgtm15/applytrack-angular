import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-slate-50 text-slate-900">
      <!-- Sidebar: outside the outlet, so it stays put while pages swap -->
      <aside class="flex w-60 flex-col border-r border-slate-200 bg-white">
        <div class="flex h-16 items-center border-b border-slate-200 px-6 text-lg font-bold">
          ApplyTrack
        </div>
        <nav class="space-y-1 p-3">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-50 text-indigo-600 font-medium"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              class="block rounded-lg px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100"
            >
              {{ item.label }}
            </a>
          }
        </nav>
      </aside>

      <!-- Main content: child routes render here and swap on navigation -->
      <main class="flex-1 p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
  // exact:true only for the home link ('/' is a prefix of every route).
  navItems = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/applications', label: 'Applications', exact: false },
    { path: '/addapplication', label: 'Add Application', exact: false },
    { path: '/settings', label: 'Settings', exact: false },
  ];
}
