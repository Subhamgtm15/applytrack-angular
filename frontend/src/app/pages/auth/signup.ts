import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideBriefcaseBusiness } from '@lucide/angular';
import { AuthService } from '../../services/auth.service';
import { API_BASE_URL } from '../../core/api';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, LucideBriefcaseBusiness],
  templateUrl: './signup.html',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    const { fullName, email, password } = this.form.getRawValue();
    // Signup only creates the account; the user then logs in to start a session.
    this.auth.signup(fullName, email, password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error.set(err.error?.message ?? 'Sign up failed'),
    });
  }

  continueWithGoogle(): void {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }
}
