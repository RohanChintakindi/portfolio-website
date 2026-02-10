import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
import TiltCard from './components/TiltCard';
import ParallaxSymbols from './components/ParallaxSymbols';
import useKonamiCode from './hooks/useKonamiCode';
import {
  ASCII_NAME,
  SECTIONS,
  experiences,
  projects,
  type ThemeName,
} from './data/portfolio';

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Burning the midnight oil?';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Late night browsing?';
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [commandLineOpen, setCommandLineOpen] = useState(false);
  const [matrixIntense, setMatrixIntense] = useState(false);
  const [currentSection, setCurrentSection] = useState('about');
  const [asciiDone, setAsciiDone] = useState(false);
  const [heroPhase, setHeroPhase] = useState(0);
  const [theme, setTheme] = useState<ThemeName>('green');
  const konamiActivated = useKonamiCode();
  const appRef = useRef<HTMLDivElement>(null);
  const greeting = useMemo(() => getTimeGreeting(), []);

  const handleBootComplete = useCallback(() => setBooted(true), []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'green') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Dynamic page title
  useEffect(() => {
    if (!booted) return;
    const updateTitle = () => {
      const scrollPct = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      document.title = `rohan@portfolio:~/${currentSection} [${scrollPct}%]`;
    };
    window.addEventListener('scroll', updateTitle, { passive: true });
    updateTitle();
    return () => window.removeEventListener('scroll', updateTitle);
  }, [booted, currentSection]);

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

  // Track current section on scroll
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

  // Konami code
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
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleMatrixToggle = useCallback(() => setMatrixIntense((prev) => !prev), []);
  const handleThemeChange = useCallback((t: ThemeName) => setTheme(t), []);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <MatrixRain intense={matrixIntense} />
      <ParallaxSymbols />
      <div className="scanlines" />
      <div className="noise-overlay" />
      <div className="vignette" />
      <CursorTrail />

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
                  <a href={`#${s}`} className={currentSection === s ? 'nav-active' : ''}>
                    {s}
                  </a>
                </span>
              ))}
            </div>
          </motion.nav>

          <div className="app-content">
            {/* ---- HERO ---- */}
            <section className="hero" id="about">
              {/* Time-based greeting */}
              <motion.div
                className="hero-greeting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                {greeting}
              </motion.div>

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
                  {[
                    { href: 'mailto:rchintak@umd.edu', label: 'rchintak@umd.edu' },
                    { href: 'https://linkedin.com/in/rohan-chintakindi', label: 'LinkedIn', ext: true },
                    { href: 'https://github.com/RohanChintakindi', label: 'GitHub', ext: true },
                    { href: 'https://devpost.com/rchintak', label: 'Devpost', ext: true },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="hero-link"
                      {...(link.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className="link-icon">&gt;</span> {link.label}
                    </a>
                  ))}
                </motion.div>
              )}

              <motion.div
                className="hero-scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: asciiDone ? 1 : 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                [ scroll down · Ctrl+` for terminal ]
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
                    <div className="edu-degree">Bachelor of Science in Computer Science and Mathematics</div>
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
                    transition={{ delay: i * 0.06, duration: 0.4 }}
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
                        {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionLoader>

            {/* ---- PROJECTS (3D tilt cards) ---- */}
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
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <TiltCard className="project-card">
                        <div className="project-card-bar">
                          <span className="project-card-dot red" />
                          <span className="project-card-dot amber" />
                          <span className="project-card-dot green" />
                          <span className="project-card-title">{proj.name}.exe</span>
                        </div>
                        <div className="project-card-body">
                          <div className="project-name"><GlitchText text={proj.name} /></div>
                          <div className="project-award">{proj.award}</div>
                          <div className="project-desc">{proj.desc}</div>
                          <div className="project-tech">
                            {proj.tech.map((t) => <span key={t}>{t}</span>)}
                          </div>
                          <div className="project-cmd">
                            <span className="project-cmd-prompt">$</span> {proj.cmd}
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionLoader>

            {/* ---- SKILLS ---- */}
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
                  {[
                    { href: 'mailto:rchintak@umd.edu', label: 'Email', value: 'rchintak@umd.edu' },
                    { href: 'tel:240-438-1333', label: 'Phone', value: '240-438-1333' },
                    { href: 'https://linkedin.com/in/rohan-chintakindi', label: 'LinkedIn', value: 'rohan-chintakindi', ext: true },
                    { href: 'https://github.com/RohanChintakindi', label: 'GitHub', value: 'RohanChintakindi', ext: true },
                    { href: 'https://devpost.com/rchintak', label: 'Devpost', value: 'rchintak', ext: true },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="contact-item"
                      {...(item.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <div className="contact-icon">{'>'}</div>
                      <div>
                        <div className="contact-label">{item.label}</div>
                        <div className="contact-value">{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </SectionLoader>

            {/* ---- FOOTER ---- */}
            <footer className="footer">
              <span className="footer-prompt">rohan@portfolio:~$</span>{' '}
              echo "Thanks for visiting."
              <span className="footer-cursor" />
              <br /><br />
              <span className="footer-meta">
                Built with React + TypeScript + Motion · Ctrl+` to open terminal · Type "theme" to customize
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
            onThemeChange={handleThemeChange}
            currentTheme={theme}
          />
        </div>
      )}
    </>
  );
}
