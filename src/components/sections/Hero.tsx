import { useScrollPosition } from '../../hooks/useScrollPosition';
import './Hero.css';

export default function Hero() {
  const scrollY = useScrollPosition();
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Dim overlay: 0 opacity at top, 0.75 at one viewport height
  const overlayOpacity = Math.min(scrollY / viewportHeight, 0.75);

  return (
    <section className="hero" aria-label="Hero banner">
      {/* Fixed background image */}
      <div className="hero__bg" />

      {/* Dynamic dim overlay */}
      <div
        className="hero__overlay"
        style={{ backgroundColor: `rgba(10, 10, 26, ${overlayOpacity})` }}
      />

      {/* Content */}
      <div className="hero__content">
        <h1 className="hero__title">HYSTERIA</h1>
        <p className="hero__subtitle">A Tribute to Muse</p>
      </div>



      {/* Scroll indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-arrow" />
      </div>
    </section>
  );
}
