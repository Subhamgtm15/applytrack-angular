import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from '../core/api';

export interface AuthUser {
  fullName: string;
  email: string;
}

// Shape of the { user } payload returned by /auth/me and /auth/signup.
interface UserResponse {
  user: { fullName: string; email: string };
}

// Shared auth state — the Angular equivalent of ApplyTrack's Zustand authStore.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _user = signal<AuthUser | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  // POST /auth/login sets the httpOnly cookie but returns no user, so we chain a
  // /auth/me call to load the profile and populate the signal.
  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(switchMap(() => this.fetchMe()));
  }

  // POST /auth/signup only creates the account (no session), so we don't set the user here.
  signup(fullName: string, email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<UserResponse>(`${API_BASE_URL}/auth/signup`, { fullName, email, password })
      .pipe(map((res) => res.user));
  }

  logout(): Observable<unknown> {
    return this.http
      .post(`${API_BASE_URL}/auth/logout`, {})
      .pipe(tap(() => this._user.set(null)));
  }

  // Load the current user from the auth cookie; used after login and on app startup.
  fetchMe(): Observable<AuthUser> {
    return this.http.get<UserResponse>(`${API_BASE_URL}/auth/me`).pipe(
      map((res) => ({ fullName: res.user.fullName, email: res.user.email })),
      tap((user) => this._user.set(user)),
    );
  }
}
