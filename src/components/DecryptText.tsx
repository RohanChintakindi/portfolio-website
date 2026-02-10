import { useState, useCallback, useRef } from 'react';

interface DecryptTextProps {
  text: string;
  className?: string;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?/\\|<>{}[]~^';

export default function DecryptText({ text, className = '' }: DecryptTextProps) {
  const [display, setDisplay] = useState(text);
  const isAnimating = useRef(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scramble = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Clear any existing timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const original = text;
    const len = original.length;

    // Phase 1: scramble all characters
    let iterations = 0;
    const maxScramble = 6;

    const scrambleLoop = () => {
      if (iterations >= maxScramble) {
        // Phase 2: resolve characters one by one left-to-right
        let resolved = 0;
        const resolveLoop = () => {
          if (resolved >= len) {
            setDisplay(original);
            isAnimating.current = false;
            return;
          }
          // Resolve next character, keep rest scrambled
          resolved++;
          const resolvedPart = original.slice(0, resolved);
          const scrambledPart = original.slice(resolved).split('').map((c) =>
            c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
          ).join('');
          setDisplay(resolvedPart + scrambledPart);

          const id = setTimeout(resolveLoop, 25);
          timeoutRefs.current.push(id);
        };
        resolveLoop();
        return;
      }
      iterations++;
      const scrambled = original.split('').map((c) =>
        c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('');
      setDisplay(scrambled);
      const id = setTimeout(scrambleLoop, 40);
      timeoutRefs.current.push(id);
    };

    scrambleLoop();
  }, [text]);

  const reset = useCallback(() => {
    // Let the animation finish naturally if it's running
    if (!isAnimating.current) {
      setDisplay(text);
    }
  }, [text]);

  return (
    <span
      className={`decrypt-text ${className}`}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {display}
    </span>
  );
}
