-- ============================================
-- Hysteria Band Website — Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create gig_dates table
CREATE TABLE IF NOT EXISTS public.gig_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  venue_name TEXT NOT NULL,
  city TEXT NOT NULL,
  ticket_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create site_settings table (single-row config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Enforces single row
  facebook_url TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  youtube_video_id TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert the default settings row
INSERT INTO public.site_settings (id, youtube_video_id) 
VALUES (1, '9WhguJtzWuI') 
ON CONFLICT (id) DO UPDATE SET youtube_video_id = EXCLUDED.youtube_video_id;

-- Auto-update the updated_at timestamp on changes
CREATE OR REPLACE FUNCTION update_site_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_settings_timestamp
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_timestamp();

-- ============================================
-- 3. Row Level Security
-- ============================================

-- Enable RLS on both tables
ALTER TABLE public.gig_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- gig_dates: Public read
CREATE POLICY "Allow public read on gig_dates"
  ON public.gig_dates
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- gig_dates: Authenticated write (insert, update, delete)
CREATE POLICY "Allow authenticated insert on gig_dates"
  ON public.gig_dates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on gig_dates"
  ON public.gig_dates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on gig_dates"
  ON public.gig_dates
  FOR DELETE
  TO authenticated
  USING (true);

-- site_settings: Public read
CREATE POLICY "Allow public read on site_settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- site_settings: Authenticated update only
CREATE POLICY "Allow authenticated update on site_settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. Auto-cleanup (pg_cron) — OPTIONAL
-- Only available on Supabase Pro plan and above.
-- If on free tier, skip this section.
-- The admin dashboard handles cleanup on load.
-- ============================================

-- Uncomment the following lines if on Pro plan:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule(
--   'cleanup-past-gigs',
--   '0 3 * * *',
--   $$ DELETE FROM public.gig_dates WHERE date < CURRENT_DATE; $$
-- );
