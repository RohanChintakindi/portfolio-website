import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FORTUNES, THEMES, type ThemeName } from '../data/portfolio';

interface CommandLineProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onMatrixIntensify: () => void;
  onThemeChange: (theme: ThemeName) => void;
  currentTheme: ThemeName;
}

interface OutputLine {
  text: string;
  className?: string;
}

const AVAILABLE_COMMANDS = [
  'help', 'ls', 'cat', 'cd', 'whoami', 'neofetch', 'clear',
  'history', 'pwd', 'date', 'uptime', 'matrix', 'exit', 'sudo',
  'fortune', 'cowsay', 'ping', 'wget', 'theme', 'man', 'top',
  'echo', 'curl', 'grep', 'tree',
];

const FAKE_HISTORY = [
  'ssh rohan@portfolio.dev',
  'git push origin main --force',
  'docker compose up -d',
  'python train.py --epochs 100 --lr 0.001',
  'cargo build --release',
  'npm run deploy',
  'kubectl get pods -A',
  'vim ~/.config/nvim/init.lua',
];

const HELP_TEXT: OutputLine[] = [
  { text: '┌──────────────────────────────────────────────────────┐', className: 'cmd-border' },
  { text: '│  ROHAN-OS Terminal v4.2.1 — Available Commands       │', className: 'cmd-border' },
  { text: '├──────────────────────────────────────────────────────┤', className: 'cmd-border' },
  { text: '│                                                      │', className: 'cmd-border' },
  { text: '│  Navigation:                                         │', className: 'cmd-border' },
  { text: '│    ls [section]     List sections or contents         │', className: 'cmd-border' },
  { text: '│    cd <section>     Navigate to a section             │', className: 'cmd-border' },
  { text: '│    cat <file>       View section details              │', className: 'cmd-border' },
  { text: '│    tree             Show file structure               │', className: 'cmd-border' },
  { text: '│                                                      │', className: 'cmd-border' },
  { text: '│  Info:                                                │', className: 'cmd-border' },
  { text: '│    whoami           Display bio                       │', className: 'cmd-border' },
  { text: '│    neofetch         System info & skills              │', className: 'cmd-border' },
  { text: '│    man <topic>      Manual pages                      │', className: 'cmd-border' },
  { text: '│    top              Process viewer                    │', className: 'cmd-border' },
  { text: '│                                                      │', className: 'cmd-border' },
  { text: '│  Fun:                                                 │', className: 'cmd-border' },
  { text: '│    matrix           Toggle matrix rain intensity      │', className: 'cmd-border' },
  { text: '│    fortune          Random wisdom                     │', className: 'cmd-border' },
  { text: '│    cowsay <msg>     Cow says things                   │', className: 'cmd-border' },
  { text: '│    theme <name>     Switch theme (green/amber/cyan/   │', className: 'cmd-border' },
  { text: '│                     purple/red)                       │', className: 'cmd-border' },
  { text: '│    sudo hire rohan  You know what to do               │', className: 'cmd-border' },
  { text: '│                                                      │', className: 'cmd-border' },
  { text: '│  Network:                                             │', className: 'cmd-border' },
  { text: '│    ping <host>      Ping a host                       │', className: 'cmd-border' },
  { text: '│    wget <file>      Download files                    │', className: 'cmd-border' },
  { text: '│    curl <url>       Fetch a URL                       │', className: 'cmd-border' },
  { text: '│                                                      │', className: 'cmd-border' },
  { text: '│  System:                                              │', className: 'cmd-border' },
  { text: '│    clear            Clear terminal                    │', className: 'cmd-border' },
  { text: '│    exit             Close terminal                    │', className: 'cmd-border' },
  { text: '│    history          Command history                   │', className: 'cmd-border' },
  { text: '│                                                      │', className: 'cmd-border' },
  { text: '│  Tip: Tab to autocomplete · ↑/↓ for history          │', className: 'cmd-border' },
  { text: '└──────────────────────────────────────────────────────┘', className: 'cmd-border' },
];

