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

// The full editable profile (settings page) from /auth/me.
export interface UserProfile {
  fullName: string;
  email: string;
  currentPosition: string;
  targetPosition: string;
  linkedin: string;
}

// Raw /auth/me payload with the extra profile columns (snake_case).
interface ProfileResponse {
  user: {
    fullName: string;
    email: string;
    current_position: string | null;
    target_position: string | null;
    linkedin: string | null;
  };
}

function toProfile(u: ProfileResponse['user']): UserProfile {
  return {
    fullName: u.fullName,
    email: u.email,
    currentPosition: u.current_position ?? '',
    targetPosition: u.target_position ?? '',
    linkedin: u.linkedin ?? '',
  };
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

  // Exchange the token from the Google OAuth callback for the auth cookie, then load the user.
  session(token: string): Observable<AuthUser> {
    return this.http
      .post(`${API_BASE_URL}/auth/session`, { token })
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

  // GET /auth/me — the full profile for the settings page.
  getProfile(): Observable<UserProfile> {
    return this.http
      .get<ProfileResponse>(`${API_BASE_URL}/auth/me`)
      .pipe(map((res) => toProfile(res.user)));
  }

  // PUT /auth/me — save the profile, then refresh the user signal so the name
  // updates everywhere (sidebar + dashboard greeting).
  updateProfile(data: {
    fullName: string;
    currentPosition: string;
    targetPosition: string;
    linkedin: string;
  }): Observable<UserProfile> {
    return this.http.put<ProfileResponse>(`${API_BASE_URL}/auth/me`, data).pipe(
      map((res) => toProfile(res.user)),
      tap((profile) => this._user.set({ fullName: profile.fullName, email: profile.email })),
    );
  }
}
