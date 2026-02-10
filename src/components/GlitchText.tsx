import { useState, useCallback } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);

    let iterations = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (i < iterations) return text[i];
            if (char === ' ') return ' ';
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      iterations += 1;

      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, 30);
  }, [text, isGlitching]);

  return (
    <span
      className={className}
      onMouseEnter={triggerGlitch}
      style={{ cursor: 'default' }}
    >
      {displayText}
    </span>
  );
}
