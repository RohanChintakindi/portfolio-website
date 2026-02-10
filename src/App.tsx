import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import './App.css';
import BootSequence from './components/BootSequence';
import MatrixRain from './components/MatrixRain';
import GlitchText from './components/GlitchText';

const ASCII_NAME = `
██████╗  ██████╗ ██╗  ██╗ █████╗ ███╗   ██╗
██╔══██╗██╔═══██╗██║  ██║██╔══██╗████╗  ██║
██████╔╝██║   ██║███████║███████║██╔██╗ ██║
██╔══██╗██║   ██║██╔══██║██╔══██║██║╚██╗██║
██║  ██║╚██████╔╝██║  ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝

 ██████╗██╗  ██╗██╗███╗   ██╗████████╗ █████╗ ██╗  ██╗██╗███╗   ██╗██████╗ ██╗
██╔════╝██║  ██║██║████╗  ██║╚══██╔══╝██╔══██╗██║ ██╔╝██║████╗  ██║██╔══██╗██║
██║     ███████║██║██╔██╗ ██║   ██║   ███████║█████╔╝ ██║██╔██╗ ██║██║  ██║██║
██║     ██╔══██║██║██║╚██╗██║   ██║   ██╔══██║██╔═██╗ ██║██║╚██╗██║██║  ██║██║
╚██████╗██║  ██║██║██║ ╚████║   ██║   ██║  ██║██║  ██╗██║██║ ╚████║██████╔╝██║
 ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝`.trim();

const SKILLS_ASCII = `    ____  ______
   / __ \\/ ____/
  / /_/ / /
 / _, _/ /___
/_/ |_|\\____/

  ____  ____
 / ___||  _ \\
| |    | |_) |
| |___ |  __/
 \\____||_|      `;

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

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'contact'] as const;

