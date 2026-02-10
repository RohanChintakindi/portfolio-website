export const ASCII_NAME = `
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

export const SKILLS_ASCII = `    ____  ______
   / __ \\/ ____/
  / /_/ / /
 / _, _/ /___
/_/ |_|\\____/

  ____  ____
 / ___||  _ \\
| |    | |_) |
| |___ |  __/
 \\____||_|      `;

export const SECTIONS = ['about', 'experience', 'projects', 'skills', 'contact'] as const;

export interface Experience {
  role: string;
  company: string;
  date: string;
  location: string;
  path: string;
  bullets: string[];
}

export const experiences: Experience[] = [
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

export interface Project {
  name: string;
  award: string;
  desc: string;
  tech: string[];
  cmd: string;
  accent: string;
}

export const projects: Project[] = [
  {
    name: 'SuiTix',
    award: 'Winner: Best Use of Sui — Cal Hacks 12.0',
    desc: 'Blockchain-based ticketing & loyalty platform on Sui with transparent resale, policy-enforced transfers, on-chain loyalty tiers, and dynamic pricing via a Next.js + Sui dApp Kit frontend.',
    tech: ['Sui', 'Move', 'Next.js', 'TypeScript', 'React', 'Tailwind'],
    cmd: './run suitix --demo',
    accent: '#38bdf8',
  },
  {
    name: 'MediCall',
    award: '6th Place @ Texas A&M AI Competition ($2500)',
    desc: 'Multilingual voice-first healthcare assistant for triage, scheduling, and insurance verification with real-time speech synthesis. Designed shared deployments enabling instant hospital onboarding with ~30% cost reduction.',
    tech: ['OpenAI', 'ElevenLabs', 'Twilio', 'n8n', 'Next.js', 'Flask'],
    cmd: './run medicall --voice',
    accent: '#f472b6',
  },
  {
    name: 'ClinicFlow AI',
    award: 'Winner @ BisonBytes 2025',
    desc: 'Voice-first AI helpdesk automating clinical triage, appointment booking, and follow-ups. Multi-agent workflows for scheduling, reminders, and analytics with a real-time monitoring dashboard.',
    tech: ['OpenAI', 'Twilio', 'n8n', 'MongoDB', 'Flask', 'Next.js'],
    cmd: './run clinicflow --start',
    accent: '#f59e0b',
  },
  {
    name: 'Roameo',
    award: '@ Bitcamp 2025',
    desc: 'Conversational AI travel planner automating trip booking through chat and voice. GPT-4 + Google APIs for real-time itineraries with ElevenLabs speech and n8n-powered automation workflows.',
    tech: ['OpenAI', 'Gemini', 'ElevenLabs', 'Twilio', 'React', 'Flask'],
    cmd: './run roameo --plan',
    accent: '#a78bfa',
  },
];

export interface SkillCategory {
  label: string;
  value: string;
  usage: number;
  color: string;
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Languages',
    value: 'Java, Python, TypeScript, JavaScript, C, C#, Rust, OCaml, SQL, HTML/CSS, Assembly',
    usage: 94,
    color: '#a78bfa',
  },
  {
    label: 'Frameworks',
    value: 'React, Flask, .NET, Node.js, REST APIs, OAuth2, CQRS, Clean Architecture',
    usage: 88,
    color: '#38bdf8',
  },
  {
    label: 'Systems',
    value: 'UNIX/Linux, Bash',
    usage: 72,
    color: '#f59e0b',
  },
  {
    label: 'Cloud/DevOps',
    value: 'Azure, AWS, Docker, GitHub Actions, CI/CD',
    usage: 81,
    color: '#f472b6',
  },
  {
    label: 'ML/AI',
    value: 'PyTorch, Model Fine-Tuning, GPU Inference Pipelines',
    usage: 76,
    color: '#ef4444',
  },
];

export const MOBILE_ASCII = `
 ██████╗   ██████╗
 ██╔══██╗ ██╔════╝
 ██████╔╝ ██║
 ██╔══██╗ ██║
 ██║  ██║ ╚██████╗
 ╚═╝  ╚═╝  ╚═════╝`.trim();

export const interests = 'Poker, Guitar, Music Production, Football, Competitive Programming, Hackathons, Chicago Bears';

export const TYPING_SNIPPETS = [
  'const data = await fetch(url);',
  'export default function App() {',
  'git commit -m "ship it"',
  'docker compose up -d --build',
  'SELECT * FROM users WHERE id = 1;',
  'npm run build && npm run deploy',
  'for (let i = 0; i < n; i++) {',
  'const [state, setState] = useState();',
];

export const RESUME_LINES = [
  '┌────────────────────────────────────────────────────────┐',
  '│              R O H A N   C H I N T A K I N D I         │',
  '│         CS + Math @ University of Maryland              │',
  '│   rchintak@umd.edu │ 240-438-1333 │ github/Rohan...    │',
  '├────────────────────────────────────────────────────────┤',
  '│  EXPERIENCE                                             │',
  '│  ─────────                                              │',
  '│  Research Assistant     │ UMD CS           │ 2026–now   │',
  '│  Full Stack Engineer    │ Children\'s Nat.  │ 2025–now   │',
  '│  Jr. Quant Analyst      │ Apex Fund        │ 2025–now   │',
  '│  Jr. Cloud Associate    │ Cloudforce       │ 2025–now   │',
  '│  Cloud Intern           │ Cloudforce       │ 2025       │',
  '│  AI Council Member      │ BoodleBox        │ 2025–now   │',
  '│  Researcher             │ FIRE @ UMD       │ 2024–now   │',
  '├────────────────────────────────────────────────────────┤',
  '│  PROJECTS                                               │',
  '│  ────────                                               │',
  '│  SuiTix       │ Winner: Best Use of Sui @ Cal Hacks     │',
  '│  MediCall      │ 6th @ Texas A&M AI Competition ($2500) │',
  '│  ClinicFlow AI │ Winner @ BisonBytes 2025               │',
  '│  Roameo        │ @ Bitcamp 2025                         │',
  '├────────────────────────────────────────────────────────┤',
  '│  SKILLS                                                 │',
  '│  ──────                                                 │',
  '│  Lang:  Java Python TypeScript C C# Rust OCaml SQL      │',
  '│  Frame: React Flask .NET Node.js REST OAuth2            │',
  '│  Cloud: Azure AWS Docker GitHub Actions CI/CD           │',
  '│  ML/AI: PyTorch Fine-Tuning GPU Inference               │',
  '└────────────────────────────────────────────────────────┘',
];

export const SECRET_ROOM = [
  '┌─────────────────────────────────────────┐',
  '│    /dev/null — THE SECRET ROOM          │',
  '├─────────────────────────────────────────┤',
  '│                                         │',
  '│  You found it. Here\'s the real me:      │',
  '│                                         │',
  '│  > Biggest flex: 85%+ win rate on       │',
  '│    options with zero drawdown            │',
  '│                                         │',
  '│  > Favorite language: Rust (but I ship  │',
  '│    in TypeScript because deadlines)      │',
  '│                                         │',
  '│  > Hot take: Vim > VS Code > Emacs      │',
  '│    (yes I use Cursor, fight me)          │',
  '│                                         │',
  '│  > Currently learning: how LLMs lie     │',
  '│    in diplomatic negotiations            │',
  '│                                         │',
  '│  > Music: producing beats at 2am        │',
  '│    when I should be debugging            │',
  '│                                         │',
  '│  > Chicago Bears fan since birth.       │',
  '│    Yes, it hurts. No, I won\'t switch.   │',
  '│                                         │',
  '│  > Fueled by: iced coffee + spite       │',
  '│                                         │',
  '│  Thanks for exploring. You\'re the type  │',
  '│  of person I\'d want to work with.       │',
  '│                                         │',
  '└─────────────────────────────────────────┘',
];

export const FORTUNES = [
  '"The best way to predict the future is to implement it." — David Heinemeier Hansson',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Deleted code is debugged code." — Jeff Sickel',
  '"It works on my machine." — Every developer, ever',
  '"There are only two hard things in CS: cache invalidation and naming things." — Phil Karlton',
];

export const THEMES = ['green', 'amber', 'cyan', 'purple', 'red'] as const;
export type ThemeName = typeof THEMES[number];

export const CURRENTLY = [
  { label: 'Building', value: 'LLM diplomacy agents', icon: '>' },
  { label: 'Learning', value: 'Rust + systems programming', icon: '#' },
  { label: 'Reading', value: 'Designing Data-Intensive Applications', icon: '~' },
] as const;

export const STATS = [
  { label: 'Roles', value: 7, suffix: '+' },
  { label: 'Hackathon Wins', value: 4, suffix: '' },
  { label: 'Options Win Rate', value: 85, suffix: '%' },
  { label: 'Tech Stacks', value: 10, suffix: '+' },
] as const;
