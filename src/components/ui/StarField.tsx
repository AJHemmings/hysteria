import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // If we already have stars, ensure they are within the new bounds
      if (starsRef.current.length > 0) {
        for (const star of starsRef.current) {
          if (star.x > canvas.width) star.x = Math.random() * canvas.width;
          if (star.y > canvas.height) star.y = Math.random() * canvas.height;
        }
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars (only if empty)
    if (starsRef.current.length === 0) {
      const isMobile = window.innerWidth < 768;
      const starCount = isMobile ? 80 : 200;
      starsRef.current = Array.from({ length: starCount }, () => {
        const size = Math.random() < 0.1 ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.2;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          opacity: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.1,
          driftY: (Math.random() - 0.5) * 0.05,
        };
      });
    }

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        // Twinkle
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = Math.max(0, star.opacity + twinkle * 0.3);

        // Drift
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap around
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        // Vary color slightly between white and icy blue
        const blueTint = Math.random() > 0.8 ? '255' : '230';
        ctx.fillStyle = `rgba(255, ${blueTint}, 255, ${currentOpacity})`;
        ctx.fill();

        // Add glow to larger/brighter stars
        if (star.size > 1.2) {
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          gradient.addColorStop(0, `rgba(0, 212, 255, ${currentOpacity * 0.4})`);
          gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
