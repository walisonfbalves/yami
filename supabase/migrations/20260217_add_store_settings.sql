-- Add missing columns to stores table for settings
alter table public.stores 
add column if not exists bio text,
add column if not exists is_open boolean default false,
add column if not exists prep_time text,
add column if not exists delivery_fee numeric,
add column if not exists min_order numeric,
add column if not exists pix_key text;
