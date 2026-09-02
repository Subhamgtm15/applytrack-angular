# ApplyTrack

A job application tracker I use to keep tabs on where I've applied, what stage each one is at, and what's coming up next.

I first built ApplyTrack in React. This repo is the **Angular rebuild** — same product, rewritten from scratch to actually learn Angular (signals, standalone components, reactive forms, the RxJS side of things) instead of just skimming the docs. Coming from a React/Node background, I wanted a real app to port rather than a toy example.

**Stack:** Angular 21 · Express · PostgreSQL

---

## Features

- **Dashboard** — application stats, a 6-week activity chart, upcoming interviews/follow-ups, and your most recent applications.
- **Applications** — full CRUD in a sortable, filterable table, with server-side search (debounced) and pagination.
- **Auth** — email/password and Google sign-in. Sessions live in a JWT stored as an httpOnly cookie, not in localStorage.
- **Profile** — edit your name, current/target role, and LinkedIn from Settings.
- Stays logged in across refreshes, data is scoped per user.

## Tech

**Frontend** — Angular 21 (standalone components, signals, zoneless change detection), Tailwind CSS v4, ngx-charts, Reactive Forms, RxJS.

**Backend** — Express 5, PostgreSQL (`pg`), JWT + bcrypt, Passport for Google OAuth — all TypeScript.

## Project structure

Small monorepo, two workspaces:

```
.
├── frontend/   # Angular app  (localhost:4200)
└── backend/    # Express + PostgreSQL API  (localhost:5000)
```

## Running it locally

You'll need **Node 20+** and a **PostgreSQL** database — a local instance is fine, or something hosted like Neon.

```bash
# 1. install everything (root, frontend, backend)
npm run install:all
```

```bash
# 2. set up the backend
cd backend
cp .env.example .env
#   then fill in .env:
#   - DB connection (DATABASE_URL, or the DB_* fields for local Postgres)
#   - JWT_SECRET
#   - CLIENT_URL=http://localhost:4200
#   - Google OAuth keys (optional, only if you want Google sign-in)
npm run migrate          # create the tables
```

```bash
# 3. start both servers together (from the repo root)
npm run dev
```

That boots the Angular dev server and the API side by side (via `concurrently`), so you get one terminal with labelled `frontend` / `backend` output.

## A few things I wanted to get right

- **State lives in services as signals** (`AuthService`, `ApplicationService`) — components stay thin and just read the signals. Coming from Zustand, this mapped over cleanly.
- **Cookie-based auth.** The token is an httpOnly cookie set by the API; the Angular side just sends `withCredentials` via an interceptor. No tokens sitting in JS.
- **The search** is a proper RxJS pipeline — `debounceTime → distinctUntilChanged → switchMap` — so it hits the API only when you pause typing, and stale requests get cancelled.

## Notes

- Google OAuth needs a client in Google Cloud Console with `http://localhost:5000/auth/google/callback` added to the authorized redirect URIs.
- `backend/.env` is gitignored — copy it from `.env.example` and fill in your own values.
