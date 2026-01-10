-- supabase/schema.sql (Phase 1 - FIXED)

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text unique check (username ~ '^[a-zA-Z0-9_-]+$'),
  display_name text,
  created_at timestamptz default now()
);

-- Trigger: create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id, username, display_name)
  values (new.id, new.id, split_part(new.email, '@', 1), split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Daily Tasks table
create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  task_name text not null,
  is_fixed boolean default false,
  is_completed boolean default false,
  satisfaction_score integer check (satisfaction_score >= 1 and satisfaction_score <= 10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily Productivity Scores table
create table if not exists public.daily_productivity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  prev_day_score numeric(4,2) check (prev_day_score >= 0 and prev_day_score <= 10),
  current_day_score numeric(4,2) check (current_day_score >= 0 and current_day_score <= 10),
  weekly_score numeric(4,2) check (weekly_score >= 0 and weekly_score <= 10),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.daily_productivity enable row level security;

-- Profiles RLS
create policy "Users can view own profile" on public.profiles
  for all using (auth.uid() = user_id);

-- Daily Tasks RLS
create policy "Users can manage own tasks" on public.daily_tasks
  for all using (auth.uid() = user_id);

-- Daily Productivity RLS
create policy "Users can manage own productivity" on public.daily_productivity
  for all using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_daily_tasks_user_date on public.daily_tasks(user_id, date);
create index if not exists idx_daily_productivity_user_date on public.daily_productivity(user_id, date);

-- Update updated_at trigger for daily_tasks
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_daily_tasks_updated_at before update
  on public.daily_tasks for each row execute function update_updated_at_column();
