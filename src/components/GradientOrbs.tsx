import { useEffect, useRef } from 'react';

export default function GradientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.002;
      const orbs = el.children;
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i] as HTMLElement;
        const speed = 0.3 + i * 0.15;
        const radius = 80 + i * 40;
        const x = Math.sin(t * speed + i * 1.8) * radius;
        const y = Math.cos(t * speed * 0.7 + i * 2.4) * radius * 0.6;
        orb.style.transform = `translate(${x}px, ${y}px)`;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="gradient-orbs" ref={containerRef}>
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />
      <div className="gradient-orb orb-3" />
    </div>
  );
}
