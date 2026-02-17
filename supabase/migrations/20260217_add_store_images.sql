-- Add logo and banner fields to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS banner_url text;
