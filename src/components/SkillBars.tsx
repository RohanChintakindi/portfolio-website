import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { skillCategories } from '../data/portfolio';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export default function SkillBars() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0, rootMargin: '800px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="skill-grid" ref={containerRef}>
      {skillCategories.map((skill, i) => {
        const techs = skill.value.split(',').map((t) => t.trim()).filter(Boolean);
        const indexLabel = ROMAN[i + 1] ?? String(i + 1);
        return (
          <motion.div
            key={skill.label}
            className="skill-row"
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="skill-row-head">
              <div className="skill-row-eyebrow">
                <span className="skill-index">{indexLabel}.</span>
                <h3 className="skill-label">{skill.label}</h3>
              </div>
              <span className="skill-pct">
                <span className="skill-pct-num">{visible ? skill.usage : 0}</span>
                <sup>%</sup>
              </span>
            </div>

            <div className="skill-track">
              <motion.div
                className="skill-fill"
                initial={{ width: 0 }}
                animate={visible ? { width: `${skill.usage}%` } : { width: 0 }}
                transition={{ delay: i * 0.08 + 0.2, duration: 1.1, ease: 'easeOut' }}
              />
            </div>

            <div className="skill-techs">
              {techs.map((t) => (
                <span key={t} className="skill-tech">{t}</span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
