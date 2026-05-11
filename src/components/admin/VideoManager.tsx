import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './VideoManager.css';

function extractVideoId(input: string): string {
  if (!input) return '';
  // Match YouTube URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input;
}

export default function VideoManager() {
  const [videoInput, setVideoInput] = useState('');
  const [_currentId, setCurrentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('youtube_video_id').eq('id', 1).single();
      if (data?.youtube_video_id) {
        setVideoInput(data.youtube_video_id);
        setCurrentId(data.youtube_video_id);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const videoId = extractVideoId(videoInput);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ youtube_video_id: videoId })
        .eq('id', 1);
      if (error) throw error;
      setCurrentId(videoId);
      setVideoInput(videoId);
      showToast('success', 'Video updated');
    } catch {
      showToast('error', 'Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  const previewId = extractVideoId(videoInput);

  if (loading) return <p className="text-secondary">Loading...</p>;

  return (
    <div>
      <h2 className="heading-md" style={{ marginBottom: 'var(--space-lg)' }}>Featured Video</h2>
      <form onSubmit={handleSave} className="glass-card" style={{ padding: 'var(--space-xl)' }}>
        <div className="form-group">
          <label htmlFor="video-url" className="form-label">YouTube Video URL or ID</label>
          <input id="video-url" type="text" className="form-input" value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or video ID" />
        </div>

        {previewId && (
          <div className="video-manager__preview">
            <p className="form-label">Preview</p>
            <img
              src={`https://img.youtube.com/vi/${previewId}/maxresdefault.jpg`}
              alt="Video thumbnail"
              className="video-manager__thumb"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${previewId}/hqdefault.jpg`;
              }}
            />
            <p className="video-manager__id">Video ID: <code>{previewId}</code></p>
          </div>
        )}

        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Video'}
        </button>
      </form>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
