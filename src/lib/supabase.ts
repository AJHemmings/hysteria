import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const hasCredentials =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl !== 'your_supabase_project_url';

if (!hasCredentials) {
  console.warn(
    '[Hysteria] Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = hasCredentials
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://xyzcompany.supabase.co', 'public-anon-key');

