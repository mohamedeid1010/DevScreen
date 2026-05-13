create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  github_user_id text,
  github_login text,
  display_name text,
  avatar_url text,
  profile_url text,
  auth_provider text not null default 'github',
  metadata jsonb not null default '{}'::jsonb,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_github_login_idx on public.profiles (github_login);

revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select, insert, update, delete on table public.profiles to service_role;

alter table public.profiles enable row level security;

comment on table public.profiles is 'Backend-only GitHub profile cache created after successful Supabase auth.';