import YouTubePlayer from '../ui/YouTubePlayer';
import { useSettings } from '../../hooks/useSettings';
import './VideoSection.css';

export default function VideoSection() {
  const { settings, loading } = useSettings();

  return (
    <section className="section video-section" id="hear-us">
      <div className="section__inner">
        <h2 className="heading-lg section__title">Hear Us</h2>
        {loading ? (
          <div className="video-section__loading">
            <div className="video-section__skeleton" />
          </div>
        ) : (
          <YouTubePlayer videoId={settings.youtube_video_id} />
        )}
      </div>
    </section>
  );
}
