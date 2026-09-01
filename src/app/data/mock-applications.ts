import { Application } from '../models/application.model';

// Stand-in data until we wire the real Express/PostgreSQL API later.
export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    company: 'Vercel',
    role: 'Frontend Engineer',
    location: 'Remote',
    jobType: 'remote',
    status: 'interview',
    dateApplied: '2026-08-20',
    salary: '$120k',
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Full-Stack Developer',
    location: 'Dublin, IE',
    jobType: 'full-time',
    status: 'applied',
    dateApplied: '2026-08-24',
  },
  {
    id: 3,
    company: 'Linear',
    role: 'Product Engineer',
    location: 'Remote',
    jobType: 'remote',
    status: 'offer',
    dateApplied: '2026-08-10',
    salary: '$135k',
  },
  {
    id: 4,
    company: 'Figma',
    role: 'UI Engineer',
    location: 'London, UK',
    jobType: 'full-time',
    status: 'rejected',
    dateApplied: '2026-08-05',
  },
  {
    id: 5,
    company: 'Notion',
    role: 'Angular Developer',
    location: 'Kathmandu, NP',
    jobType: 'contract',
    status: 'follow-up',
    dateApplied: '2026-08-27',
  },
];
