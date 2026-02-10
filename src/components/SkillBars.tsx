import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { skillCategories, interests } from '../data/portfolio';

export default function SkillBars() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="htop-container" ref={containerRef}>
      {/* Header */}
      <div className="htop-header">
        <div className="htop-header-left">
          <span className="htop-title">htop</span>
          <span className="htop-version">— skill monitor v1.0</span>
        </div>
        <div className="htop-header-right">
          <span className="htop-meta">Tasks: <span className="htop-num">{skillCategories.length}</span></span>
          <span className="htop-meta">Load: <span className="htop-num">0.42</span></span>
          <span className="htop-meta">Mem: <span className="htop-num">31.2G</span>/32G</span>
        </div>
      </div>

      {/* CPU-style bars */}
      <div className="htop-bars">
        {skillCategories.map((skill, i) => (
          <div key={skill.label} className="htop-bar-row">
            <span className="htop-bar-index" style={{ color: skill.color }}>
              {i + 1}
            </span>
            <span className="htop-bar-label">{skill.label}</span>
            <div className="htop-bar-track">
              <motion.div
                className="htop-bar-fill"
                initial={{ width: 0 }}
                animate={visible ? { width: `${skill.usage}%` } : { width: 0 }}
                transition={{ delay: i * 0.15, duration: 1.2, ease: 'easeOut' }}
                style={{
                  background: `linear-gradient(90deg, ${skill.color}66, ${skill.color})`,
                  boxShadow: `0 0 10px ${skill.color}40`,
                }}
              />
              <span className="htop-bar-segments" />
            </div>
            <span className="htop-bar-pct" style={{ color: skill.color }}>
              {visible ? `${skill.usage}%` : '0%'}
            </span>
          </div>
        ))}
      </div>

      {/* Process list */}
      <div className="htop-process-header">
        <span className="htop-col-pid">PID</span>
        <span className="htop-col-user">USER</span>
        <span className="htop-col-name">CATEGORY</span>
        <span className="htop-col-cmd">TECHNOLOGIES</span>
        <span className="htop-col-cpu">CPU%</span>
      </div>

      <div className="htop-processes">
        {skillCategories.map((skill, i) => (
          <motion.div
            key={skill.label}
            className="htop-process-row"
            initial={{ opacity: 0, x: -10 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
          >
            <span className="htop-col-pid">{1000 + i}</span>
            <span className="htop-col-user">rohan</span>
            <span className="htop-col-name" style={{ color: skill.color }}>{skill.label}</span>
            <span className="htop-col-cmd">{skill.value}</span>
            <span className="htop-col-cpu" style={{ color: skill.color }}>{skill.usage}</span>
          </motion.div>
        ))}
      </div>

      {/* Interests footer */}
      <div className="htop-footer">
        <span className="htop-footer-label">Interests:</span>
        <span className="htop-footer-value">{interests}</span>
      </div>

      {/* Color blocks */}
      <div className="htop-color-row">
        {['#ef4444', '#f59e0b', '#a78bfa', '#38bdf8', '#f472b6', '#c084fc', '#34d399', '#e2e0dc'].map(
          (c) => (
            <div
              key={c}
              className="htop-color-block"
              style={{ background: c }}
            />
          )
        )}
      </div>
    </div>
  );
}
