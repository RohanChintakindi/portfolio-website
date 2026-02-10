import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  intense?: boolean;
}

interface Drop {
  y: number;
  speed: number;
  brightness: number;
  chars: string[];
}

// Softer green matching --green-bright: #63d68d → rgb(99, 214, 141)
const R = 99, G = 214, B = 141;

export default function MatrixRain({ intense = false }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intense);

  useEffect(() => {
    intensityRef.current = intense;
  }, [intense]);

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

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]();:=+-*&|~^%$#@!'.split('');
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    const drops: Drop[] = [];
    const initDrops = () => {
      drops.length = 0;
      columns = Math.floor(canvas.width / fontSize);
      for (let i = 0; i < columns; i++) {
        drops.push({
          y: Math.random() * -100,
          speed: 0.3 + Math.random() * 0.7,
          brightness: 0.15 + Math.random() * 0.85,
          chars: Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]),
        });
      }
    };
    initDrops();

    let lastTime = 0;
    const targetFPS = 20;
    const frameInterval = 1000 / targetFPS;

    const draw = (timestamp: number) => {
      const delta = timestamp - lastTime;
      if (delta < frameInterval) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp - (delta % frameInterval);

      const isIntense = intensityRef.current;
      const fadeAlpha = isIntense ? 0.06 : 0.08;
      const baseAlpha = isIntense ? 0.4 : 0.22;

      ctx.fillStyle = `rgba(12, 14, 20, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        if (drop.y < 0) { drop.y += drop.speed; continue; }

        const charIndex = Math.floor(drop.y) % drop.chars.length;
        const char = drop.chars[charIndex];
        const x = i * fontSize;
        const y = drop.y * fontSize;

        const headAlpha = baseAlpha * drop.brightness * (isIntense ? 1.6 : 1);
        ctx.fillStyle = `rgba(${R}, ${G}, ${B}, ${Math.min(headAlpha, 0.8)})`;
        ctx.fillText(char, x, y);

        if (drop.y > 1) {
          const trailChar = drop.chars[(charIndex - 1 + drop.chars.length) % drop.chars.length];
          ctx.fillStyle = `rgba(${R}, ${G}, ${B}, ${headAlpha * 0.3})`;
          ctx.fillText(trailChar, x, y - fontSize);
        }

        if (y > canvas.height && Math.random() > (isIntense ? 0.95 : 0.975)) {
          drop.y = Math.random() * -20;
          drop.speed = 0.3 + Math.random() * (isIntense ? 1.2 : 0.7);
          drop.chars = Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]);
        }
        drop.y += drop.speed;
      }

      rafId = requestAnimationFrame(draw);
    };

    let rafId = requestAnimationFrame(draw);

    const handleResize = () => { resize(); initDrops(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
}
