-- DeSuper Comprehensive Game Save Schema for Supabase
-- Run this in the Supabase SQL Editor

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text default 'CyberOperative',
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

-- ============================================
-- 2. GAME SAVES TABLE (JSONB for flexible save data)
-- ============================================
create table if not exists public.game_saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  slot_name text default 'default',
  save_data jsonb not null default '{}'::jsonb,
  play_time_seconds int default 0,
  last_played timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, slot_name)
);

-- ============================================
-- 3. USER SETTINGS TABLE
-- ============================================
create table if not exists public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  sound_enabled boolean default true,
  haptics_enabled boolean default true,
  theme_accent text default 'cyan',
  notifications_enabled boolean default true,
  difficulty text default 'normal',
  language text default 'en',
  custom_settings jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 4. ACHIEVEMENTS TABLE
-- ============================================
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id text not null,
  title text not null,
  description text,
  icon text,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, achievement_id)
);

-- ============================================
-- 5. LEADERBOARD TABLE
-- ============================================
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  display_name text default 'CyberOperative',
  total_xp int default 0,
  highest_level int default 1,
  missions_completed int default 0,
  bosses_defeated int default 0,
  rank text default 'ZERO',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_game_saves_user_id on public.game_saves(user_id);
create index if not exists idx_achievements_user_id on public.achievements(user_id);
create index if not exists idx_leaderboard_total_xp on public.leaderboard(total_xp desc);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Game Saves RLS
alter table public.game_saves enable row level security;

create policy "Users can view own saves"
  on public.game_saves for select
  using (auth.uid() = user_id);

create policy "Users can insert own saves"
  on public.game_saves for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saves"
  on public.game_saves for update
  using (auth.uid() = user_id);

create policy "Users can delete own saves"
  on public.game_saves for delete
  using (auth.uid() = user_id);

-- User Settings RLS
alter table public.user_settings enable row level security;

create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Achievements RLS
alter table public.achievements enable row level security;

create policy "Users can view own achievements"
  on public.achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on public.achievements for insert
  with check (auth.uid() = user_id);

-- Leaderboard RLS (public read, own write)
alter table public.leaderboard enable row level security;

create policy "Anyone can view leaderboard"
  on public.leaderboard for select
  using (true);

create policy "Users can insert own leaderboard entry"
  on public.leaderboard for insert
  with check (auth.uid() = user_id);

create policy "Users can update own leaderboard entry"
  on public.leaderboard for update
  using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_game_saves_updated
  before update on public.game_saves
  for each row execute procedure public.handle_updated_at();

create trigger on_user_settings_updated
  before update on public.user_settings
  for each row execute procedure public.handle_updated_at();

create trigger on_leaderboard_updated
  before update on public.leaderboard
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', 'CyberOperative'));
  
  insert into public.user_settings (user_id) values (new.id);
  insert into public.leaderboard (user_id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'CyberOperative'));
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update leaderboard on profile update
create or replace function public.handle_profile_leaderboard_sync()
returns trigger as $$
begin
  update public.leaderboard
  set 
    display_name = new.display_name,
    total_xp = new.xp,
    highest_level = new.level,
    missions_completed = array_length(new.completed_missions, 1),
    bosses_defeated = array_length(new.defeated_bosses, 1),
    rank = new.rank,
    updated_at = timezone('utc'::text, now())
  where user_id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_leaderboard_sync
  after update on public.profiles
  for each row execute procedure public.handle_profile_leaderboard_sync();

-- ============================================
-- AI MEMORY & SKILL RETENTION TABLES
-- ============================================

-- ============================================
-- 6. AI PROFILES (per user)
-- ============================================
create table if not exists public.ai_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  ai_name text default 'Eli-v0.1',
  ai_personality text default 'cyber_mentor',
  system_prompt text,
  memory_consent boolean default false,
  total_interactions int default 0,
  last_interaction_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 7. AI SKILLS (acquired competencies)
