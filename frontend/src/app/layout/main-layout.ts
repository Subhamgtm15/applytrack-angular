import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLogOut, LucideMenu, LucideX } from '@lucide/angular';
import { AuthService } from '../services/auth.service';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideLogOut, LucideMenu, LucideX],
  template: `
    <div class="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <!-- Mobile drawer backdrop: only rendered while open, hidden on desktop -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" (click)="closeSidebar()"></div>
      }

      <!-- Sidebar: a fixed slide-in drawer on mobile, a static column on desktop.
           It sits off-screen (-translate-x-full) until sidebarOpen() flips it in. -->
      <aside
        class="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <div
          class="flex h-16 items-center justify-between border-b border-slate-200 px-6 text-lg font-bold"
        >
          ApplyTrack
          <button
            type="button"
            (click)="closeSidebar()"
            class="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <svg lucideX class="h-5 w-5"></svg>
          </button>
        </div>
        <nav class="space-y-1 p-3">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-50 text-indigo-600 font-medium"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              (click)="closeSidebar()"
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

      <!-- Right column: mobile top bar + scrollable content -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Mobile top bar with hamburger; desktop hides it (sidebar is always visible there) -->
        <header
          class="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden"
        >
          <button
            type="button"
            (click)="toggleSidebar()"
            class="cursor-pointer rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <svg lucideMenu class="h-6 w-6"></svg>
          </button>
          <span class="text-lg font-bold">ApplyTrack</span>
        </header>

        <!-- Main content: child routes render here and swap on navigation -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apps = inject(ApplicationService);

  readonly user = this.auth.user;
  readonly initial = computed(() => (this.user()?.fullName?.[0] ?? '?').toUpperCase());

  // Mobile drawer state. On desktop the sidebar is always visible, so this only
  // has a visible effect below the lg breakpoint. (signal = React useState)
  readonly sidebarOpen = signal(false);

  // exact:true only for the home link ('/' is a prefix of every route).
  navItems = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/applications', label: 'Applications', exact: false },
    { path: '/addapplication', label: 'Add Application', exact: false },
    { path: '/settings', label: 'Settings', exact: false },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  // Load the signed-in user's applications once we're inside the authenticated shell.
  ngOnInit(): void {
    this.apps.loadApplications();
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
