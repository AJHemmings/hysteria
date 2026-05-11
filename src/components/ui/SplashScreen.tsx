import { useState, useEffect } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'fade-in' | 'hold' | 'fade-out'>('fade-in');

  useEffect(() => {
    // Lock scroll during splash
    document.body.style.overflow = 'hidden';

    // Phase 1: Fade in everything (1s)
    const holdTimer = setTimeout(() => {
      setPhase('hold');
    }, 1000);

    // Phase 2: Hold (2s)
    const fadeOutTimer = setTimeout(() => {
      setPhase('fade-out');
    }, 3000);

    // Phase 3: Complete
    const completeTimer = setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div className={`splash splash--${phase}`} aria-hidden="true">
      <div className="splash__content">
        <img
          src="/images/splash-logo.png"
          alt="Hysteria"
          className="splash__logo"
          onError={(e) => {
            // Fallback to text if logo image not found
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <h1 className="splash__fallback-text" style={{ display: 'none' }}>
          HYSTERIA
        </h1>
      </div>
    </div>
  );
}
