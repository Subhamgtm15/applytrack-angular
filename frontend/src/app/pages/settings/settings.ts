import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Settings</h1>
        <p class="mt-1 text-slate-500">Manage your profile.</p>
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <section class="mb-8">
          <h2 class="mb-4 text-lg font-semibold text-slate-900">Profile</h2>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Full name *</label>
              <input
                type="text"
                formControlName="fullName"
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
              />
              @if (form.controls.fullName.touched && form.controls.fullName.invalid) {
                <p class="mt-1 text-sm text-red-600">Full name is required</p>
              }
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                [value]="email()"
                disabled
                class="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-400 outline-none"
              />
              <p class="mt-1 text-xs text-slate-400">Email can't be changed.</p>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-lg font-semibold text-slate-900">Career</h2>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Current position</label>
              <input
                type="text"
                formControlName="currentPosition"
                placeholder="e.g. Frontend Developer"
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Target position</label>
              <input
                type="text"
                formControlName="targetPosition"
                placeholder="e.g. Senior Engineer"
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-2 block text-sm font-medium text-slate-700">LinkedIn</label>
              <input
                type="text"
                formControlName="linkedin"
                placeholder="https://linkedin.com/in/your-handle"
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        @if (error()) {
          <p class="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{{ error() }}</p>
        }
        @if (saved()) {
          <p class="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Profile saved.</p>
        }

        <div class="flex justify-end border-t border-slate-200 pt-6">
          <button
            type="submit"
            [disabled]="saving()"
            class="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ saving() ? 'Saving\u2026' : 'Save changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly email = signal('');
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    currentPosition: [''],
    targetPosition: [''],
    linkedin: [''],
  });

  ngOnInit(): void {
    // Load the full profile into the form (email shown read-only).
    this.auth.getProfile().subscribe({
      next: (p) => {
        this.email.set(p.email);
        this.form.patchValue({
          fullName: p.fullName,
          currentPosition: p.currentPosition,
          targetPosition: p.targetPosition,
          linkedin: p.linkedin,
        });
      },
      error: () => this.error.set('Could not load your profile.'),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.saved.set(false);
    this.saving.set(true);
    this.auth.updateProfile(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Could not save. Please try again.');
      },
    });
  }
}
