-- Adds an optional scheduled interview date.
-- This powers the "Upcoming Interviews" feature: when an application's status is
-- "interview", the user can record WHEN the interview is scheduled so it can be
-- surfaced on the dashboard, sorted by nearest date.
--
-- Nullable on purpose: an application can be in the interview stage without a
-- confirmed date yet, and older rows won't have one.

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS interview_date DATE;
