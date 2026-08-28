-- Proving Ground: cross-device progress sync
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  completed  jsonb not null default '{}'::jsonb,
  cards      jsonb not null default '{}'::jsonb,
  lang       text default 'js',
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Each user can only read and write their own row.
create policy "read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "update own progress"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
