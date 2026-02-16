-- Create categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  name text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Policies for categories

-- Allow read access if user is the owner of the store
create policy "Categories are viewable by store owner"
  on public.categories for select
  using (
    auth.uid() in (
      select user_id from public.stores where id = categories.store_id
    )
  );

-- Allow insert access if user is the owner of the store
create policy "Categories are insertable by store owner"
  on public.categories for insert
  with check (
    auth.uid() in (
      select user_id from public.stores where id = store_id
    )
  );

-- Allow update access if user is the owner of the store
create policy "Categories are updateable by store owner"
  on public.categories for update
  using (
    auth.uid() in (
      select user_id from public.stores where id = store_id
    )
  );

-- Allow delete access if user is the owner of the store
create policy "Categories are deletable by store owner"
  on public.categories for delete
  using (
    auth.uid() in (
      select user_id from public.stores where id = store_id
    )
  );


-- Policies for products

-- Allow read access if user is the owner of the store
create policy "Products are viewable by store owner"
  on public.products for select
  using (
    auth.uid() in (
      select user_id from public.stores where id = products.store_id
    )
  );

-- Allow insert access if user is the owner of the store
create policy "Products are insertable by store owner"
  on public.products for insert
  with check (
    auth.uid() in (
      select user_id from public.stores where id = store_id
    )
  );

-- Allow update access if user is the owner of the store
create policy "Products are updateable by store owner"
  on public.products for update
  using (
    auth.uid() in (
      select user_id from public.stores where id = store_id
    )
  );

-- Allow delete access if user is the owner of the store
create policy "Products are deletable by store owner"
  on public.products for delete
  using (
    auth.uid() in (
      select user_id from public.stores where id = store_id
    )
  );
