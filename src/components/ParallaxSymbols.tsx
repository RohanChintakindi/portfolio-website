import { useEffect, useRef, useState } from 'react';

interface Symbol {
  char: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const CODE_SYMBOLS = [
  '{', '}', '(', ')', '[', ']', '<', '>', '/', '*',
  '=>', '&&', '||', '::',  '++', '--', '!=', '==',
  'fn', 'let', 'if', 'for', '#', '@', '~', '$',
  '0x', '01', 'nil', ';;',
];

function generateSymbols(count: number): Symbol[] {
  return Array.from({ length: count }, () => ({
    char: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 16,
    speed: 0.2 + Math.random() * 0.6,
    opacity: 0.04 + Math.random() * 0.08,
  }));
}

export default function ParallaxSymbols() {
  const [symbols] = useState(() => generateSymbols(30));
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      const container = containerRef.current;
      if (container) {
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as HTMLElement;
          const speed = symbols[i].speed;
          const offset = scrollRef.current * speed * -0.15;
          el.style.transform = `translateY(${offset}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [symbols]);

  return (
    <div className="parallax-container" ref={containerRef}>
      {symbols.map((sym, i) => (
        <span
          key={i}
          className="parallax-symbol"
          style={{
            left: `${sym.x}%`,
            top: `${sym.y}%`,
            fontSize: `${sym.size}px`,
            opacity: sym.opacity,
          }}
        >
          {sym.char}
        </span>
      ))}
    </div>
  );
}
