-- Supabase schema for DeSuper
-- Run this in the Supabase SQL Editor

-- Profiles table linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar text default 'cyber_ninja',
  suit_color text default '#06b6d4',
  helmet_style text default 'visor_alpha',
  companion_skin text default 'aura_cyan',
  theme_accent text default 'cyan',
  badge_title text default 'REBOOT OPERATIVE',
  level int default 1,
  xp int default 0,
  coins int default 100,
  rank text default 'ZERO',
  streak int default 1,
  completed_missions text[] default '{}',
  unlocked_skills text[] default '{py_print}',
  defeated_bosses text[] default '{}',
  completed_projects text[] default '{}',
  stats jsonb default '{"codeExecutions":0,"errorsEncountered":0,"bugsPatched":0,"hintsUsed":0,"totalLinesWritten":0}'::jsonb,
  sound_enabled boolean default true,
  haptics_enabled boolean default true,
  last_played_date text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', 'CyberOperative'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
