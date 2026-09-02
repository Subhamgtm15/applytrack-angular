# ApplyTrack

A job application tracker for keeping tabs on where you've applied, what stage each one is at, and what's coming up next.

I first built ApplyTrack in React. This is the Angular version of it. I rebuilt it mostly as a way to learn Angular by working on something I actually use.

Stack: Angular, Express, and PostgreSQL.

## Features

- Dashboard with your application stats, a weekly activity chart, upcoming interviews and follow-ups, and recent applications.
- Applications table with create, edit and delete, plus search, filters, sorting and pagination.
- Login with email and password, or with Google. Sessions use a JWT stored in an httpOnly cookie.
- A settings page for editing your profile (name, current and target role, LinkedIn).
- Stays logged in after a refresh, and each user only sees their own data.

## Tech

Frontend: Angular 21 (standalone components, signals), Tailwind CSS, ngx-charts, Reactive Forms and RxJS.

Backend: Express, PostgreSQL, JWT, bcrypt, and Passport for Google OAuth, written in TypeScript.

## Project structure

It's a monorepo with two folders:

```
frontend/   Angular app, runs on port 4200
backend/    Express + PostgreSQL API, runs on port 5000
```

## Running it locally

You'll need Node 20 or newer and a PostgreSQL database. A local one is fine, or something hosted like Neon.

Install everything (root, frontend and backend):

```bash
npm run install:all
```

Set up the backend. Copy the example env file and fill in your values (database connection, JWT secret, CLIENT_URL, and the Google keys if you want Google login), then run the migrations:

```bash
cd backend
cp .env.example .env
npm run migrate
```

Start both servers from the repo root:

```bash
npm run dev
```

This runs the Angular app and the API together.

## Notes

- Auth uses an httpOnly cookie, so the frontend sends its requests with credentials.
- For Google login, add `http://localhost:5000/auth/google/callback` to the authorized redirect URIs in Google Cloud Console.
- `backend/.env` is gitignored, so copy it from `.env.example` and add your own values.
