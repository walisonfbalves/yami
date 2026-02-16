-- Ensure stores table exists
create table if not exists public.stores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  slug text not null unique,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.stores enable row level security;

-- Policies

-- Allow users to view their own store
drop policy if exists "Users can view their own store" on public.stores;
create policy "Users can view their own store"
  on public.stores for select
  using (auth.uid() = user_id);

-- Allow users to create their own store
drop policy if exists "Users can create their own store" on public.stores;
create policy "Users can create their own store"
  on public.stores for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own store
drop policy if exists "Users can update their own store" on public.stores;
create policy "Users can update their own store"
  on public.stores for update
  using (auth.uid() = user_id);
