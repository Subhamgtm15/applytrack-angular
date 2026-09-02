import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  fullName: string;
  email: string;
}

const STORAGE_KEY = 'applytrack_user';

// Shared auth state — the Angular equivalent of ApplyTrack's Zustand authStore.
@Injectable({ providedIn: 'root' })
export class AuthService {
  // The logged-in user (or null). Initialised from localStorage so a refresh keeps you signed in.
  private readonly _user = signal<AuthUser | null>(this.readStored());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  // Mock login until the real API is wired: accepts any credentials.
  login(email: string, fullName = 'Subham Gautam'): void {
    const user: AuthUser = { email, fullName };
    this._user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private readStored(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
