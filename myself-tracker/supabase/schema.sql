-- Supabase schema skeleton (fill with full definitions later)

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text,
  display_name text,
  age_years int,
  height_cm int,
  created_at timestamptz default now()
);

-- Add other tables here: daily_tasks, health_daily_metrics, skills, certifications, etc.