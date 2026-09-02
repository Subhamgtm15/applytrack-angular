import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLogOut } from '@lucide/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideLogOut],
  template: `
    <div class="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
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

        <!-- User + logout, pinned to the bottom -->
        <div class="mt-auto border-t border-slate-200 p-3">
          <div class="mb-1 flex items-center gap-3 px-2 py-2">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
            >
              {{ initial() }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-slate-900">{{ user()?.fullName }}</p>
              <p class="truncate text-xs text-slate-500">{{ user()?.email }}</p>
            </div>
          </div>
          <button
            type="button"
            (click)="logout()"
            class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <svg lucideLogOut class="h-4 w-4"></svg>
            Log out
          </button>
        </div>
      </aside>

      <!-- Main content: child routes render here and swap on navigation -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly initial = computed(() => (this.user()?.fullName?.[0] ?? '?').toUpperCase());

  // exact:true only for the home link ('/' is a prefix of every route).
  navItems = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/applications', label: 'Applications', exact: false },
    { path: '/addapplication', label: 'Add Application', exact: false },
    { path: '/settings', label: 'Settings', exact: false },
  ];

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
