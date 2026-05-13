import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteSettings {
  id: number;
  facebook_url: string;
  instagram_url: string;
  contact_email: string;
  youtube_video_id: string;
  updated_at: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  facebook_url: '',
  instagram_url: '',
  contact_email: '',
  youtube_video_id: '9WhguJtzWuI',
  updated_at: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setSettings({
          ...data,
          youtube_video_id: data.youtube_video_id || DEFAULT_SETTINGS.youtube_video_id
        } as SiteSettings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setError('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}
