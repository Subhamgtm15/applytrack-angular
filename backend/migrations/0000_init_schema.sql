-- Base schema for ApplyTrack.
-- Creates the two core tables that all later migrations build upon.
-- Named 0000_* so the migration runner (alphabetical order) applies it first.

CREATE TABLE IF NOT EXISTS users (
  user_id          SERIAL PRIMARY KEY,
  "fullName"       TEXT NOT NULL,
  email            TEXT NOT NULL UNIQUE,
  password         TEXT,                 -- null for Google OAuth accounts
  google_id        TEXT UNIQUE,          -- null for email/password accounts
  current_position TEXT,
  target_position  TEXT,
  linkedin         TEXT
);

CREATE TABLE IF NOT EXISTS applications (
  id            SERIAL PRIMARY KEY,
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  location      TEXT,
  job_type      TEXT,
  salary        TEXT,
  source        TEXT,
  status        TEXT NOT NULL,
  date_applied  DATE NOT NULL,
  follow_up_date DATE,
  notes         TEXT,
  user_id       INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications (user_id);
