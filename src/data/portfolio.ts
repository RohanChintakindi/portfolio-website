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
    role: 'SWE Intern',
    company: 'Kyber',
    date: 'Apr 2026 – Present',
    location: 'Remote',
    path: '~/work/kyber',
    bullets: [
      'Hardened Kyber\'s LangGraph SEE → THINK → ACT agent runtime with typed tool contracts, scoped tool access, PII redaction, prompt bundles, route signals, and state validators.',
      'Built durable approval flows with RepairPlan / DecisionRecord artifacts, drift checks, graph checkpoints, graph-resume execution, capability grants, and safe mutation dispatch.',
      'Built an automatic eval and prompt-improvement system that turns PII-safe S3 traces and synthetic conflict injection runs into datasets, replays prompt variants, scores agent failures, clusters failures, and applies DSPy prompt optimization.',
    ],
  },
  {
    role: 'Technical Lead',
    company: 'Mitsubishi Electric US, Inc.',
    date: 'Feb 2026 – Present',
    location: 'College Park, MD',
    path: '~/work/mitsubishi',
    bullets: [
      'Built a Next.js + FastAPI NDA management platform with document editing, e-signatures, multi-step approval workflows, role-based access control, and SharePoint integration via Microsoft Graph with EntraID.',
      'Integrated AI document Q&A using AWS Bedrock, LangChain, and LangGraph with permission-filtered RAG to enforce per-user document scope across the agent\'s retrieval surface.',
    ],
  },
  {
    role: 'AI Agentic Research Assistant',
    company: 'University of Maryland — CS',
    date: 'Jan 2026 – Present',
    location: 'College Park, MD',
    path: '~/research/llm-diplomacy',
    bullets: [
      'Analyzing persuasive and deceptive alignment in LLM agents for Diplomacy, evaluating gaps in systems like Meta\'s Cicero where strategic communication breaks down.',
      'Applying DSPy-based prompt optimization with custom reward design and structured board encodings, followed by RL fine-tuning of LLaMA to improve communication quality and win rates.',
    ],
  },
  {
    role: 'LLM Research Assistant',
    company: 'University of Maryland — CS',
    date: 'Jan 2026 – Present',
    location: 'College Park, MD',
    path: '~/research/perovskite-mcts',
    bullets: [
      'Building an LLM-guided MCTS agent for symbolic descriptor discovery on 576 ABX₃ perovskites, evaluating whether LLM physical-intuition priors can match brute-force SISSO (Bartel τ, 92%).',
      'Combining multi-modal proposers (code + histogram feedback), UCB1 tree search, and decision-tree / SVM scoring benchmarked against DSR; reached 84.4% and identified Goldschmidt-prior collapse, motivating diversity-aware rewards and reasoning-model proposers.',
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
      'Applied volatility- and liquidity-based entry/exit logic to Iron Butterfly strategies; proposed VVIX-driven filters and wing-width optimization to improve returns and increase trade frequency by 30–40%.',
      'Built a settlement arbitrage engine for Kalshi BTC/ETH binary options, pricing 60-second TWAP payoffs under an Asian-option framework with EWMA volatility estimates.',
    ],
  },
  {
    role: 'Full Stack Engineer / Technical Lead',
    company: 'Children\'s National Hospital',
    date: 'Sep 2025 – Jan 2026',
    location: 'College Park, MD',
    path: '~/work/childrens-national',
    bullets: [
      'Built a Flask-based DICOM / NIfTI backend pipeline with automated format conversion and HIPAA-compliant ephemeral session storage, reducing manual preprocessing by ~80%.',
      'Integrated a deep learning brain tumor segmentation model into the backend and built a React + OHIF frontend to generate 3D NIfTI and DICOM-SEG outputs for clinical visualization.',
      'Implemented GPU-accelerated inference using Dockerized BraTS 2025 models, securing the full upload → inference → visualization path on a hospital VM.',
    ],
  },
  {
    role: 'Junior Cloud Applications Associate',
    company: 'Cloudforce',
    date: 'Sep 2025 – Jan 2026',
    location: 'National Harbor, MD',
    path: '~/work/cloudforce',
    bullets: [
      'Extended NebulaONE\'s Semantic Kernel orchestration layer to support multi-tenant MCP servers with per-connector OAuth2 flows, token routing, and session isolation.',
      'Led Google Drive and Canvas integrations (React, TypeScript, C#, .NET) and built internal OKR / analytics dashboards aggregating data from 10+ SaaS platforms.',
      'Resolved production issues across Azure Cosmos DB and Azure AI Search while shipping connector features for university and enterprise partners.',
    ],
  },
  {
    role: 'Cloud Applications Intern',
    company: 'Cloudforce',
    date: 'Jun 2025 – Sep 2025',
    location: 'National Harbor, MD',
    path: '~/work/cloudforce/intern',
    bullets: [
      'Built the Canvas MCP server in Python from scratch — OAuth2 authorization code + PKCE flows, opaque tokens, refresh token rotation, revocation, and introspection for secure delegated access.',
      'Designed a Graph-RAG system across 95+ Canvas tools, reducing LLM token usage by ~90% via tool-level retrieval and routing.',
      'Led Docker + GitHub Actions CI/CD to Azure Container Apps (private VNet) for Dartmouth\'s TuckBOT v2, shipping 10+ production features.',
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
    desc: 'Blockchain ticketing & loyalty platform on Sui using Move smart contracts with policy-enforced resale, anti-scalping controls, and on-chain dynamic pricing via a Next.js + Sui dApp Kit frontend.',
    tech: ['Sui', 'Move', 'Next.js', 'TypeScript', 'React', 'Tailwind'],
    cmd: './run suitix --demo',
    accent: '#38bdf8',
  },
  {
    name: 'IronVision',
    award: 'UMD × Ironsite Startup Shell',
    desc: '9-stage CV pipeline turning construction body-cam footage into a 3D site intelligence layer — chaining Grounding DINO + SAM2 for open-vocab detection / tracking and reverse-engineered VGGT-X for metric depth + 6-DOF camera poses, with FAISS-indexed spatial memory powering PPE and productivity analytics.',
    tech: ['Python', 'React', 'Grounding DINO', 'SAM2', 'VGGT-X', 'FAISS', 'Three.js'],
    cmd: './run ironvision --site',
    accent: '#34d399',
  },
  {
    name: 'MediCall',
    award: 'Winner @ Texas A&M AI Competition ($2500)',
    desc: 'Scaled ClinicFlow into a production-ready healthcare platform with multi-tenant deployments and secure integrations, driving 60–70% cost reduction, winning a VC competition, and generating investor leads.',
    tech: ['OpenAI', 'ElevenLabs', 'Twilio', 'n8n', 'Next.js', 'Flask', 'Auth0'],
    cmd: './run medicall --voice',
    accent: '#f472b6',
  },
  {
    name: 'Roameo',
    award: 'Winner @ Bitcamp 2025',
    desc: 'Browser-automated travel agent using GPT-4 to autonomously book flights and hotels on a user\'s device via secure cookie-based sessions, integrating Google APIs within a React + Flask architecture.',
    tech: ['Browser Use', 'OpenAI', 'ElevenLabs', 'Twilio', 'n8n', 'React', 'Flask'],
    cmd: './run roameo --plan',
    accent: '#a78bfa',
  },
  {
    name: 'ClinicFlow AI',
    award: 'Winner @ BisonBytes 2025',
    desc: 'Voice-first AI helpdesk using OpenAI + ElevenLabs with multi-agent orchestration in n8n, automating clinical triage and scheduling with real-time monitoring via a Next.js + Flask dashboard.',
    tech: ['OpenAI', 'ElevenLabs', 'Twilio', 'n8n', 'MongoDB', 'Flask', 'Next.js'],
    cmd: './run clinicflow --start',
    accent: '#f59e0b',
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
    value: 'Java, Python, TypeScript, C, C#, Rust, OCaml, SQL',
    usage: 94,
    color: '#a78bfa',
  },
  {
    label: 'Frameworks',
    value: 'React, Next.js, Flask, FastAPI, .NET, Node.js, REST APIs, OAuth2, CQRS',
    usage: 90,
    color: '#38bdf8',
  },
  {
    label: 'AI / Agents',
    value: 'LangChain, LangGraph, DSPy, MCP, RAG, AWS Bedrock, OpenAI',
    usage: 86,
    color: '#c084fc',
  },
  {
    label: 'Systems',
    value: 'UNIX / Linux, Bash, Git',
    usage: 72,
    color: '#f59e0b',
  },
  {
    label: 'Cloud / DevOps',
    value: 'Azure, AWS, Docker, GitHub Actions, CI/CD, Azure Container Apps',
    usage: 83,
    color: '#f472b6',
  },
  {
    label: 'ML / Inference',
    value: 'PyTorch, GPU Inference, Model Fine-Tuning, MCTS, RL',
    usage: 78,
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
  '┌──────────────────────────────────────────────────────────┐',
  '│              R O H A N   C H I N T A K I N D I           │',
  '│        CS + Math @ University of Maryland                │',
  '│   rchintak@umd.edu │ 240-438-1333 │ github/Rohan...      │',
  '├──────────────────────────────────────────────────────────┤',
  '│  EXPERIENCE                                              │',
  '│  ─────────                                               │',
  '│  SWE Intern              │ Kyber           │ 2026–now    │',
  '│  Technical Lead          │ Mitsubishi Elec │ 2026–now    │',
  '│  AI Agentic Researcher   │ UMD CS          │ 2026–now    │',
  '│  LLM Researcher          │ UMD CS          │ 2026–now    │',
  '│  Jr. Quant Analyst       │ Apex Fund       │ 2025–now    │',
  '│  Full Stack / Tech Lead  │ Children\'s Nat. │ 2025–2026   │',
  '│  Jr. Cloud Associate     │ Cloudforce      │ 2025–2026   │',
  '│  Cloud Intern            │ Cloudforce      │ 2025        │',
  '│  AI Council Member       │ BoodleBox       │ 2025–now    │',
  '│  Researcher              │ FIRE @ UMD      │ 2024–now    │',
  '├──────────────────────────────────────────────────────────┤',
  '│  PROJECTS                                                │',
  '│  ────────                                                │',
  '│  SuiTix        │ Winner: Best Use of Sui @ Cal Hacks 12  │',
  '│  IronVision    │ UMD x Ironsite Startup Shell            │',
  '│  MediCall      │ Winner @ Texas A&M AI Comp ($2500)      │',
  '│  Roameo        │ Winner @ Bitcamp 2025                   │',
  '│  ClinicFlow AI │ Winner @ BisonBytes 2025                │',
  '├──────────────────────────────────────────────────────────┤',
  '│  SKILLS                                                  │',
  '│  ──────                                                  │',
  '│  Lang:  Java Python TypeScript C C# Rust OCaml SQL       │',
  '│  Frame: React Next.js Flask FastAPI .NET Node.js OAuth2  │',
  '│  AI:    LangChain LangGraph DSPy MCP RAG Bedrock         │',
  '│  Cloud: Azure AWS Docker GitHub Actions CI/CD            │',
  '│  ML:    PyTorch GPU Inference Fine-Tuning MCTS RL        │',
  '└──────────────────────────────────────────────────────────┘',
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
  { label: 'Building', value: 'LangGraph agents @ Kyber', icon: '>' },
  { label: 'Researching', value: 'LLM-guided MCTS for perovskites', icon: '#' },
  { label: 'Trading', value: 'SPY Iron Butterflies around FOMC', icon: '~' },
] as const;

export const STATS = [
  { label: 'Roles', value: 10, suffix: '+' },
  { label: 'Hackathon Wins', value: 4, suffix: '' },
  { label: 'Trade Freq Boost', value: 40, suffix: '%' },
  { label: 'Tech Stacks', value: 12, suffix: '+' },
] as const;
