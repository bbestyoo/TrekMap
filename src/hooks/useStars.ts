/**
 * useStars — draws an animated starfield on the #stars-canvas element.
 * Stars twinkle and are hidden smoothly when the user zooms into Nepal terrain.
 */

import { useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;   // twinkle phase offset
  bright: number;  // base brightness 0–1
}

const STAR_COUNT = 480;

export function useStars(hideStars: boolean) {
  useEffect(() => {
    const canvas = document.getElementById('stars-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate so stars fill the new size
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        r:      Math.random() ** 2 * 1.6 + 0.15,  // power distribution — mostly tiny, few large
        speed:  Math.random() * 0.35 + 0.04,
        phase:  Math.random() * Math.PI * 2,
        bright: Math.random() * 0.55 + 0.25,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      for (const star of stars) {
        // Twinkle: sinusoidal opacity variation
        const twinkle = star.bright + Math.sin(t * star.speed + star.phase) * 0.25;
        const alpha   = Math.max(0, Math.min(1, twinkle));

        // Core dot — bright white/silver
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${alpha})`;
        ctx.fill();

        // Soft blue-white glow halo for brighter stars
        if (star.r > 0.8) {
          const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 4.5);
          grad.addColorStop(0,   `rgba(180, 210, 255, ${alpha * 0.4})`);
          grad.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Show/hide based on zoom level
  useEffect(() => {
    const canvas = document.getElementById('stars-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    canvas.classList.toggle('hidden', hideStars);
  }, [hideStars]);
}
