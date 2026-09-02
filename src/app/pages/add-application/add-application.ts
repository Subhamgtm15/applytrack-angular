import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { ApplicationStatus, JobType } from '../../models/application.model';

@Component({
  selector: 'app-add-application',
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900">New Application</h1>
        <p class="mt-2 text-sm text-slate-500">Track a job you've applied to or plan to apply for.</p>
      </div>

      <!-- Job Information -->
      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">Job Information</h2>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Company Name *</label>
            <input
              type="text"
              formControlName="company"
              placeholder="e.g. Stripe"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
            @if (form.controls.company.touched && form.controls.company.invalid) {
              <p class="mt-1 text-sm text-red-600">Company Name is required</p>
            }
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Job Title *</label>
            <input
              type="text"
              formControlName="role"
              placeholder="e.g. Frontend Engineer"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
            @if (form.controls.role.touched && form.controls.role.invalid) {
              <p class="mt-1 text-sm text-red-600">Job Title is required</p>
            }
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Location *</label>
            <input
              type="text"
              formControlName="location"
              placeholder="e.g. Kathmandu, Nepal"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
            @if (form.controls.location.touched && form.controls.location.invalid) {
              <p class="mt-1 text-sm text-red-600">Location is required</p>
            }
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Job Type *</label>
            <select
              formControlName="jobType"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            >
              <option value="">Select job type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
            @if (form.controls.jobType.touched && form.controls.jobType.invalid) {
              <p class="mt-1 text-sm text-red-600">Job Type is required</p>
            }
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Salary Range</label>
            <input
              type="text"
              formControlName="salary"
              placeholder="e.g. NPR 80k - 120k"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Source</label>
            <input
              type="text"
              formControlName="source"
              placeholder="LinkedIn, Referral..."
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      <!-- Status & Dates -->
      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">Status & Dates</h2>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Status *</label>
            <select
              formControlName="status"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Date Applied *</label>
            <input
              type="date"
              formControlName="dateApplied"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
            @if (form.controls.dateApplied.touched && form.controls.dateApplied.invalid) {
              <p class="mt-1 text-sm text-red-600">Date Applied is required</p>
            }
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Follow-up Date</label>
            <input
              type="date"
              formControlName="followUpDate"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
            />
          </div>

          @if (form.controls.status.value === 'interview') {
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Interview Date</label>
              <input
                type="date"
                formControlName="interviewDate"
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
              />
              <p class="mt-1 text-xs text-slate-400">Shown in Upcoming Interviews on your dashboard.</p>
            </div>
          }
        </div>
      </section>

      <!-- Notes -->
      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">Notes</h2>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Application Notes</label>
          <textarea
            formControlName="notes"
            rows="5"
            placeholder="Add any notes about this application..."
            class="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500"
          ></textarea>
        </div>
      </section>

      <!-- Actions -->
      <div class="flex justify-end gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          (click)="clearForm()"
          class="cursor-pointer rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear Form
        </button>
        <button
          type="submit"
          class="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          Save Application
        </button>
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
    dateApplied: [new Date().toISOString().split('T')[0], Validators.required],
    salary: [''],
    source: [''],
    followUpDate: [''],
    interviewDate: [''],
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
      source: value.source || undefined,
      followUpDate: value.followUpDate || undefined,
      interviewDate: value.interviewDate || undefined,
      notes: value.notes || undefined,
    });
    this.router.navigate(['/applications']);
  }

  clearForm(): void {
    this.form.reset();
  }
}
