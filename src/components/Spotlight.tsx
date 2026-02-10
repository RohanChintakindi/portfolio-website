import { useEffect, useRef } from 'react';

export default function Spotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;

    const handleMouse = (e: MouseEvent) => {
      el.style.setProperty('--spot-x', `${e.clientX}px`);
      el.style.setProperty('--spot-y', `${e.clientY}px`);
      el.style.opacity = '1';
    };

    const handleLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <div ref={spotRef} className="spotlight" />;
}