-- ============================================
create table if not exists public.ai_skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skill_name text not null,
  skill_category text default 'general',
  proficiency_level int default 1 check (proficiency_level between 1 and 10),
  description text,
  source text default 'conversation',
  source_file text,
  metadata jsonb default '{}'::jsonb,
  acquired_at timestamp with time zone default timezone('utc'::text, now()),
  last_used_at timestamp with time zone,
  use_count int default 0,
  unique(user_id, skill_name)
);

-- ============================================
-- 8. AI LONG-TERM MEMORY
-- ============================================
create table if not exists public.ai_long_term_memory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  memory_type text not null,
  content text not null,
  relevance_score float default 0.5 check (relevance_score between 0 and 1),
  source_interaction_id uuid,
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 9. AI MEMORY LOGS (working memory)
-- ============================================
create table if not exists public.ai_memory_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_id text,
  role text not null,
  content text not null,
  tokens_used int,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 10. AI SKILL IMPORTS (tracking)
-- ============================================
create table if not exists public.ai_skill_imports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_size int,
  parse_status text default 'pending',
  skills_imported int default 0,
  skills_skipped int default 0,
  error_message text,
  raw_content text,
  processed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 11. AI CONVERSATION SESSIONS
-- ============================================
create table if not exists public.ai_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_id text not null unique,
  title text,
  summary text,
  message_count int default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- ============================================
-- AI INDEXES
-- ============================================
create index if not exists idx_ai_skills_user_id on public.ai_skills(user_id);
create index if not exists idx_ai_skills_category on public.ai_skills(skill_category);
create index if not exists idx_ai_long_term_memory_user_id on public.ai_long_term_memory(user_id);
create index if not exists idx_ai_long_term_memory_type on public.ai_long_term_memory(memory_type);
create index if not exists idx_ai_memory_logs_user_id on public.ai_memory_logs(user_id);
create index if not exists idx_ai_memory_logs_session on public.ai_memory_logs(session_id);
create index if not exists idx_ai_sessions_user_id on public.ai_sessions(user_id);
create index if not exists idx_ai_skill_imports_user_id on public.ai_skill_imports(user_id);

-- ============================================
-- AI ROW LEVEL SECURITY
-- ============================================
alter table public.ai_profiles enable row level security;
alter table public.ai_skills enable row level security;
alter table public.ai_long_term_memory enable row level security;
alter table public.ai_memory_logs enable row level security;
alter table public.ai_skill_imports enable row level security;
alter table public.ai_sessions enable row level security;

-- AI Profiles policies
create policy "Users can manage own AI profile"
  on public.ai_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- AI Skills policies
create policy "Users can manage own skills"
  on public.ai_skills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Long-term memory policies
create policy "Users can manage own memory"
  on public.ai_long_term_memory for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Memory logs policies
create policy "Users can manage own memory logs"
  on public.ai_memory_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Skill imports policies
create policy "Users can manage own imports"
  on public.ai_skill_imports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sessions policies
create policy "Users can manage own sessions"
  on public.ai_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- AI FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at for AI tables
create trigger on_ai_profiles_updated
  before update on public.ai_profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_ai_long_term_memory_updated
  before update on public.ai_long_term_memory
  for each row execute procedure public.handle_updated_at();

-- Auto-create AI profile on user creation
create or replace function public.handle_new_ai_profile()
returns trigger as $$
begin
  insert into public.ai_profiles (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_ai_profile on auth.users;
create trigger on_auth_user_ai_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_ai_profile();

-- Update interaction count
create or replace function public.handle_ai_interaction()
returns trigger as $$
begin
  update public.ai_profiles
  set 
    total_interactions = total_interactions + 1,
    last_interaction_at = timezone('utc'::text, now())
  where user_id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_ai_memory_log_created
  after insert on public.ai_memory_logs
  for each row execute procedure public.handle_ai_interaction();
