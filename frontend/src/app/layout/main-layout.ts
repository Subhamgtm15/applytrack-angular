import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLogOut, LucideMenu, LucideX } from '@lucide/angular';
import { AuthService } from '../services/auth.service';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideLogOut, LucideMenu, LucideX],
  templateUrl: './main-layout.html',
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