const experiences = [
  {
    role: 'Research Assistant',
    company: 'University of Maryland — CS',
    date: 'Jan 2026 – Present',
    location: 'College Park, MD',
    path: '~/research/llm-diplomacy',
    bullets: [
      'Analyzing deficiencies in persuasive and deceptive communication of LLM-driven agents in the Diplomacy game, building on Meta\'s Cicero to align language with strategic intent.',
      'Implementing prompt optimization pipelines using DSPy with custom reward formulations, experimenting with structured board state encodings to improve negotiation reasoning.',
      'Developing fine-tuning workflows for local LLMs (LLaMA, Qwen), with planned RL-based fine-tuning to optimize communication quality and strategic performance.',
    ],
  },
  {
    role: 'Full Stack Engineer',
    company: 'Children\'s National Hospital',
    date: 'Sep 2025 – Present',
    location: 'College Park, MD',
    path: '~/work/childrens-national',
    bullets: [
      'Built a Flask-based CQS backend for an end-to-end DICOM and NIfTI imaging pipeline with automated format conversion and HIPAA-compliant ephemeral session storage, reducing manual preprocessing by ~80%.',
      'Developed a TypeScript + React web app using the OHIF Viewer to enable secure upload, inference execution, and 3D clinical visualization on a hospital VM.',
      'Implemented GPU-accelerated brain tumor segmentation using Dockerized BraTS 2025 deep learning models, producing 3D NIfTI and DICOM-SEG outputs for clinical workflows.',
    ],
  },
  {
    role: 'Junior Quant Analyst',
    company: 'Apex Fund',
    date: 'Oct 2025 – Present',
    location: 'College Park, MD',
    path: '~/work/apex-fund',
    bullets: [
      'Designed and executed SPY Iron Butterfly and Reverse Iron Butterfly options strategies around FOMC events, targeting short-term implied volatility expansion and contraction.',
      'Applied volatility regime analysis, liquidity filtering, and rule-based entry/exit logic to systematically manage positioning, timing, and exposure.',
      'Achieved positive returns on 85%+ positions with zero drawdown; proposed VVIX-driven uncertainty filters and wing-width optimization to improve risk-adjusted returns ~30-40%.',
    ],
  },
  {
    role: 'Junior Cloud Applications Associate',
    company: 'Cloudforce',
    date: 'Sep 2025 – Present',
    location: 'National Harbor, MD',
    path: '~/work/cloudforce',
    bullets: [
      'Extended NebulaONE\'s orchestration layer (Semantic Kernel) to support multiple authenticated MCP servers with per-connector OAuth2 flows, token routing, and session isolation.',
      'Delivered end-to-end Google Drive and Canvas file integrations for university partners, owning both frontend (TypeScript, React) and backend (C#, .NET) development.',
      'Built internal tooling including an OKR and marketing analytics dashboard aggregating data from 10+ SaaS platforms; resolved production issues across Azure Cosmos DB and Azure AI Search.',
    ],
  },
  {
    role: 'Cloud Applications Intern',
    company: 'Cloudforce',
    date: 'Jun 2025 – Sep 2025',
    location: 'National Harbor, MD',
    path: '~/work/cloudforce/intern',
    bullets: [
      'Built the Canvas MCP server in Python from scratch — OAuth2 authorization code + PKCE flows, opaque tokens, refresh token rotation, revocation, and introspection.',
      'Designed a custom Graph-RAG system as a standalone service, integrating with Canvas MCP for tool discovery across 95+ tools, reducing LLM token usage by ~90%.',
      'Led CI/CD and cloud deployment using Docker, GitHub Actions, and Azure Container Apps, shipping 10+ production features for Dartmouth\'s TuckBOT v2.',
    ],
  },
  {
    role: 'AI Leadership Council Member',
    company: 'BoodleBox',
    date: 'Mar 2025 – Present',
    location: 'Remote',
    path: '~/advisory/boodlebox',
    bullets: [
      'Advised on expanding BoodleBox into research and developer workflows, identifying multimodal LLM integration and automation opportunities.',
      'Led discussions on ethical AI deployment in education, focusing on responsible, scalable, user-centered design.',
      'Explored LLM context management through dynamic windowing, retrieval-augmented collaboration, and constrained-memory orchestration.',
    ],
  },
  {
    role: 'Undergraduate Researcher',
    company: 'FIRE — First Year Innovation & Research Experience',
    date: 'Aug 2024 – Present',
    location: 'College Park, MD',
    path: '~/research/fire-climate',
    bullets: [
      'Analyzed the impact of Arctic cyclone frequency on sea ice loss using CESM2 with CICE6, comparing storm-heavy (1992) vs storm-light (2004) years against climatological control.',
      'Configured CESM with G and GIAF compsets at f19_g17 resolution; processed daily NetCDF output in Python to evaluate sea ice thickness, melt, and melt pond extent.',
      'Previously simulated a polar low over the Labrador Sea using WRF with ERA5 forcing at 4km resolution on the NCAR Derecho supercomputer.',
    ],
  },
];

const projects = [
  {
    name: 'SuiTix',
    award: 'Winner: Best Use of Sui — Cal Hacks 12.0',
    desc: 'Blockchain-based ticketing & loyalty platform on Sui with transparent resale, policy-enforced transfers, on-chain loyalty tiers, and dynamic pricing via a Next.js + Sui dApp Kit frontend.',
    tech: ['Sui', 'Move', 'Next.js', 'TypeScript', 'React', 'Tailwind'],
  },
  {
    name: 'MediCall',
    award: '6th Place @ Texas A&M AI Competition ($2500)',
    desc: 'Multilingual voice-first healthcare assistant for triage, scheduling, and insurance verification with real-time speech synthesis. Designed shared deployments enabling instant hospital onboarding with ~30% cost reduction.',
    tech: ['OpenAI', 'ElevenLabs', 'Twilio', 'n8n', 'Next.js', 'Flask'],
  },
  {
    name: 'ClinicFlow AI',
    award: 'Winner @ BisonBytes 2025',
    desc: 'Voice-first AI helpdesk automating clinical triage, appointment booking, and follow-ups. Multi-agent workflows for scheduling, reminders, and analytics with a real-time monitoring dashboard.',
    tech: ['OpenAI', 'Twilio', 'n8n', 'MongoDB', 'Flask', 'Next.js'],
  },
  {
    name: 'Roameo',
    award: '@ Bitcamp 2025',
    desc: 'Conversational AI travel planner automating trip booking through chat and voice. GPT-4 + Google APIs for real-time itineraries with ElevenLabs speech and n8n-powered automation workflows.',
    tech: ['OpenAI', 'Gemini', 'ElevenLabs', 'Twilio', 'React', 'Flask'],
  },
];