const SECTIONS_MAP: Record<string, string> = {
  about: 'about', experience: 'experience', projects: 'projects',
  skills: 'skills', contact: 'contact',
};

const FILE_MAP: Record<string, OutputLine[]> = {
  'about.txt': [
    { text: '  Rohan Chintakindi', className: 'cmd-highlight' },
    { text: '  CS + Math @ University of Maryland', className: 'cmd-dim' },
    { text: '' },
    { text: '  Full-stack engineer, AI/ML researcher, and quant analyst', className: 'cmd-info' },
    { text: '  building at the intersection of systems, intelligence,', className: 'cmd-info' },
    { text: '  and markets. US Citizen.', className: 'cmd-info' },
  ],
  'contact.txt': [
    { text: '  Email:    rchintak@umd.edu', className: 'cmd-info' },
    { text: '  Phone:    240-438-1333', className: 'cmd-info' },
    { text: '  LinkedIn: linkedin.com/in/rohan-chintakindi', className: 'cmd-cyan' },
    { text: '  GitHub:   github.com/RohanChintakindi', className: 'cmd-cyan' },
    { text: '  Devpost:  devpost.com/rchintak', className: 'cmd-cyan' },
  ],
  'skills.txt': [
    { text: '  Languages:  Java, Python, TypeScript, JavaScript, C, C#, Rust, OCaml, SQL', className: 'cmd-info' },
    { text: '  Frameworks: React, Flask, .NET, Node.js, REST APIs, OAuth2', className: 'cmd-info' },
    { text: '  Systems:    UNIX/Linux, Bash', className: 'cmd-info' },
    { text: '  Cloud:      Azure, AWS, Docker, GitHub Actions, CI/CD', className: 'cmd-info' },
    { text: '  ML/AI:      PyTorch, Model Fine-Tuning, GPU Inference', className: 'cmd-info' },
  ],
};

function cowsay(msg: string): OutputLine[] {
  const len = Math.min(msg.length, 40);
  const top = '  ' + '_'.repeat(len + 2);
  const bot = '  ' + '-'.repeat(len + 2);
  const wrapped = msg.length <= 40 ? [msg] : [msg.slice(0, 40), msg.slice(40, 80)];
  const lines = wrapped.map(l => `  | ${l.padEnd(len)} |`);
  return [
    { text: top, className: 'cmd-info' },
    ...lines.map(t => ({ text: t, className: 'cmd-info' })),
    { text: bot, className: 'cmd-info' },
    { text: '        \\   ^__^', className: 'cmd-info' },
    { text: '         \\  (oo)\\_______', className: 'cmd-info' },
    { text: '            (__)\\       )\\/\\', className: 'cmd-info' },
    { text: '                ||----w |', className: 'cmd-info' },
    { text: '                ||     ||', className: 'cmd-info' },
  ];
}

