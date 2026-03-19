-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- Playlists table
create table if not exists glint_playlists (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '[]'::jsonb,
  updated_at text
);

-- Liked songs table
create table if not exists glint_liked (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '[]'::jsonb,
  updated_at text
);

-- Enable Row Level Security
alter table glint_playlists enable row level security;
alter table glint_liked enable row level security;

-- Users can only access their own data
create policy "Users can manage own playlists"
  on glint_playlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own liked songs"
  on glint_liked for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
