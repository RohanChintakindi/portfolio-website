import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface Stat {
  number: string;
  label: string;
}

const stats: Stat[] = [
  { number: '7+', label: 'Roles' },
  { number: '4', label: 'Hackathon Wins' },
  { number: '11+', label: 'Languages' },
  { number: '85%', label: 'Win Rate (Quant)' },
];

function AnimatedNumber({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericPart = parseInt(target.replace(/[^0-9]/g, ''));
          const hasSuffix = target.replace(/[0-9]/g, '');
          const duration = 1200;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericPart);
            setDisplay(`${current}${hasSuffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function StatsBar() {
  return (
    <motion.div
      className="stats-grid"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="stat-box"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <span className="stat-number">
            <AnimatedNumber target={stat.number} />
          </span>
          <span className="stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