export default function CommandLine({ isOpen, onClose, onNavigate, onMatrixIntensify, onThemeChange, currentTheme }: CommandLineProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([
    { text: 'ROHAN-OS Terminal v4.2.1 — Type "help" for available commands.', className: 'cmd-dim' },
    { text: '' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  // Ghost autocomplete suggestion
  const ghostSuggestion = useMemo(() => {
    if (!input || input.length < 1) return '';
    const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
    return match ? match.slice(input.length) : '';
  }, [input]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const addOutput = useCallback((lines: OutputLine[]) => {
    setOutput((prev) => [...prev, { text: '' }, ...lines]);
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setOutput((prev) => [...prev, { text: `rohan@portfolio:~$ ${trimmed}`, className: 'cmd-echo' }]);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    switch (command) {
      case 'help':
        addOutput(HELP_TEXT);
        break;

      case 'ls': {
        if (args.length === 0 || args[0] === '~/' || args[0] === '.' || args[0] === '~') {
          addOutput([
            { text: 'drwxr-xr-x  2.1K  Feb 10 03:14  about/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  4.2K  Feb 10 03:14  experience/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  3.8K  Feb 10 03:14  projects/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  1.5K  Feb 10 03:14  skills/', className: 'cmd-dir' },
            { text: '-rw-r--r--   842  Feb 10 03:14  contact.txt', className: 'cmd-file' },
            { text: '-rw-r--r--   512  Feb 10 03:14  about.txt', className: 'cmd-file' },
            { text: '-rw-r--r--   256  Feb 10 03:14  README.md', className: 'cmd-file' },
            { text: '-rw-r--r--   128  Feb 10 03:14  resume.pdf', className: 'cmd-file' },
          ]);
        } else {
          const section = args[0].replace(/[~/]/g, '').toLowerCase();
          if (SECTIONS_MAP[section]) {
            onNavigate(section);
            addOutput([{ text: `  Navigating to ${section}...`, className: 'cmd-success' }]);
          } else {
            addOutput([{ text: `ls: cannot access '${args[0]}': No such file or directory`, className: 'cmd-error' }]);
          }
        }
        break;
      }

      case 'cd': {
        if (args.length === 0) {
          addOutput([{ text: '  ~', className: 'cmd-info' }]);
        } else {
          const section = args[0].replace(/[~/]/g, '').toLowerCase();
          if (SECTIONS_MAP[section]) {
            onNavigate(section);
            addOutput([{ text: `  Navigating to ${section}...`, className: 'cmd-success' }]);
          } else {
            addOutput([{ text: `bash: cd: ${args[0]}: No such file or directory`, className: 'cmd-error' }]);
          }
        }
        break;
      }

      case 'cat': {
        if (args.length === 0) {
          addOutput([{ text: 'cat: missing operand', className: 'cmd-error' }]);
        } else {
          const file = args[0].replace('~/', '').toLowerCase();
          if (FILE_MAP[file]) {
            addOutput(FILE_MAP[file]);
          } else if (file === 'readme.md') {
            addOutput([
              { text: '  # Rohan Chintakindi — Portfolio', className: 'cmd-highlight' },
              { text: '' },
              { text: '  Built with React + TypeScript + Motion', className: 'cmd-info' },
              { text: '  Terminal aesthetic. Zero bloat.', className: 'cmd-dim' },
            ]);
          } else {
            const section = file.replace('.txt', '').replace('/', '');
            if (SECTIONS_MAP[section]) {
              onNavigate(section);
              addOutput([{ text: `  Opening ${section}...`, className: 'cmd-success' }]);
            } else {
              addOutput([{ text: `cat: ${args[0]}: No such file or directory`, className: 'cmd-error' }]);
            }
          }
        }
        break;
      }

      case 'tree':
        addOutput([
          { text: '  .', className: 'cmd-info' },
          { text: '  ├── about/', className: 'cmd-dir' },
          { text: '  │   └── about.txt', className: 'cmd-file' },
          { text: '  ├── experience/', className: 'cmd-dir' },
          { text: '  │   ├── umd-research/', className: 'cmd-dir' },
          { text: '  │   ├── childrens-national/', className: 'cmd-dir' },
          { text: '  │   ├── apex-fund/', className: 'cmd-dir' },
          { text: '  │   ├── cloudforce/', className: 'cmd-dir' },
          { text: '  │   ├── boodlebox/', className: 'cmd-dir' },
          { text: '  │   └── fire/', className: 'cmd-dir' },
          { text: '  ├── projects/', className: 'cmd-dir' },
          { text: '  │   ├── suitix/', className: 'cmd-dir' },
          { text: '  │   ├── medicall/', className: 'cmd-dir' },
          { text: '  │   ├── clinicflow-ai/', className: 'cmd-dir' },
          { text: '  │   └── roameo/', className: 'cmd-dir' },
          { text: '  ├── skills/', className: 'cmd-dir' },
          { text: '  ├── contact.txt', className: 'cmd-file' },
          { text: '  ├── resume.pdf', className: 'cmd-file' },
          { text: '  └── README.md', className: 'cmd-file' },
          { text: '' },
          { text: '  6 directories, 4 files', className: 'cmd-dim' },
        ]);
        break;

      case 'whoami':
        addOutput([
          { text: '  Rohan Chintakindi', className: 'cmd-highlight' },
          { text: '  CS + Math @ University of Maryland', className: 'cmd-info' },
          { text: '  Full-stack engineer | AI/ML researcher | Quant analyst', className: 'cmd-dim' },
          { text: '  Building at the intersection of systems, intelligence, and markets.', className: 'cmd-dim' },
        ]);
        break;

      case 'neofetch':
        onNavigate('skills');
        addOutput([
          { text: '  ____  ______', className: 'cmd-highlight' },
          { text: ' / __ \\/ ____/', className: 'cmd-highlight' },
          { text: '/ /_/ / /     rohan@umd', className: 'cmd-highlight' },
          { text: '/ _, _/ /___   OS: CS + Math', className: 'cmd-highlight' },
          { text: '/_/ |_|\\____/  Uptime: Aug 2024 — Dec 2027', className: 'cmd-highlight' },
          { text: '' },
          { text: '  Navigating to skills...', className: 'cmd-success' },
        ]);
        break;

      case 'pwd':
        addOutput([{ text: '  /home/rohan/portfolio', className: 'cmd-info' }]);
        break;

      case 'date':
        addOutput([{ text: `  ${new Date().toString()}`, className: 'cmd-info' }]);
        break;

      case 'uptime': {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        addOutput([{ text: `  up ${m} min ${s} sec, 1 user, load average: 0.42, 0.38, 0.35`, className: 'cmd-info' }]);
        break;
      }

      case 'history': {
        const allHistory = [...FAKE_HISTORY, ...commandHistory];
        addOutput(allHistory.map((h, i) => ({ text: `  ${String(i + 1).padStart(4)}  ${h}`, className: 'cmd-dim' })));
        break;
      }

      case 'fortune':
        addOutput([{ text: `  ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}`, className: 'cmd-info' }]);
        break;

      case 'cowsay':
        if (args.length === 0) {
          addOutput(cowsay('moo'));
        } else {
          addOutput(cowsay(args.join(' ')));
        }
        break;

      case 'theme': {
        if (args.length === 0) {
          addOutput([
            { text: `  Current theme: ${currentTheme}`, className: 'cmd-info' },
            { text: `  Available: ${THEMES.join(', ')}`, className: 'cmd-dim' },
          ]);
        } else {
          const t = args[0].toLowerCase() as ThemeName;
          if (THEMES.includes(t)) {
            onThemeChange(t);
            addOutput([{ text: `  Theme switched to ${t}.`, className: 'cmd-success' }]);
          } else {
            addOutput([
              { text: `  Unknown theme: ${args[0]}`, className: 'cmd-error' },
              { text: `  Available: ${THEMES.join(', ')}`, className: 'cmd-dim' },
            ]);
          }
        }
        break;
      }

      case 'ping': {
        const host = args[0] || 'portfolio.dev';
        addOutput([
          { text: `  PING ${host} (143.198.72.41): 56 data bytes`, className: 'cmd-info' },
          { text: `  64 bytes from ${host}: icmp_seq=0 ttl=55 time=12.4 ms`, className: 'cmd-info' },
          { text: `  64 bytes from ${host}: icmp_seq=1 ttl=55 time=11.8 ms`, className: 'cmd-info' },
          { text: `  64 bytes from ${host}: icmp_seq=2 ttl=55 time=13.1 ms`, className: 'cmd-info' },
          { text: '' },
          { text: `  --- ${host} ping statistics ---`, className: 'cmd-dim' },
          { text: '  3 packets transmitted, 3 packets received, 0.0% loss', className: 'cmd-success' },
          { text: '  round-trip min/avg/max = 11.8/12.4/13.1 ms', className: 'cmd-dim' },
        ]);
        break;
      }

      case 'wget': {
        const file = args[0] || '';
        if (file.includes('resume') || file === 'resume.pdf') {
          addOutput([
            { text: '  --2026-02-10 03:14:15--  https://portfolio.dev/resume.pdf', className: 'cmd-dim' },
            { text: '  Resolving portfolio.dev... 143.198.72.41', className: 'cmd-dim' },
            { text: '  Connecting to portfolio.dev|143.198.72.41|:443... connected.', className: 'cmd-info' },
            { text: '  HTTP request sent, awaiting response... 200 OK', className: 'cmd-success' },
            { text: '  Length: 142,856 (140K) [application/pdf]', className: 'cmd-info' },
            { text: '  Saving to: \'resume.pdf\'', className: 'cmd-info' },
            { text: '' },
            { text: '  resume.pdf        100%[=================>] 139.51K   --.-KB/s    in 0.04s', className: 'cmd-success' },
            { text: '' },
            { text: '  Feature coming soon! For now, reach out: rchintak@umd.edu', className: 'cmd-warn' },
          ]);
        } else {
          addOutput([
            { text: `  wget: missing URL`, className: 'cmd-error' },
            { text: '  Try: wget resume.pdf', className: 'cmd-dim' },
          ]);
        }
        break;
      }

      case 'curl': {
        const url = args[0] || '';
        if (url) {
          addOutput([
            { text: `  curl: (7) Failed to connect to ${url}: Connection refused`, className: 'cmd-error' },
            { text: '  This is a portfolio, not a proxy server.', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([{ text: '  curl: try \'curl --help\' for more information', className: 'cmd-error' }]);
        }
        break;
      }

      case 'grep': {
        if (args.length < 1) {
          addOutput([{ text: '  grep: missing pattern', className: 'cmd-error' }]);
        } else {
          addOutput([
            { text: `  Searching for "${args[0]}" in portfolio...`, className: 'cmd-dim' },
            { text: '  about.txt: Full-stack engineer, AI/ML researcher, and quant analyst', className: 'cmd-info' },
            { text: '  skills.txt: React, Flask, .NET, Node.js, REST APIs, OAuth2', className: 'cmd-info' },
            { text: `  2 matches found.`, className: 'cmd-success' },
          ]);
        }
        break;
      }

      case 'man': {
        const topic = args[0] || '';
        if (topic === 'rohan' || topic === 'me') {
          addOutput([
            { text: '  ROHAN(1)            User Commands            ROHAN(1)', className: 'cmd-highlight' },
            { text: '' },
            { text: '  NAME', className: 'cmd-highlight' },
            { text: '    rohan - CS + Math student, builder, researcher', className: 'cmd-info' },
            { text: '' },
            { text: '  SYNOPSIS', className: 'cmd-highlight' },
            { text: '    rohan [--code] [--research] [--quant] [--hackathon]', className: 'cmd-info' },
            { text: '' },
            { text: '  DESCRIPTION', className: 'cmd-highlight' },
            { text: '    Builds at the intersection of systems, intelligence,', className: 'cmd-info' },
            { text: '    and markets. Ships fast, learns faster.', className: 'cmd-info' },
            { text: '' },
            { text: '  BUGS', className: 'cmd-highlight' },
            { text: '    Occasionally fueled by excessive caffeine.', className: 'cmd-dim' },
            { text: '    Known to say "it works on my machine."', className: 'cmd-dim' },
          ]);
        } else if (!topic) {
          addOutput([
            { text: '  What manual page do you want?', className: 'cmd-error' },
            { text: '  Try: man rohan', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([{ text: `  No manual entry for ${topic}`, className: 'cmd-error' }]);
        }
        break;
      }

      case 'top':
        addOutput([
          { text: '  PID   USER    PR   RES     CPU%  MEM%  COMMAND', className: 'cmd-dim' },
          { text: '  1001  rohan   20   2.4G    94.0  12.1  languages.process', className: 'cmd-highlight' },
          { text: '  1002  rohan   20   1.8G    88.0   8.4  frameworks.service', className: 'cmd-cyan' },
          { text: '  1003  rohan   20   512M    81.0   4.2  cloud.daemon', className: 'cmd-warn' },
          { text: '  1004  rohan   20   1.2G    76.0   6.8  ml-ai.pipeline', className: 'cmd-error' },
          { text: '  1005  rohan   20   256M    72.0   2.1  systems.kernel', className: 'cmd-info' },
          { text: '' },
          { text: '  Mem: 31.2G/32G  Swap: 0B/0B  Load: 0.42', className: 'cmd-dim' },
        ]);
        break;

      case 'matrix':
        onMatrixIntensify();
        addOutput([
          { text: '  [MATRIX] Rain intensity toggled.', className: 'cmd-success' },
          { text: '  "Follow the white rabbit..."', className: 'cmd-dim' },
        ]);
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'exit':
        onClose();
        break;

      case 'sudo':
        if (args.join(' ').toLowerCase() === 'hire rohan') {
          addOutput([
            { text: '  [sudo] password for visitor: ********', className: 'cmd-dim' },
            { text: '' },
            { text: '  ✓ AUTHENTICATION SUCCESSFUL', className: 'cmd-success' },
            { text: '  ✓ Opening email client...', className: 'cmd-success' },
            { text: '  ✓ Excellent decision.', className: 'cmd-highlight' },
          ]);
          setTimeout(() => {
            window.location.href = 'mailto:rchintak@umd.edu?subject=Let\'s%20work%20together&body=Hi%20Rohan,';
          }, 1500);
        } else if (args[0] === 'rm' && args.includes('-rf') && args.includes('/')) {
          addOutput([
            { text: '  [sudo] password for visitor: ********', className: 'cmd-dim' },
            { text: '' },
            { text: '  Nice try. This portfolio is indestructible.', className: 'cmd-warn' },
            { text: '  Incident reported to /dev/null', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([
            { text: `  sudo: ${args.join(' ')}: command not found`, className: 'cmd-error' },
            { text: '  Try: sudo hire rohan', className: 'cmd-dim' },
          ]);
        }
        break;

      case 'rm':
        if (args.includes('-rf') && (args.includes('/') || args.includes('/*'))) {
          addOutput([
            { text: '  Nice try. This portfolio is indestructible.', className: 'cmd-warn' },
            { text: '  Incident reported to /dev/null', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([{ text: '  rm: cannot remove: Permission denied', className: 'cmd-error' }]);
        }
        break;

      case 'vim': case 'nano': case 'emacs':
        addOutput([
          { text: `  ${command}: read-only filesystem. This is a portfolio, not a codebase.`, className: 'cmd-warn' },
          { text: '  ...although check out my GitHub: github.com/RohanChintakindi', className: 'cmd-dim' },
        ]);
        break;

      case 'echo':
        addOutput([{ text: `  ${args.join(' ')}`, className: 'cmd-info' }]);
        break;

      default:
        addOutput([
          { text: `  bash: ${command}: command not found`, className: 'cmd-error' },
          { text: '  Type "help" for available commands.', className: 'cmd-dim' },
        ]);
    }
  }, [addOutput, commandHistory, onClose, onNavigate, onMatrixIntensify, onThemeChange, currentTheme]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const allHistory = [...FAKE_HISTORY, ...commandHistory];
      if (allHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? allHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(allHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const allHistory = [...FAKE_HISTORY, ...commandHistory];
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= allHistory.length) { setHistoryIndex(-1); setInput(''); }
      else { setHistoryIndex(newIndex); setInput(allHistory[newIndex]); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!input) return;
      const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="command-line"
          initial={{ y: 300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="command-line-bar">
            <span className="command-line-dot red" />
            <span className="command-line-dot amber" />
            <span className="command-line-dot green" />
            <span className="command-line-title">rohan@portfolio: ~</span>
            <button className="command-line-close" onClick={onClose}>×</button>
          </div>
          <div className="command-line-output" ref={outputRef}>
            {output.map((line, i) => (
              <div key={i} className={`command-line-text ${line.className || ''}`}>
                {line.text || '\u00A0'}
              </div>
            ))}
          </div>
          <div className="command-line-input-row">
            <span className="command-line-prompt">
              <span className="cmd-user">rohan</span>
              <span className="cmd-at">@</span>
              <span className="cmd-host">portfolio</span>
              <span className="cmd-colon">:</span>
              <span className="cmd-path">~</span>
              <span className="cmd-dollar">$</span>
            </span>
            <div className="command-line-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="command-line-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoFocus
              />
              {ghostSuggestion && (
                <span className="command-line-ghost">{input}{ghostSuggestion}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
