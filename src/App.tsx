import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import './App.css';
import BootSequence from './components/BootSequence';
import MatrixRain from './components/MatrixRain';
import GlitchText from './components/GlitchText';
import { AsciiTypeWriter } from './components/TypeWriter';
import TypeWriter from './components/TypeWriter';
import CommandLine from './components/CommandLine';
import StatusBar from './components/StatusBar';
import CursorTrail from './components/CursorTrail';
import SkillBars from './components/SkillBars';
import SectionLoader from './components/SectionLoader';
import useKonamiCode from './hooks/useKonamiCode';
import {
  ASCII_NAME,
  SECTIONS,
  experiences,
  projects,
} from './data/portfolio';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [commandLineOpen, setCommandLineOpen] = useState(false);
  const [matrixIntense, setMatrixIntense] = useState(false);
  const [currentSection, setCurrentSection] = useState('about');
  const [asciiDone, setAsciiDone] = useState(false);
  const [heroPhase, setHeroPhase] = useState(0); // 0=ascii, 1=subtitle, 2=tagline, 3=links
  const konamiActivated = useKonamiCode();
  const appRef = useRef<HTMLDivElement>(null);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  // Keyboard shortcut for terminal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setCommandLineOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Track current section based on scroll
  useEffect(() => {
    if (!booted) return;

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
  }, [booted]);

  // Konami code effect
  useEffect(() => {
    if (konamiActivated) {
      setMatrixIntense(true);
      document.body.classList.add('konami-active');
      const timer = setTimeout(() => {
        setMatrixIntense(false);
        document.body.classList.remove('konami-active');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [konamiActivated]);

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleMatrixToggle = useCallback(() => {
    setMatrixIntense((prev) => !prev);
  }, []);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <MatrixRain intense={matrixIntense} />
      <div className="scanlines" />
      <div className="noise-overlay" />
      <div className="vignette" />
      <CursorTrail />

      {/* Konami Easter Egg Overlay */}
      {konamiActivated && (
        <div className="konami-overlay">
          <div className="konami-text">ACCESS GRANTED</div>
        </div>
      )}

      {booted && (
        <div className="app" ref={appRef}>
          {/* ---- NAV ---- */}
          <motion.nav
            className="nav"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="nav-prompt">
              <span className="user">rohan</span>
              <span className="at">@</span>
              <span className="host">portfolio</span>
              <span className="path">:~$</span>
            </div>
            <div className="nav-links">
              {SECTIONS.map((s, i) => (
                <span key={s} style={{ display: 'contents' }}>
                  {i > 0 && <span className="nav-separator">|</span>}
                  <a
                    href={`#${s}`}
                    className={currentSection === s ? 'nav-active' : ''}
                  >
                    {s}
                  </a>
                </span>
              ))}
            </div>
          </motion.nav>

          <div className="app-content">
            {/* ---- HERO ---- */}
            <section className="hero" id="about">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <AsciiTypeWriter
                  text={ASCII_NAME}
                  lineDelay={45}
                  className="hero-ascii"
                  onComplete={() => {
                    setAsciiDone(true);
                    setHeroPhase(1);
                  }}
                />
              </motion.div>

              {heroPhase >= 1 && (
                <motion.div
                  className="hero-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TypeWriter
                    text="$ whoami — CS + Math @ University of Maryland"
                    speed={20}
                    onComplete={() => setHeroPhase(2)}
                  />
                </motion.div>
              )}

              {heroPhase >= 2 && (
                <motion.p
                  className="hero-tagline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="highlight">Full-stack engineer</span>,{' '}
                  <span className="highlight">AI/ML researcher</span>, and{' '}
                  <span className="highlight">quant analyst</span> building at the intersection
                  of systems, intelligence, and markets. US Citizen.
                </motion.p>
              )}

              {heroPhase >= 2 && (
                <motion.div
                  className="hero-links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <a href="mailto:rchintak@umd.edu" className="hero-link">
                    <span className="link-icon">&gt;</span> rchintak@umd.edu
                  </a>
                  <a
                    href="https://linkedin.com/in/rohan-chintakindi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-link"
                  >
                    <span className="link-icon">&gt;</span> LinkedIn
                  </a>
                  <a
                    href="https://github.com/RohanChintakindi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-link"
                  >
                    <span className="link-icon">&gt;</span> GitHub
                  </a>
                  <a
                    href="https://devpost.com/rchintak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-link"
                  >
                    <span className="link-icon">&gt;</span> Devpost
                  </a>
                </motion.div>
              )}

              <motion.div
                className="hero-scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: asciiDone ? 1 : 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                [ scroll down or navigate above · Ctrl+` for terminal ]
              </motion.div>
            </section>

            {/* ---- EDUCATION ---- */}
            <SectionLoader command="cat /etc/education">
              <div className="section-inner">
                <div className="section-header">
                  <h2 className="section-title">Education</h2>
                  <div className="section-divider" />
                </div>

                <motion.div
                  className="edu-card"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <div className="edu-school">University of Maryland, College Park</div>
                    <div className="edu-degree">
                      Bachelor of Science in Computer Science and Mathematics
                    </div>
                  </div>
                  <div className="edu-date">Aug 2024 — Dec 2027</div>
                </motion.div>
              </div>
            </SectionLoader>

            {/* ---- EXPERIENCE ---- */}
            <SectionLoader command="ls -la ~/experience/" id="experience">
              <div className="section-inner">
                <div className="section-header">
                  <h2 className="section-title">Experience</h2>
                  <div className="section-divider" />
                </div>

                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    className="exp-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <div className="exp-card-bar">
                      <span className="exp-card-dot red" />
                      <span className="exp-card-dot amber" />
                      <span className="exp-card-dot green" />
                      <span className="exp-card-path">{exp.path}</span>
                      <span className="exp-card-date">{exp.date}</span>
                    </div>
                    <div className="exp-card-body">
                      <div className="exp-card-role">{exp.role}</div>
                      <div className="exp-card-company">{exp.company}</div>
                      <div className="exp-card-location">{exp.location}</div>
                      <ul className="exp-card-bullets">
                        {exp.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionLoader>

            {/* ---- PROJECTS ---- */}
            <SectionLoader command="find ~/projects --type hackathon" id="projects">
              <div className="section-inner">
                <div className="section-header">
                  <h2 className="section-title">Projects</h2>
                  <div className="section-divider" />
                </div>

                <div className="projects-grid">
                  {projects.map((proj, i) => (
                    <motion.div
                      key={i}
                      className="project-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <div className="project-card-bar">
                        <span className="project-card-dot red" />
                        <span className="project-card-dot amber" />
                        <span className="project-card-dot green" />
                        <span className="project-card-title">{proj.name}.exe</span>
                      </div>
                      <div className="project-card-body">
                        <div className="project-name">
                          <GlitchText text={proj.name} />
                        </div>
                        <div className="project-award">{proj.award}</div>
                        <div className="project-desc">{proj.desc}</div>
                        <div className="project-tech">
                          {proj.tech.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                        <div className="project-cmd">
                          <span className="project-cmd-prompt">$</span> {proj.cmd}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionLoader>

            {/* ---- SKILLS (htop style) ---- */}
            <SectionLoader command="neofetch --skills" id="skills">
              <div className="section-inner">
                <div className="section-header">
                  <h2 className="section-title">Skills</h2>
                  <div className="section-divider" />
                </div>

                <SkillBars />
              </div>
            </SectionLoader>

            {/* ---- CONTACT ---- */}
            <SectionLoader command="cat ~/.contact" id="contact">
              <div className="section-inner">
                <div className="section-header">
                  <h2 className="section-title">Contact</h2>
                  <div className="section-divider" />
                </div>

                <div className="contact-grid">
                  <a href="mailto:rchintak@umd.edu" className="contact-item">
                    <div className="contact-icon">{'>'}</div>
                    <div>
                      <div className="contact-label">Email</div>
                      <div className="contact-value">rchintak@umd.edu</div>
                    </div>
                  </a>
                  <a href="tel:240-438-1333" className="contact-item">
                    <div className="contact-icon">{'>'}</div>
                    <div>
                      <div className="contact-label">Phone</div>
                      <div className="contact-value">240-438-1333</div>
                    </div>
                  </a>
                  <a
                    href="https://linkedin.com/in/rohan-chintakindi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <div className="contact-icon">{'>'}</div>
                    <div>
                      <div className="contact-label">LinkedIn</div>
                      <div className="contact-value">rohan-chintakindi</div>
                    </div>
                  </a>
                  <a
                    href="https://github.com/RohanChintakindi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <div className="contact-icon">{'>'}</div>
                    <div>
                      <div className="contact-label">GitHub</div>
                      <div className="contact-value">RohanChintakindi</div>
                    </div>
                  </a>
                  <a
                    href="https://devpost.com/rchintak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <div className="contact-icon">{'>'}</div>
                    <div>
                      <div className="contact-label">Devpost</div>
                      <div className="contact-value">rchintak</div>
                    </div>
                  </a>
                </div>
              </div>
            </SectionLoader>

            {/* ---- FOOTER ---- */}
            <footer className="footer">
              <span className="footer-prompt">rohan@portfolio:~$</span>{' '}
              echo "Thanks for visiting."
              <span className="footer-cursor" />
              <br />
              <br />
              <span className="footer-meta">
                Built with React + TypeScript + Motion · Ctrl+` to open terminal
              </span>
            </footer>
          </div>

          {/* ---- STATUS BAR ---- */}
          <StatusBar
            currentSection={currentSection}
            onCommandLineToggle={() => setCommandLineOpen((prev) => !prev)}
            commandLineOpen={commandLineOpen}
          />

          {/* ---- COMMAND LINE ---- */}
          <CommandLine
            isOpen={commandLineOpen}
            onClose={() => setCommandLineOpen(false)}
            onNavigate={handleNavigate}
            onMatrixIntensify={handleMatrixToggle}
          />
        </div>
      )}
    </>
  );
}
