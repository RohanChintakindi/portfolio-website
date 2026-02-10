import { useRef, type ReactNode } from 'react';

interface MagneticWrapProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

export default function MagneticWrap({ children, strength = 0.35, radius = 80, className = '' }: MagneticWrapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      const pull = (1 - dist / radius) * strength;
      el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
    }
  };

  const handleLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={wrapRef}
      className={`magnetic-wrap ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
