-- Adds a permanent "reached interview stage" milestone flag.
-- Unlike `status` (a single mutable stage), `had_interview` records history:
-- once an application reaches the interview stage it stays true even if the
-- application is later marked rejected/offer/etc.

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS had_interview BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing rows: any application currently in the interview stage
-- has, by definition, reached the interview milestone.
UPDATE applications
  SET had_interview = true
  WHERE status = 'interview';
