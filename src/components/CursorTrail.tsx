import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

// Softer green matching --green-bright: #63d68d → rgb(99, 214, 141)
const R = 99, G = 214, B = 141;

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
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (pointsRef.current.length > 40) {
        pointsRef.current = pointsRef.current.slice(-40);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointsRef.current = pointsRef.current
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < 25);

      for (const point of pointsRef.current) {
        const alpha = Math.max(0, 1 - point.age / 25);
        const size = Math.max(1, 3 * alpha);

        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R}, ${G}, ${B}, ${alpha * 0.06})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R}, ${G}, ${B}, ${alpha * 0.12})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R}, ${G}, ${B}, ${alpha * 0.25})`;
        ctx.fill();
      }

      // Crosshair cursor
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cs = 7;

      ctx.strokeStyle = `rgba(${R}, ${G}, ${B}, 0.45)`;
      ctx.lineWidth = 1;
      ctx.shadowColor = `rgba(${R}, ${G}, ${B}, 0.3)`;
      ctx.shadowBlur = 3;

      ctx.beginPath();
      ctx.moveTo(mx - cs, my); ctx.lineTo(mx - 3, my); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx + 3, my); ctx.lineTo(mx + cs, my); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx, my - cs); ctx.lineTo(mx, my - 3); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx, my + 3); ctx.lineTo(mx, my + cs); ctx.stroke();

      ctx.beginPath();
      ctx.arc(mx, my, 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${R}, ${G}, ${B}, 0.6)`;
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

  return <canvas ref={canvasRef} className="cursor-trail-canvas" />;
}
