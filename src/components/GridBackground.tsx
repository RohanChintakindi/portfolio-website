import { useEffect, useRef } from 'react';

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    let frame: number;
    let t = 0;

    // Pulse nodes — random grid intersections that glow
    interface Pulse {
      x: number;
      y: number;
      life: number;
      maxLife: number;
      radius: number;
    }
    let pulses: Pulse[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const GRID = 60; // grid cell size in px

    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, w, h);

      // Offset for slow scroll effect
      const offsetY = (t * 80) % GRID;
      const offsetX = (t * 20) % GRID;

      // Draw vertical lines
      for (let x = -GRID + offsetX; x <= w + GRID; x += GRID) {
        // Fade lines toward edges
        const distFromCenter = Math.abs(x - w / 2) / (w / 2);
        const alpha = 0.04 * (1 - distFromCenter * 0.6);

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.strokeStyle = `rgba(57, 255, 117, ${Math.max(alpha, 0)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -GRID + offsetY; y <= h + GRID; y += GRID) {
        const distFromCenter = Math.abs(y - h / 2) / (h / 2);
        const alpha = 0.04 * (1 - distFromCenter * 0.5);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = `rgba(57, 255, 117, ${Math.max(alpha, 0)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Spawn new pulse nodes randomly
      if (Math.random() < 0.03) {
        const gx = Math.floor(Math.random() * (w / GRID)) * GRID + offsetX % GRID;
        const gy = Math.floor(Math.random() * (h / GRID)) * GRID + offsetY % GRID;
        pulses.push({
          x: gx,
          y: gy,
          life: 0,
          maxLife: 60 + Math.random() * 80,
          radius: 1.5 + Math.random() * 2,
        });
      }

      // Draw and update pulses
      pulses = pulses.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.3
          ? progress / 0.3
          : 1 - (progress - 0.3) / 0.7;

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 117, ${alpha * 0.03})`;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 117, ${alpha * 0.08})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 117, ${alpha * 0.25})`;
        ctx.fill();

        return true;
      });

      // Occasional horizontal "data stream" lines
      if (Math.random() < 0.008) {
        const y = Math.random() * h;
        const startX = Math.random() * w * 0.3;
        const len = 60 + Math.random() * 200;
        const gradient = ctx.createLinearGradient(startX, y, startX + len, y);
        gradient.addColorStop(0, 'rgba(57, 255, 117, 0)');
        gradient.addColorStop(0.3, 'rgba(57, 255, 117, 0.12)');
        gradient.addColorStop(1, 'rgba(57, 255, 117, 0)');
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + len, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="grid-bg-canvas" />;
}
