import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div class="text-center">
        @if (error()) {
          <p class="text-sm text-red-600">{{ error() }}</p>
          <a routerLink="/login" class="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Back to sign in
          </a>
        } @else {
          <p class="text-slate-600">Signing you in…</p>
        }
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    // The backend redirects here as /auth/callback#token=<jwt>.
    const fragment = this.route.snapshot.fragment;
    const token = new URLSearchParams(fragment ?? '').get('token');

    if (!token) {
      this.error.set('Google sign-in failed — no token received.');
      return;
    }

    this.auth.session(token).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set('Google sign-in failed. Please try again.'),
    });
  }
}
