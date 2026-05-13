import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function SettingsManager() {
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) {
        setFacebook(data.facebook_url || '');
        setInstagram(data.instagram_url || '');
        setEmail(data.contact_email || '');
        setYoutubeVideoId(data.youtube_video_id || '');
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          facebook_url: facebook,
          instagram_url: instagram,
          contact_email: email,
          youtube_video_id: youtubeVideoId,
        })
        .eq('id', 1);
      if (error) throw error;
      showToast('success', 'Settings saved');
    } catch {
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-secondary">Loading settings...</p>;

  return (
    <div>
      <h2 className="heading-md" style={{ marginBottom: 'var(--space-lg)' }}>Site Settings</h2>
      <form onSubmit={handleSave} className="glass-card" style={{ padding: 'var(--space-xl)' }}>
        <div className="form-group">
          <label htmlFor="settings-fb" className="form-label">Facebook URL</label>
          <input id="settings-fb" type="url" className="form-input" value={facebook}
            onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
        </div>
        <div className="form-group">
          <label htmlFor="settings-ig" className="form-label">Instagram URL</label>
          <input id="settings-ig" type="url" className="form-input" value={instagram}
            onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
        </div>
        <div className="form-group">
          <label htmlFor="settings-email" className="form-label">Contact Email</label>
          <input id="settings-email" type="email" className="form-input" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="tomburden86@gmail.com" />
        </div>
        <div className="form-group">
          <label htmlFor="settings-video" className="form-label">YouTube Video ID</label>
          <input id="settings-video" type="text" className="form-input" value={youtubeVideoId}
            onChange={(e) => setYoutubeVideoId(e.target.value)} placeholder="e.g. 9WhguJtzWuI" />
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
            The ID from the URL (e.g. watch?v=<b>9WhguJtzWuI</b>)
          </p>
        </div>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
