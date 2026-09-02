// Mirrors the ApplyTrack backend shape (the fields a job application has).
export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'follow-up';

export type JobType =
  | 'full-time'
  | 'part-time'
  | 'remote'
  | 'contract'
  | 'freelance'
  | 'internship';

export interface Application {
  id: number;
  company: string;
  role: string;
  location: string;
  jobType: JobType;
  status: ApplicationStatus;
  dateApplied: string; // ISO date
  followUpDate?: string;
  interviewDate?: string;
  salary?: string;
  source?: string;
  notes?: string;
}
