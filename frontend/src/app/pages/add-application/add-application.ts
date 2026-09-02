import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { ApplicationStatus, JobType } from '../../models/application.model';

@Component({
  selector: 'app-add-application',
  imports: [ReactiveFormsModule],
  templateUrl: './add-application.html',
})
export class AddApplicationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly appService = inject(ApplicationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly error = signal<string | null>(null);

  // Present only on the edit route (/addapplication/:id) — drives add-vs-edit mode.
  private readonly editId = this.route.snapshot.paramMap.get('id');
  readonly isEdit = this.editId !== null;

  // The form's shape + rules, defined in TS. nonNullable → controls are plain strings.
  readonly form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    location: ['', Validators.required],
    jobType: ['full-time' as JobType, Validators.required],
    status: ['applied' as ApplicationStatus, Validators.required],
    dateApplied: [new Date().toISOString().split('T')[0], Validators.required],
    salary: [''],
    source: [''],
    followUpDate: [''],
    interviewDate: [''],
    notes: [''],
  });

  constructor() {
    // Edit mode: load the existing application and prefill the form.
    if (this.editId) {
      const existing = this.appService.getById(Number(this.editId));
      if (existing) {
        this.form.patchValue({
          company: existing.company,
          role: existing.role,
          location: existing.location,
          jobType: existing.jobType,
          status: existing.status,
          dateApplied: existing.dateApplied,
          salary: existing.salary ?? '',
          source: existing.source ?? '',
          followUpDate: existing.followUpDate ?? '',
          interviewDate: existing.interviewDate ?? '',
          notes: existing.notes ?? '',
        });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // reveal all validation messages
      return;
    }
    this.error.set(null);
    const value = this.form.getRawValue();
    const data = {
      ...value,
      salary: value.salary || undefined,
      source: value.source || undefined,
      followUpDate: value.followUpDate || undefined,
      interviewDate: value.interviewDate || undefined,
      notes: value.notes || undefined,
    };

    const request = this.editId
      ? this.appService.updateApplication(Number(this.editId), data)
      : this.appService.addApplication(data);

    request.subscribe({
      next: () => this.router.navigate(['/applications']),
      error: () => this.error.set('Could not save the application. Please try again.'),
    });
  }

  clearForm(): void {
    this.form.reset();
  }
}
