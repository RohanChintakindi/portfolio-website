import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      });

      // Keep max 50 points
      if (pointsRef.current.length > 50) {
        pointsRef.current = pointsRef.current.slice(-50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Age all points
      pointsRef.current = pointsRef.current
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < 30);

      // Draw phosphor trail
      for (const point of pointsRef.current) {
        const alpha = Math.max(0, 1 - point.age / 30);
        const size = Math.max(1, 4 * alpha);

        // Outer glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.08})`;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.4})`;
        ctx.fill();
      }

      // Draw cursor crosshair
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cs = 8;

      ctx.strokeStyle = 'rgba(0, 255, 65, 0.6)';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 4;

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(mx - cs, my);
      ctx.lineTo(mx - 3, my);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx + 3, my);
      ctx.lineTo(mx + cs, my);
      ctx.stroke();

      // Vertical
      ctx.beginPath();
      ctx.moveTo(mx, my - cs);
      ctx.lineTo(mx, my - 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx, my + 3);
      ctx.lineTo(mx, my + cs);
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(mx, my, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
      ctx.fill();

      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas"
    />
  );
}
