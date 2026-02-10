import { useState, useEffect, useCallback } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  cursor?: boolean;
  tag?: 'span' | 'div' | 'p' | 'h1' | 'h2';
}

export default function TypeWriter({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className = '',
  cursor = true,
  tag: Tag = 'span',
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <Tag className={className}>
      {displayed}
      {cursor && !done && <span className="typewriter-cursor">█</span>}
      {cursor && done && <span className="typewriter-cursor blink">█</span>}
    </Tag>
  );
}

interface AsciiTypeWriterProps {
  text: string;
  lineDelay?: number;
  onComplete?: () => void;
  className?: string;
}

export function AsciiTypeWriter({
  text,
  lineDelay = 60,
  onComplete,
  className = '',
}: AsciiTypeWriterProps) {
  const lines = text.split('\n');
  const [visibleLines, setVisibleLines] = useState(0);

  const handleLineComplete = useCallback(() => {
    // Not used per-line anymore since we reveal by count
  }, []);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, lineDelay);

    return () => clearTimeout(timer);
  }, [visibleLines, lines.length, lineDelay, onComplete]);

  return (
    <pre className={className}>
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="ascii-line-reveal">
          {line}
        </div>
      ))}
    </pre>
  );
}
