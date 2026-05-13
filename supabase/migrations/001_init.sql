-- Run this in your Supabase SQL editor (project: fsnybbbirgssvlulnooa)

create table if not exists profiles (
  id              uuid        primary key,
  email           text,
  github_user_id  text,
  github_login    text,
  display_name    text,
  avatar_url      text,
  profile_url     text,
  auth_provider   text        not null default 'github',
  role            text        not null default 'applicant',
  metadata        jsonb       not null default '{}',
  last_sign_in_at timestamptz,
  updated_at      timestamptz not null
);

create table if not exists analyses (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null unique references profiles(id) on delete cascade,
  github_username text        not null,
  fit_band        text,
  match_summary   text,
  result          jsonb       not null,
  job_description text,
  analyzed_at     timestamptz not null default now()
);

create table if not exists github_profile_cache (
  username   text        primary key,
  data       jsonb       not null,
  fetched_at timestamptz not null default now()
);

-- To make a user an admin, run in SQL editor after they've logged in once:
-- update profiles set role = 'admin' where github_login = 'your-github-username';
