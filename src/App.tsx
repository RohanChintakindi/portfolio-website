import { useState, useEffect, useMemo } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import './App.css';
import SkillBars from './components/SkillBars';
import SectionLoader from './components/SectionLoader';
import TiltCard from './components/TiltCard';
import ScrollProgress from './components/ScrollProgress';
import MagneticWrap from './components/MagneticWrap';
import DecryptText from './components/DecryptText';
import AnimatedCounter from './components/AnimatedCounter';
import {
  ASCII_NAME,
  MOBILE_ASCII,
  SECTIONS,
  experiences,
  projects,
  CURRENTLY,
  STATS,
} from './data/portfolio';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const toRoman = (n: number) => ROMAN[n] ?? String(n);

export default function App() {
  const [currentSection, setCurrentSection] = useState('about');
  const isMobile = useMemo(() => window.innerWidth < 600, []);

  useEffect(() => {
    document.title = 'Rohan Chintakindi';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map((s) => {
        const el = document.getElementById(s);
        if (!el) return { id: s, top: Infinity };
        return { id: s, top: el.getBoundingClientRect().top };
      });
      const current = sections.reduce((closest, section) => {
        if (section.top <= 200 && section.top > closest.top) return section;
        if (closest.top > 200 && section.top < closest.top) return section;
        return closest;
      });
      setCurrentSection(current.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="mythology-bg" aria-hidden="true">
        <div className="mythology-bg-engraving" />
      </div>

      <div className="app">
        <ScrollProgress />

        <nav className="cinema-nav liquid-glass animate-fade-rise">
          <a href="#about" className="cinema-nav-logo">
            Rohan<sup>®</sup>
          </a>
          <div className="cinema-nav-links">
            {SECTIONS.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className={currentSection === s ? 'is-active' : ''}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>
          <span className="cinema-nav-spacer" aria-hidden="true" />
        </nav>

        <div className="app-content">
          <section className="hero" id="about">
            <motion.div
              className="hero-currently"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {CURRENTLY.map((item) => (
                <div key={item.label} className="hero-currently-item">
                  <span className="hero-currently-label">{item.label}</span>
                  <span className="hero-currently-value">{item.value}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="hero-ascii-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <pre className="hero-ascii">{isMobile ? MOBILE_ASCII : ASCII_NAME}</pre>
            </motion.div>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className="highlight">Full-stack engineer</span>,{' '}
              <span className="highlight">AI/ML researcher</span>, and{' '}
              <span className="highlight">quant analyst</span> building at the intersection
              of systems, intelligence, and markets. US Citizen.
            </motion.p>

            <motion.div
              className="hero-links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {[
                { href: 'mailto:rchintak@umd.edu', label: 'rchintak@umd.edu', icon: '@' },
                { href: 'https://linkedin.com/in/rohan-chintakindi', label: 'LinkedIn', ext: true, icon: 'in' },
                { href: 'https://github.com/RohanChintakindi', label: 'GitHub', ext: true, icon: '~/' },
                { href: 'https://devpost.com/rchintak', label: 'Devpost', ext: true, icon: '<>' },
              ].map((link) => (
                <MagneticWrap key={link.label} strength={0.3} radius={70}>
                  <a
                    href={link.href}
                    className="hero-link liquid-glass"
                    {...(link.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="link-icon">{link.icon}</span>
                    <span>{link.label}</span>
                  </a>
                </MagneticWrap>
              ))}
            </motion.div>

            <motion.div
              className="hero-scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <span className="scroll-arrow">↓</span>
              <span>scroll</span>
            </motion.div>
          </section>

          <SectionLoader command="">
            <div className="section-inner">
              <div className="section-header">
                <h2 className="section-title"><DecryptText text="Education" /></h2>
                <div className="section-divider" />
              </div>
              <motion.div
                className="edu-card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '800px' }}
                transition={{ duration: 0.4 }}
              >
                <div className="edu-main">
                  <div className="edu-card-content">
                    <div className="edu-school">University of Maryland, College Park</div>
                    <div className="edu-degree">Bachelor of Science in Computer Science and Mathematics</div>
                  </div>
                  <div className="edu-date-badge">Aug 2024 — Dec 2027</div>
                </div>
                <div className="edu-coursework">
                  <div className="edu-coursework-label">Relevant Coursework</div>
                  <div className="edu-coursework-tags">
                    {['Data Structures', 'Algorithms', 'Computer Systems', 'Linear Algebra', 'Discrete Math', 'Probability', 'Object-Oriented Programming', 'Web Development'].map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="stats-grid"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '800px' }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ marginTop: 28 }}
              >
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="stat-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '800px' }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                  >
                    <div className="stat-number">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1800} />
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </SectionLoader>

          <SectionLoader command="" id="experience">
            <div className="section-inner">
              <div className="section-header">
                <h2 className="section-title"><DecryptText text="Experience" /></h2>
                <div className="section-divider" />
              </div>
              <div className="timeline">
                <div className="timeline-line" />
                {experiences.map((exp, i) => {
                  const isActive = /present/i.test(exp.date);
                  const indexLabel = toRoman(i + 1);
                  const totalLabel = toRoman(experiences.length);
                  return (
                    <motion.div
                      key={i}
                      className="timeline-item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '800px' }}
                      transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="timeline-marker">
                        <div className={`timeline-dot ${isActive ? 'is-active' : ''}`} />
                      </div>
                      <article className="exp-card">
                        <header className="exp-card-meta">
                          <span className="exp-card-index">{indexLabel} <span className="exp-card-index-sep">/</span> {totalLabel}</span>
                          <span className="exp-card-date">{exp.date}</span>
                          <span className="exp-card-location">{exp.location}</span>
                          {isActive && <span className="exp-card-now">Now</span>}
                        </header>
                        <div className="exp-card-body">
                          <h3 className="exp-card-role">{exp.role}</h3>
                          <div className="exp-card-company">{exp.company}</div>
                          <ul className="exp-card-bullets">
                            {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                          </ul>
                        </div>
                      </article>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </SectionLoader>

          <SectionLoader command="" id="projects">
            <div className="section-inner">
              <div className="section-header">
                <h2 className="section-title"><DecryptText text="Projects" /></h2>
                <div className="section-divider" />
              </div>
              <div className="projects-grid">
                {projects.map((proj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '800px' }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <TiltCard className="project-card" style={{ '--project-accent': proj.accent } as React.CSSProperties}>
                      <div className="project-rule" />
                      <div className="project-numeral" aria-hidden="true">{toRoman(i + 1)}</div>
                      <div className="project-card-body">
                        <div className="project-award">{proj.award}</div>
                        <div className="project-name">{proj.name}</div>
                        <div className="project-desc">{proj.desc}</div>
                        <div className="project-tech">
                          {proj.tech.map((t) => <span key={t}>{t}</span>)}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionLoader>

          <SectionLoader command="" id="skills">
            <div className="section-inner">
              <div className="section-header">
                <h2 className="section-title"><DecryptText text="Skills" /></h2>
                <div className="section-divider" />
              </div>
              <SkillBars />
            </div>
          </SectionLoader>

          <SectionLoader command="" id="contact">
            <div className="section-inner">
              <div className="section-header">
                <h2 className="section-title"><DecryptText text="Contact" /></h2>
                <div className="section-divider" />
              </div>

              <motion.div
                className="bento-contact"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '800px' }}
                transition={{ duration: 0.5 }}
              >
                <div className="bento-card bento-cta">
                  <div className="bento-cta-headline">Let's build something.</div>
                  <p className="bento-cta-sub">
                    Open to internships, full-time roles, and research collaborations.
                    Reach out — I'm quick to respond.
                  </p>
                  <MagneticWrap strength={0.25} radius={100}>
                    <a href="mailto:rchintak@umd.edu" className="bento-cta-btn liquid-glass">
                      <span>Begin Conversation</span>
                    </a>
                  </MagneticWrap>
                </div>

                <div className="bento-card bento-status">
                  <div className="bento-status-dot" />
                  <div className="bento-status-label">Open to Work</div>
                  <div className="bento-status-sub">Available for internships & full-time</div>
                </div>

                <a href="mailto:rchintak@umd.edu" className="bento-card bento-info">
                  <div className="bento-icon">@</div>
                  <div>
                    <div className="bento-info-label">Email</div>
                    <div className="bento-info-value">rchintak@umd.edu</div>
                  </div>
                </a>

                <a href="https://github.com/RohanChintakindi" target="_blank" rel="noopener noreferrer" className="bento-card bento-info">
                  <div className="bento-icon">~/</div>
                  <div>
                    <div className="bento-info-label">GitHub</div>
                    <div className="bento-info-value">RohanChintakindi</div>
                  </div>
                </a>

                <div className="bento-card bento-location">
                  <div className="bento-coords">38.9897° N, 76.9378° W</div>
                  <div className="bento-location-name">College Park, MD</div>
                  <div className="bento-location-flag">US</div>
                </div>

                <a href="https://linkedin.com/in/rohan-chintakindi" target="_blank" rel="noopener noreferrer" className="bento-card bento-info">
                  <div className="bento-icon">in</div>
                  <div>
                    <div className="bento-info-label">LinkedIn</div>
                    <div className="bento-info-value">rohan-chintakindi</div>
                  </div>
                </a>

                <a href="https://devpost.com/rchintak" target="_blank" rel="noopener noreferrer" className="bento-card bento-info">
                  <div className="bento-icon">&lt;&gt;</div>
                  <div>
                    <div className="bento-info-label">Devpost</div>
                    <div className="bento-info-value">rchintak</div>
                  </div>
                </a>

                <a href="tel:240-438-1333" className="bento-card bento-info">
                  <div className="bento-icon">#</div>
                  <div>
                    <div className="bento-info-label">Phone</div>
                    <div className="bento-info-value">240-438-1333</div>
                  </div>
                </a>
              </motion.div>
            </div>
          </SectionLoader>

          <footer className="footer">
            <div className="footer-main" style={{ fontFamily: "var(--font-display)" }}>
              Thanks for visiting.
            </div>
            <div className="footer-copyright">
              © <span className="footer-year">{new Date().getFullYear()}</span> · Rohan Chintakindi
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
