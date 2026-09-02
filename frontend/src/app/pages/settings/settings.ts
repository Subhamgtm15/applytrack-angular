import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
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
