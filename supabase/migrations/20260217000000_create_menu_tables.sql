-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name text NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Public categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Users can insert categories for their own stores" ON public.categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update categories for their own stores" ON public.categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete categories for their own stores" ON public.categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND user_id = auth.uid()
        )
    );

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    image_url text,
    is_available boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Public products are viewable by everyone" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Users can insert products for their own stores" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update products for their own stores" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete products for their own stores" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND user_id = auth.uid()
        )
    );

-- Storage bucket for menu images
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "Menu images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'menu-images' );

create policy "Users can upload menu images for their stores"
  on storage.objects for insert
  with check (
    bucket_id = 'menu-images' AND
    auth.role() = 'authenticated'
  );
