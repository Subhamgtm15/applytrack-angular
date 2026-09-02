import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { ApplicationStatus, JobType } from '../../models/application.model';

@Component({
  selector: 'app-add-application',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/applications" class="text-sm text-indigo-600 hover:underline">← Back</a>
    <h1 class="text-2xl font-bold text-slate-900 mt-2 mb-6">New Application</h1>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="max-w-2xl space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Company</label>
        <input
          formControlName="company"
          class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        @if (form.controls.company.touched && form.controls.company.invalid) {
          <p class="text-xs text-red-500 mt-1">Company is required.</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
        <input
          formControlName="role"
          class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        @if (form.controls.role.touched && form.controls.role.invalid) {
          <p class="text-xs text-red-500 mt-1">Role is required.</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Location</label>
        <input
          formControlName="location"
          class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        @if (form.controls.location.touched && form.controls.location.invalid) {
          <p class="text-xs text-red-500 mt-1">Location is required.</p>
        }
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Job type</label>
          <select
            formControlName="jobType"
            class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            formControlName="status"
            class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Date applied</label>
          <input
            type="date"
            formControlName="dateApplied"
            class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          @if (form.controls.dateApplied.touched && form.controls.dateApplied.invalid) {
            <p class="text-xs text-red-500 mt-1">Date is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Salary (optional)</label>
          <input
            formControlName="salary"
            placeholder="$120k"
            class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
        <textarea
          formControlName="notes"
          rows="3"
          class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          [disabled]="form.invalid"
          class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save application
        </button>
        <a
          routerLink="/applications"
          class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </a>
      </div>
    </form>
  `,
})
export class AddApplicationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly appService = inject(ApplicationService);
  private readonly router = inject(Router);

  // The form's shape + rules, defined in TS. nonNullable → controls are plain strings.
  readonly form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    location: ['', Validators.required],
    jobType: ['full-time' as JobType, Validators.required],
    status: ['applied' as ApplicationStatus, Validators.required],
    dateApplied: ['', Validators.required],
    salary: [''],
    notes: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // reveal all validation messages
      return;
    }
    const value = this.form.getRawValue();
    this.appService.addApplication({
      ...value,
      salary: value.salary || undefined,
      notes: value.notes || undefined,
    });
    this.router.navigate(['/applications']);
  }
}