export default function App() {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <MatrixRain />
      <div className="scanlines" />
      <div className="noise-overlay" />
      <div className="vignette" />

      {booted && (
        <div className="app">
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
                  <a href={`#${s}`}>{s}</a>
                </span>
              ))}
            </div>
          </motion.nav>

          <div className="app-content">
            {/* ---- HERO ---- */}
            <motion.section
              className="hero"
              id="about"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div className="hero-ascii" variants={fadeUp} custom={0}>
                {ASCII_NAME}
              </motion.div>

              <motion.div className="hero-subtitle" variants={fadeUp} custom={1}>
                <GlitchText text="$ whoami — CS + Math @ University of Maryland" />
              </motion.div>

              <motion.p className="hero-tagline" variants={fadeUp} custom={2}>
                <span className="highlight">Full-stack engineer</span>,{' '}
                <span className="highlight">AI/ML researcher</span>, and{' '}
                <span className="highlight">quant analyst</span> building at the intersection
                of systems, intelligence, and markets. US Citizen.
              </motion.p>

              <motion.div className="hero-links" variants={fadeUp} custom={3}>
                <a
                  href="mailto:rchintak@umd.edu"
                  className="hero-link"
                >
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

              <motion.div
                className="hero-scroll-hint"
                variants={fadeUp}
                custom={5}
              >
                [ scroll down or navigate above ]
              </motion.div>
            </motion.section>

            {/* ---- EDUCATION ---- */}
            <motion.section
              className="section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
            >
              <motion.div className="section-header" variants={fadeUp} custom={0}>
                <div className="section-prompt">
                  <span className="cmd">cat</span>{' '}
                  <span className="arg">/etc/education</span>
                </div>
                <h2 className="section-title">Education</h2>
                <div className="section-divider" />
              </motion.div>

              <motion.div className="edu-card" variants={fadeUp} custom={1}>
                <div>
                  <div className="edu-school">University of Maryland, College Park</div>
                  <div className="edu-degree">
                    Bachelor of Science in Computer Science and Mathematics
                  </div>
                </div>
                <div className="edu-date">Aug 2024 — Dec 2027</div>
              </motion.div>
            </motion.section>

            {/* ---- EXPERIENCE ---- */}
            <motion.section
              className="section"
              id="experience"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div className="section-header" variants={fadeUp} custom={0}>
                <div className="section-prompt">
                  <span className="cmd">ls</span>{' '}
                  <span className="flag">-la</span>{' '}
                  <span className="arg">~/experience/</span>
                </div>
                <h2 className="section-title">Experience</h2>
                <div className="section-divider" />
              </motion.div>

              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  className="exp-card"
                  variants={fadeUp}
                  custom={i + 1}
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
            </motion.section>

            {/* ---- PROJECTS ---- */}
            <motion.section
              className="section"
              id="projects"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div className="section-header" variants={fadeUp} custom={0}>
                <div className="section-prompt">
                  <span className="cmd">find</span>{' '}
                  <span className="arg">~/projects</span>{' '}
                  <span className="flag">--type hackathon</span>
                </div>
                <h2 className="section-title">Projects</h2>
                <div className="section-divider" />
              </motion.div>

              <div className="projects-grid">
                {projects.map((proj, i) => (
                  <motion.div
                    key={i}
                    className="project-card"
                    variants={fadeUp}
                    custom={i + 1}
                  >
                    <div className="project-name">{proj.name}</div>
                    <div className="project-award">{proj.award}</div>
                    <div className="project-desc">{proj.desc}</div>
                    <div className="project-tech">
                      {proj.tech.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ---- SKILLS (neofetch) ---- */}
            <motion.section
              className="section"
              id="skills"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div className="section-header" variants={fadeUp} custom={0}>
                <div className="section-prompt">
                  <span className="cmd">neofetch</span>{' '}
                  <span className="flag">--skills</span>
                </div>
                <h2 className="section-title">Skills</h2>
                <div className="section-divider" />
              </motion.div>

              <motion.div className="skills-container" variants={fadeUp} custom={1}>
                <div className="skills-ascii-art">{SKILLS_ASCII}</div>
                <div className="skills-info">
                  <div className="skills-info-row">
                    <span className="skills-info-label">OS:</span>
                    <span className="skills-info-value">rohan@umd (CS + Math)</span>
                  </div>
                  <div className="skills-info-row">
                    <span className="skills-info-label">Uptime:</span>
                    <span className="skills-info-value">Aug 2024 — Dec 2027</span>
                  </div>
                  <div className="skills-divider" />
                  <div className="skills-info-row">
                    <span className="skills-info-label">Languages:</span>
                    <span className="skills-info-value">
                      Java, Python, TypeScript, JavaScript, C, C#, Rust, OCaml, SQL, HTML/CSS, Assembly
                    </span>
                  </div>
                  <div className="skills-info-row">
                    <span className="skills-info-label">Frameworks:</span>
                    <span className="skills-info-value">
                      React, Flask, .NET, Node.js, REST APIs, OAuth2, CQRS, Clean Architecture
                    </span>
                  </div>
                  <div className="skills-info-row">
                    <span className="skills-info-label">Systems:</span>
                    <span className="skills-info-value">UNIX/Linux, Bash</span>
                  </div>
                  <div className="skills-info-row">
                    <span className="skills-info-label">Cloud/DevOps:</span>
                    <span className="skills-info-value">
                      Azure, AWS, Docker, GitHub Actions, CI/CD
                    </span>
                  </div>
                  <div className="skills-info-row">
                    <span className="skills-info-label">ML/AI:</span>
                    <span className="skills-info-value">
                      PyTorch, Model Fine-Tuning, GPU Inference Pipelines
                    </span>
                  </div>
                  <div className="skills-divider" />
                  <div className="skills-info-row">
                    <span className="skills-info-label">Interests:</span>
                    <span className="skills-info-value">
                      Poker, Guitar, Music Production, Football, Competitive Programming, Hackathons, Chicago Bears
                    </span>
                  </div>
                  <div className="skills-color-blocks">
                    {['#ff3333', '#ffb000', '#00ff41', '#00d4ff', '#ff00ff', '#8b5cf6', '#f97316', '#ffffff'].map(
                      (c) => (
                        <div
                          key={c}
                          className="skills-color-block"
                          style={{ background: c }}
                        />
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* ---- CONTACT ---- */}
            <motion.section
              className="section"
              id="contact"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div className="section-header" variants={fadeUp} custom={0}>
                <div className="section-prompt">
                  <span className="cmd">cat</span>{' '}
                  <span className="arg">~/.contact</span>
                </div>
                <h2 className="section-title">Contact</h2>
                <div className="section-divider" />
              </motion.div>

              <motion.div className="contact-grid" variants={fadeUp} custom={1}>
                <a href="mailto:rchintak@umd.edu" className="contact-item">
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">rchintak@umd.edu</div>
                  </div>
                </a>
                <a href="tel:240-438-1333" className="contact-item">
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
                  <div>
                    <div className="contact-label">Devpost</div>
                    <div className="contact-value">rchintak</div>
                  </div>
                </a>
              </motion.div>
            </motion.section>

            {/* ---- FOOTER ---- */}
            <footer className="footer">
              <span className="footer-prompt">rohan@portfolio:~$</span>{' '}
              echo "Thanks for visiting."
              <span className="footer-cursor" />
              <br />
              <br />
              <span style={{ color: 'var(--text-dim)' }}>
                Built with React + TypeScript + Motion
              </span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
