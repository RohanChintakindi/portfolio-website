import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';

interface SectionLoaderProps {
  children: ReactNode;
  command: string;
  id?: string;
}

export default function SectionLoader({ children, command, id }: SectionLoaderProps) {
  const [phase, setPhase] = useState<'hidden' | 'loading' | 'typing' | 'revealed'>('hidden');
  const [typedCmd, setTypedCmd] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 'hidden') {
          setPhase('loading');
        }
      },
      { threshold: 0, rootMargin: '2400px 0px 2400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  // Loading -> Typing
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => setPhase('typing'), 180);
    return () => clearTimeout(timer);
  }, [phase]);

  // Typing effect
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedCmd.length >= command.length) {
      const timer = setTimeout(() => setPhase('revealed'), 80);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTypedCmd(command.slice(0, typedCmd.length + 1));
    }, 12);
    return () => clearTimeout(timer);
  }, [phase, typedCmd, command]);

  return (
    <div ref={sectionRef} id={id} className="section-loader">
      {phase === 'hidden' && (
        <div className="section-loader-placeholder" />
      )}

      {phase === 'loading' && (
        <motion.div
          className="section-loader-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <span className="loader-bracket">[</span>
          <span className="loader-text">LOADING</span>
          <span className="loader-dots">...</span>
          <span className="loader-bracket">]</span>
        </motion.div>
      )}

      {(phase === 'typing' || phase === 'revealed') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="section-loader-cmd">
            <span className="loader-prompt">$</span>{' '}
            <span className="loader-typed">{typedCmd}</span>
            {phase === 'typing' && <span className="loader-cursor">█</span>}
          </div>

          {phase === 'revealed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
