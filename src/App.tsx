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
import ToastContainer, { useToasts } from './components/Toast';
import HackerMode from './components/HackerMode';
import DigitalClock from './components/DigitalClock';
import ScrollProgress from './components/ScrollProgress';
import GradientOrbs from './components/GradientOrbs';
import useKonamiCode from './hooks/useKonamiCode';
import useAchievements from './hooks/useAchievements';
import {
  ASCII_NAME,
  MOBILE_ASCII,
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

function buildBreadcrumb(section: string): string {
  const map: Record<string, string> = {
    about: '~',
    experience: '~/experience',
    projects: '~/projects',
    skills: '~/skills',
    contact: '~/contact',
  };
  return map[section] || '~';
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [commandLineOpen, setCommandLineOpen] = useState(false);
  const [matrixIntense, setMatrixIntense] = useState(false);
  const [currentSection, setCurrentSection] = useState('about');
  const [asciiDone, setAsciiDone] = useState(false);
  const [heroPhase, setHeroPhase] = useState(0);
  const [theme, setTheme] = useState<ThemeName>('green');
  const [hackerActive, setHackerActive] = useState(false);
  const [commandCount, setCommandCount] = useState(0);
  const [sessionStart] = useState(() => Date.now());
  const konamiActivated = useKonamiCode();
  const { achievements, unlock, consumeToasts, unlockedCount } = useAchievements();
  const { toasts, addToast, dismissToast } = useToasts();
  const appRef = useRef<HTMLDivElement>(null);
  const greeting = useMemo(() => getTimeGreeting(), []);
  const isMobile = useMemo(() => window.innerWidth < 600, []);

  const handleBootComplete = useCallback(() => setBooted(true), []);

  // Poll for achievement toasts
  useEffect(() => {
    const interval = setInterval(() => {
      const pending = consumeToasts();
      pending.forEach((a) => {
        addToast(`Achievement Unlocked!`, `${a.icon} ${a.name} — ${a.desc}`, 'achievement');
      });
    }, 300);
    return () => clearInterval(interval);
  }, [consumeToasts, addToast]);

  // Apply theme
  useEffect(() => {
    if (theme === 'green') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Dynamic page title
  useEffect(() => {
    if (!booted) return;
    const updateTitle = () => {
      const scrollPct = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      document.title = `rohan@portfolio:${buildBreadcrumb(currentSection)} [${scrollPct}%]`;
    };
    window.addEventListener('scroll', updateTitle, { passive: true });
    updateTitle();
    return () => window.removeEventListener('scroll', updateTitle);
  }, [booted, currentSection]);

  // Terminal shortcut
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

  // Track current section
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

  // Konami
  useEffect(() => {
    if (konamiActivated) {
      setMatrixIntense(true);
      unlock('konamiMaster');
      document.body.classList.add('konami-active');
      const timer = setTimeout(() => {
        setMatrixIntense(false);
        document.body.classList.remove('konami-active');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [konamiActivated, unlock]);

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleMatrixToggle = useCallback(() => setMatrixIntense((prev) => !prev), []);
  const handleThemeChange = useCallback((t: ThemeName) => {
    setTheme(t);
    addToast('Theme Changed', `Switched to ${t} mode`, 'info');
  }, [addToast]);
  const handleHack = useCallback(() => setHackerActive(true), []);
  const handleHackComplete = useCallback(() => {
    setHackerActive(false);
    addToast('Hacking Complete', 'ACCESS GRANTED. Welcome back, root.', 'success');
  }, [addToast]);
  const handleCommandRun = useCallback(() => setCommandCount((c) => c + 1), []);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <MatrixRain intense={matrixIntense} />
      <GradientOrbs />
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

      <HackerMode active={hackerActive} onComplete={handleHackComplete} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {booted && (
        <div className="app" ref={appRef}>
          <ScrollProgress />

          {/* ---- NAV ---- */}
          <motion.nav
            className="nav"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="nav-left">
              <div className="nav-prompt">
                <span className="user">rohan</span>
                <span className="at">@</span>
                <span className="host">portfolio</span>
                <span className="path">:{buildBreadcrumb(currentSection)}$</span>
              </div>
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
            <div className="nav-clock">
              <DigitalClock />
            </div>
          </motion.nav>

          <div className="app-content">
            {/* ---- HERO ---- */}
            <section className="hero" id="about">
              <motion.div
                className="hero-greeting"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                {greeting}
              </motion.div>

              <motion.div
                className="hero-ascii-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="hero-glow" />
                <AsciiTypeWriter
                  text={isMobile ? MOBILE_ASCII : ASCII_NAME}
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
                    { href: 'mailto:rchintak@umd.edu', label: 'rchintak@umd.edu', icon: '@' },
                    { href: 'https://linkedin.com/in/rohan-chintakindi', label: 'LinkedIn', ext: true, icon: 'in' },
                    { href: 'https://github.com/RohanChintakindi', label: 'GitHub', ext: true, icon: '~/' },
                    { href: 'https://devpost.com/rchintak', label: 'Devpost', ext: true, icon: '<>' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="hero-link"
                      {...(link.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className="link-icon">{link.icon}</span>
                      <span>{link.label}</span>
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
                <span className="scroll-arrow">v</span>
                <span>scroll down · Ctrl+` for terminal</span>
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
                  <div className="edu-card-content">
                    <div className="edu-school">University of Maryland, College Park</div>
                    <div className="edu-degree">Bachelor of Science in Computer Science and Mathematics</div>
                  </div>
                  <div className="edu-date">Aug 2024 — Dec 2027</div>
                </motion.div>
              </div>
            </SectionLoader>

            {/* ---- EXPERIENCE (TIMELINE) ---- */}
            <SectionLoader command="ls -la ~/experience/" id="experience">
              <div className="section-inner">
                <div className="section-header">
                  <h2 className="section-title">Experience</h2>
                  <div className="section-divider" />
                </div>
                <div className="timeline">
                  <div className="timeline-line" />
                  {experiences.map((exp, i) => (
                    <motion.div
                      key={i}
                      className="timeline-item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="timeline-marker">
                        <div className="timeline-dot" />
                      </div>
                      <div className="exp-card">
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
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <TiltCard className="project-card" style={{ '--project-accent': proj.accent } as React.CSSProperties}>
                        <div className="project-accent-line" style={{ background: `linear-gradient(90deg, ${proj.accent}, transparent)` }} />
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

                <motion.div
                  className="contact-cta"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="contact-cta-text">
                    Interested in working together? Let's connect.
                  </p>
                  <a href="mailto:rchintak@umd.edu" className="contact-cta-btn">
                    <span className="contact-cta-icon">$</span>
                    <span>sudo hire rohan</span>
                  </a>
                </motion.div>

                <div className="contact-grid">
                  {[
                    { href: 'mailto:rchintak@umd.edu', label: 'Email', value: 'rchintak@umd.edu', icon: '@' },
                    { href: 'tel:240-438-1333', label: 'Phone', value: '240-438-1333', icon: '#' },
                    { href: 'https://linkedin.com/in/rohan-chintakindi', label: 'LinkedIn', value: 'rohan-chintakindi', ext: true, icon: 'in' },
                    { href: 'https://github.com/RohanChintakindi', label: 'GitHub', value: 'RohanChintakindi', ext: true, icon: '~/' },
                    { href: 'https://devpost.com/rchintak', label: 'Devpost', value: 'rchintak', ext: true, icon: '<>' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="contact-item"
                      {...(item.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <div className="contact-icon">{item.icon}</div>
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
              <div className="footer-divider">
                {'─'.repeat(40)}
              </div>
              <div className="footer-main">
                <span className="footer-prompt">rohan@portfolio:~$</span>{' '}
                echo "Thanks for visiting."
                <span className="footer-cursor" />
              </div>
              <div className="footer-meta">
                Built with React + TypeScript + Motion
              </div>
              <div className="footer-meta">
                Ctrl+` to open terminal · {unlockedCount} achievements unlocked
              </div>
              <div className="footer-copyright">
                <span className="footer-year">{new Date().getFullYear()}</span> · Rohan Chintakindi
              </div>
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
            onHack={handleHack}
            achievements={achievements}
            onAchievement={unlock}
            commandCount={commandCount}
            onCommandRun={handleCommandRun}
            sessionStart={sessionStart}
          />
        </div>
      )}
    </>
  );
}
