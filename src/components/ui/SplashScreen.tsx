import { useState, useEffect } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'fade-in' | 'hold' | 'fade-out'>('loading');

  useEffect(() => {
    // Lock scroll during splash
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase === 'fade-in') {
      const timer = setTimeout(() => {
        setPhase('hold');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (phase === 'hold') {
      const timer = setTimeout(() => {
        setPhase('fade-out');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (phase === 'fade-out') {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleLoad = () => {
    if (phase === 'loading') {
      // Slight delay to ensure React has painted the initial loading state (opacity 0)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('fade-in');
        });
      });
    }
  };

  useEffect(() => {
    // Failsafe in case image fails to load or load event is missed
    const failsafe = setTimeout(() => {
      if (phase === 'loading') handleLoad();
    }, 1000);
    return () => clearTimeout(failsafe);
  }, [phase]);

  return (
    <div className={`splash splash--${phase}`} aria-hidden="true">
      <div className="splash__content">
        <img
          src="/images/splash-logo.png"
          alt="Hysteria"
          className="splash__logo"
          onLoad={handleLoad}
          onError={(e) => {
            // Fallback to text if logo image not found
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
            handleLoad();
          }}
        />
        <h1 className="splash__fallback-text" style={{ display: 'none' }}>
          HYSTERIA
        </h1>
      </div>
    </div>
  );
}
