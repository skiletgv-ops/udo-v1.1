import React, { useEffect, useRef } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  size: number;
  color: string;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useMousePosition();

  // Smoothed mouse offsets for lerp
  const targetCamX = useRef(0);
  const targetCamY = useRef(0);
  const currentCamX = useRef(0);
  const currentCamY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = window.innerHeight * (window.devicePixelRatio || 1));

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };

    window.addEventListener('resize', handleResize);

    const STAR_COUNT = 800;
    const FOCAL_LENGTH = 400;
    const MAX_DEPTH = 1500;

    // Generate 800 stars with 3D coordinates
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const z = Math.random() * MAX_DEPTH;
      return {
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z,
        prevZ: z,
        size: Math.random() * 2 + 0.8,
        color: Math.random() > 0.15 ? '#00D4AA' : '#8b5cf6'
      };
    });

    const render = () => {
      // Smooth lerp mouse camera shift
      targetCamX.current = mousePos.normalizedX * 120;
      targetCamY.current = mousePos.normalizedY * 120;

      currentCamX.current += (targetCamX.current - currentCamX.current) * 0.05;
      currentCamY.current += (targetCamY.current - currentCamY.current) * 0.05;

      const dpr = window.devicePixelRatio || 1;
      const centerX = (width / dpr) / 2;
      const centerY = (height / dpr) / 2;

      ctx.clearRect(0, 0, width, height);

      // Dark sci-fi gradient background glow
      const bgGrad = ctx.createRadialGradient(
        centerX + currentCamX.current,
        centerY + currentCamY.current,
        100,
        centerX,
        centerY,
        width / dpr
      );
      bgGrad.addColorStop(0, 'rgba(10, 15, 30, 0.6)');
      bgGrad.addColorStop(0.6, 'rgba(10, 10, 15, 0.95)');
      bgGrad.addColorStop(1, '#0a0a0f');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Array to keep projected 2D coordinates for constellation lines
      const projectedStars: { px: number; py: number; z: number }[] = [];

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.prevZ = star.z;
        star.z -= 2.5; // fly toward camera

        // Reset star if it passes the camera
        if (star.z <= 0) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * 3000;
          star.y = (Math.random() - 0.5) * 3000;
        }

        // 3D projection
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + star.z);
        const px = (star.x - currentCamX.current) * scale + centerX;
        const py = (star.y - currentCamY.current) * scale + centerY;

        // Previous frame projection for motion trail
        const prevScale = FOCAL_LENGTH / (FOCAL_LENGTH + star.prevZ);
        const prevPx = (star.x - currentCamX.current) * prevScale + centerX;
        const prevPy = (star.y - currentCamY.current) * prevScale + centerY;

        // Check screen boundaries
        if (px < 0 || px > width / dpr || py < 0 || py > height / dpr) {
          continue;
        }

        const alpha = Math.min(1, Math.max(0, 1 - star.z / MAX_DEPTH));

        // Draw motion trail for near stars
        if (star.z < 600) {
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = alpha * 0.4;
          ctx.lineWidth = star.size * scale;
          ctx.stroke();
        }

        // Draw star body
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, star.size * scale), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Draw glow halo for close stars
        if (star.z < 400) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * scale * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = star.color === '#00D4AA' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(139, 92, 246, 0.15)';
          ctx.globalAlpha = alpha * 0.6;
          ctx.fill();
        }

        if (star.z < 800) {
          projectedStars.push({ px, py, z: star.z });
        }
      }

      // Draw constellation lines between nearby stars (< 120px)
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#00D4AA';

      const maxLen = projectedStars.length;
      for (let i = 0; i < Math.min(maxLen, 120); i++) {
        for (let j = i + 1; j < Math.min(maxLen, 120); j++) {
          const s1 = projectedStars[i];
          const s2 = projectedStars[j];
          const dx = s1.px - s2.px;
          const dy = s1.py - s2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(s1.px, s1.py);
            ctx.lineTo(s2.px, s2.py);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
