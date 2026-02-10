import { useState, useEffect, useRef } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function useKonamiCode(): boolean {
  const [activated, setActivated] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[indexRef.current]) {
        indexRef.current++;
        if (indexRef.current === KONAMI_CODE.length) {
          setActivated(true);
          indexRef.current = 0;
          // Auto-deactivate after 5s
          setTimeout(() => setActivated(false), 5000);
        }
      } else {
        indexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return activated;
}
