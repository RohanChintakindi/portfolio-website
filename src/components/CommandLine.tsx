import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FORTUNES, THEMES, RESUME_LINES, SECRET_ROOM, TYPING_SNIPPETS, type ThemeName } from '../data/portfolio';
import type { Achievement } from '../hooks/useAchievements';

interface CommandLineProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onMatrixIntensify: () => void;
  onThemeChange: (theme: ThemeName) => void;
  currentTheme: ThemeName;
  onHack: () => void;
  achievements: Achievement[];
  onAchievement: (id: string) => void;
  commandCount: number;
  onCommandRun: () => void;
  sessionStart: number;
}

interface OutputLine {
  text: string;
  className?: string;
}

const AVAILABLE_COMMANDS = [
  'help', 'ls', 'cat', 'cd', 'whoami', 'neofetch', 'clear',
  'history', 'pwd', 'date', 'uptime', 'matrix', 'exit', 'sudo',
  'fortune', 'cowsay', 'ping', 'wget', 'theme', 'man', 'top',
  'echo', 'curl', 'grep', 'tree', 'hack', 'resume', 'achievements',
  'stats', 'typingtest',
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
  { text: '│  ROHAN-OS Terminal v4.2.1                            │', className: 'cmd-border' },
  { text: '├──────────────────────────────────────────────────────┤', className: 'cmd-border' },
  { text: '│  Navigation: ls, cd, cat, tree                      │', className: 'cmd-border' },
  { text: '│  Info:       whoami, neofetch, man, top, resume      │', className: 'cmd-border' },
  { text: '│  Fun:        matrix, fortune, cowsay, theme, hack    │', className: 'cmd-border' },
  { text: '│  Games:      typingtest                              │', className: 'cmd-border' },
  { text: '│  Network:    ping, wget, curl                        │', className: 'cmd-border' },
  { text: '│  Stats:      stats, achievements, uptime, history    │', className: 'cmd-border' },
  { text: '│  System:     clear, exit, sudo hire rohan            │', className: 'cmd-border' },
  { text: '│  Secret:     cd /dev/null                            │', className: 'cmd-border' },
  { text: '│  Pipe:       fortune | cowsay                        │', className: 'cmd-border' },
  { text: '│  Tip: Tab=autocomplete  ↑↓=history  Esc=close       │', className: 'cmd-border' },
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
  ],
  'skills.txt': [
    { text: '  Languages:  Java, Python, TypeScript, C, C#, Rust, OCaml, SQL', className: 'cmd-info' },
    { text: '  Frameworks: React, Flask, .NET, Node.js, REST APIs, OAuth2', className: 'cmd-info' },
    { text: '  Cloud:      Azure, AWS, Docker, GitHub Actions, CI/CD', className: 'cmd-info' },
    { text: '  ML/AI:      PyTorch, Model Fine-Tuning, GPU Inference', className: 'cmd-info' },
  ],
};

function cowsay(msg: string): OutputLine[] {
  const len = Math.min(msg.length, 44);
  const top = '  ' + '_'.repeat(len + 2);
  const bot = '  ' + '-'.repeat(len + 2);
  const wrapped = msg.length <= 44 ? [msg] : [msg.slice(0, 44), msg.slice(44, 88)];
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

export default function CommandLine({
  isOpen, onClose, onNavigate, onMatrixIntensify, onThemeChange,
  currentTheme, onHack, achievements, onAchievement, commandCount,
  onCommandRun, sessionStart,
}: CommandLineProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([
    { text: 'ROHAN-OS Terminal v4.2.1 — Type "help" for commands.', className: 'cmd-dim' },
    { text: '' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [typingTest, setTypingTest] = useState<{ target: string; startTime: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const ghostSuggestion = useMemo(() => {
    if (!input || input.length < 1) return '';
    const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
    return match ? match.slice(input.length) : '';
  }, [input]);

  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 100); }, [isOpen]);
  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [output]);

  const addOutput = useCallback((lines: OutputLine[]) => {
    setOutput((prev) => [...prev, { text: '' }, ...lines]);
  }, []);

  const processCommand = useCallback((rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Check for typing test mode
    if (typingTest) {
      const elapsed = (Date.now() - typingTest.startTime) / 1000;
      const target = typingTest.target;
      setTypingTest(null);

      setOutput((prev) => [...prev, { text: `> ${trimmed}`, className: 'cmd-echo' }]);

      // Calculate accuracy
      let correct = 0;
      for (let i = 0; i < Math.min(trimmed.length, target.length); i++) {
        if (trimmed[i] === target[i]) correct++;
      }
      const accuracy = Math.round((correct / target.length) * 100);
      const words = target.split(/\s+/).length;
      const wpm = Math.round((words / elapsed) * 60);

      addOutput([
        { text: '  ── TYPING TEST RESULTS ──', className: 'cmd-highlight' },
        { text: `  Time:     ${elapsed.toFixed(1)}s`, className: 'cmd-info' },
        { text: `  WPM:      ${wpm}`, className: wpm > 60 ? 'cmd-success' : wpm > 30 ? 'cmd-warn' : 'cmd-error' },
        { text: `  Accuracy: ${accuracy}%`, className: accuracy > 90 ? 'cmd-success' : accuracy > 70 ? 'cmd-warn' : 'cmd-error' },
        { text: `  Rating:   ${wpm > 80 ? 'Blazing fast!' : wpm > 50 ? 'Solid speed.' : wpm > 30 ? 'Keep practicing.' : 'Maybe try again?'}`, className: 'cmd-dim' },
      ]);

      onAchievement('typingChamp');
      return;
    }

    // Handle piping
    if (trimmed.includes(' | ')) {
      setOutput((prev) => [...prev, { text: `rohan@portfolio:~$ ${trimmed}`, className: 'cmd-echo' }]);
      onCommandRun();
      onAchievement('piper');

      const [leftCmd, rightCmd] = trimmed.split(' | ').map(s => s.trim());
      const leftParts = leftCmd.split(/\s+/);
      const leftCommand = leftParts[0].toLowerCase();
      const leftArgs = leftParts.slice(1);

      let pipeOutput = '';

      // Execute left side
      if (leftCommand === 'fortune') {
        pipeOutput = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      } else if (leftCommand === 'echo') {
        pipeOutput = leftArgs.join(' ');
      } else if (leftCommand === 'whoami') {
        pipeOutput = 'Rohan Chintakindi';
      } else if (leftCommand === 'date') {
        pipeOutput = new Date().toLocaleString();
      } else if (leftCommand === 'pwd') {
        pipeOutput = '/home/rohan/portfolio';
      } else {
        addOutput([{ text: `  pipe: unsupported left command: ${leftCommand}`, className: 'cmd-error' }]);
        return;
      }

      // Execute right side with piped input
      const rightParts = rightCmd.split(/\s+/);
      const rightCommand = rightParts[0].toLowerCase();

      if (rightCommand === 'cowsay') {
        addOutput(cowsay(pipeOutput));
      } else if (rightCommand === 'grep') {
        const pattern = rightParts[1] || '';
        if (pipeOutput.toLowerCase().includes(pattern.toLowerCase())) {
          addOutput([{ text: `  ${pipeOutput}`, className: 'cmd-info' }]);
        } else {
          addOutput([{ text: '  (no match)', className: 'cmd-dim' }]);
        }
      } else {
        addOutput([{ text: `  ${pipeOutput}`, className: 'cmd-info' }]);
      }
      return;
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setOutput((prev) => [...prev, { text: `rohan@portfolio:~$ ${trimmed}`, className: 'cmd-echo' }]);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    onCommandRun();

    if (commandCount + 1 >= 20) onAchievement('commandVet');
    if (command !== 'clear') onAchievement('firstCommand');

    switch (command) {
      case 'help':
        addOutput(HELP_TEXT);
        break;

      case 'ls': {
        if (args.length === 0 || ['~/', '.', '~'].includes(args[0])) {
          addOutput([
            { text: 'drwxr-xr-x  2.1K  Feb 10  about/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  4.2K  Feb 10  experience/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  3.8K  Feb 10  projects/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  1.5K  Feb 10  skills/', className: 'cmd-dir' },
            { text: '-rw-r--r--   842  Feb 10  contact.txt', className: 'cmd-file' },
            { text: '-rw-r--r--   512  Feb 10  about.txt', className: 'cmd-file' },
            { text: '-rw-r--r--   256  Feb 10  README.md', className: 'cmd-file' },
            { text: '-rw-r--r--   128  Feb 10  resume.pdf', className: 'cmd-file' },
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
        const target = args[0]?.toLowerCase() || '';
        if (!target) {
          addOutput([{ text: '  ~', className: 'cmd-info' }]);
        } else if (target === '/dev/null' || target === 'secret' || target === '/dev/secret') {
          onAchievement('secretFinder');
          addOutput(SECRET_ROOM.map(t => ({ text: `  ${t}`, className: t.includes('┌') || t.includes('├') || t.includes('└') || t.includes('│') ? 'cmd-border' : 'cmd-info' })));
        } else {
          const section = target.replace(/[~/]/g, '');
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
        if (!args.length) { addOutput([{ text: 'cat: missing operand', className: 'cmd-error' }]); break; }
        const file = args[0].replace('~/', '').toLowerCase();
        if (FILE_MAP[file]) { addOutput(FILE_MAP[file]); }
        else if (file === 'readme.md') {
          addOutput([
            { text: '  # Rohan Chintakindi — Portfolio', className: 'cmd-highlight' },
            { text: '  Built with React + TypeScript + Motion', className: 'cmd-info' },
            { text: '  Terminal aesthetic. Zero bloat.', className: 'cmd-dim' },
          ]);
        } else {
          const section = file.replace('.txt', '').replace('/', '');
          if (SECTIONS_MAP[section]) { onNavigate(section); addOutput([{ text: `  Opening ${section}...`, className: 'cmd-success' }]); }
          else { addOutput([{ text: `cat: ${args[0]}: No such file or directory`, className: 'cmd-error' }]); }
        }
        break;
      }

      case 'tree':
        addOutput([
          { text: '  .', className: 'cmd-info' },
          { text: '  ├── about/', className: 'cmd-dir' },
          { text: '  ├── experience/ (7 roles)', className: 'cmd-dir' },
          { text: '  ├── projects/ (4 hackathon wins)', className: 'cmd-dir' },
          { text: '  ├── skills/', className: 'cmd-dir' },
          { text: '  ├── contact.txt', className: 'cmd-file' },
          { text: '  ├── resume.pdf', className: 'cmd-file' },
          { text: '  └── /dev/null (???)', className: 'cmd-dim' },
        ]);
        break;

      case 'whoami':
        addOutput([
          { text: '  Rohan Chintakindi', className: 'cmd-highlight' },
          { text: '  CS + Math @ University of Maryland', className: 'cmd-info' },
          { text: '  Full-stack engineer | AI/ML researcher | Quant analyst', className: 'cmd-dim' },
        ]);
        break;

      case 'neofetch':
        onNavigate('skills');
        addOutput([
          { text: '  ____  ______', className: 'cmd-highlight' },
          { text: ' / __ \\/ ____/  rohan@umd', className: 'cmd-highlight' },
          { text: '/ /_/ / /       OS: CS + Math', className: 'cmd-highlight' },
          { text: '/ _, _/ /___    Uptime: Aug 2024 — Dec 2027', className: 'cmd-highlight' },
          { text: '/_/ |_|\\____/   Shell: bash 5.2', className: 'cmd-highlight' },
        ]);
        break;

      case 'resume':
        addOutput(RESUME_LINES.map(t => ({ text: `  ${t}`, className: t.includes('┌') || t.includes('├') || t.includes('└') ? 'cmd-border' : t.includes('│') ? 'cmd-border' : 'cmd-info' })));
        break;

      case 'achievements':
        addOutput([
          { text: '  ── ACHIEVEMENTS ──', className: 'cmd-highlight' },
          ...achievements.map(a => ({
            text: `  ${a.unlocked ? '[✓]' : '[ ]'} ${a.icon} ${a.name} — ${a.desc}`,
            className: a.unlocked ? 'cmd-success' : 'cmd-dim',
          })),
          { text: '' },
          { text: `  ${achievements.filter(a => a.unlocked).length}/${achievements.length} unlocked`, className: 'cmd-info' },
        ]);
        break;

      case 'stats': {
        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        const unlocked = achievements.filter(a => a.unlocked).length;
        addOutput([
          { text: '  ── SESSION STATS ──', className: 'cmd-highlight' },
          { text: `  Commands run:       ${commandCount + 1}`, className: 'cmd-info' },
          { text: `  Session time:       ${min}m ${sec}s`, className: 'cmd-info' },
          { text: `  Achievements:       ${unlocked}/${achievements.length}`, className: 'cmd-info' },
          { text: `  Theme:              ${currentTheme}`, className: 'cmd-info' },
          { text: `  Scroll distance:    ${Math.round(window.scrollY)}px`, className: 'cmd-info' },
          { text: `  Terminal sessions:  ${commandHistory.length > 0 ? 'active' : 'first'}`, className: 'cmd-info' },
        ]);
        break;
      }

      case 'typingtest': {
        const snippet = TYPING_SNIPPETS[Math.floor(Math.random() * TYPING_SNIPPETS.length)];
        setTypingTest({ target: snippet, startTime: Date.now() });
        addOutput([
          { text: '  ── TYPING SPEED TEST ──', className: 'cmd-highlight' },
          { text: '  Type the following as fast as you can:', className: 'cmd-dim' },
          { text: '' },
          { text: `  ${snippet}`, className: 'cmd-warn' },
          { text: '' },
          { text: '  Press Enter when done.', className: 'cmd-dim' },
        ]);
        break;
      }

      case 'hack':
        onAchievement('hacker');
        onHack();
        addOutput([{ text: '  [INITIATING HACKER MODE...]', className: 'cmd-warn' }]);
        break;

      case 'fortune':
        onAchievement('fortuneTeller');
        addOutput([{ text: `  ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}`, className: 'cmd-info' }]);
        break;

      case 'cowsay':
        onAchievement('cowWhisperer');
        addOutput(cowsay(args.length ? args.join(' ') : 'moo'));
        break;

      case 'theme': {
        if (!args.length) {
          addOutput([
            { text: `  Current: ${currentTheme}`, className: 'cmd-info' },
            { text: `  Available: ${THEMES.join(', ')}`, className: 'cmd-dim' },
          ]);
        } else {
          const t = args[0].toLowerCase() as ThemeName;
          if (THEMES.includes(t)) {
            onThemeChange(t);
            onAchievement('themeChanger');
            addOutput([{ text: `  Theme → ${t}`, className: 'cmd-success' }]);
          } else {
            addOutput([{ text: `  Unknown theme. Available: ${THEMES.join(', ')}`, className: 'cmd-error' }]);
          }
        }
        break;
      }

      case 'ping': {
        const host = args[0] || 'portfolio.dev';
        addOutput([
          { text: `  PING ${host}: 64 bytes, icmp_seq=0 ttl=55 time=12.4ms`, className: 'cmd-info' },
          { text: `  PING ${host}: 64 bytes, icmp_seq=1 ttl=55 time=11.8ms`, className: 'cmd-info' },
          { text: `  3 packets, 0% loss, avg 12.1ms`, className: 'cmd-success' },
        ]);
        break;
      }

      case 'wget': {
        const file = args[0] || '';
        if (file.includes('resume')) {
          addOutput([
            { text: '  Connecting to portfolio.dev:443... connected.', className: 'cmd-info' },
            { text: '  resume.pdf   100%[========>]  140K  --.-KB/s  in 0.04s', className: 'cmd-success' },
            { text: '  Feature coming soon! Email: rchintak@umd.edu', className: 'cmd-warn' },
          ]);
        } else {
          addOutput([{ text: '  wget: missing URL. Try: wget resume.pdf', className: 'cmd-error' }]);
        }
        break;
      }

      case 'curl':
        addOutput([{ text: `  curl: (7) Connection refused. This is a portfolio.`, className: 'cmd-error' }]);
        break;

      case 'grep':
        if (args.length) {
          addOutput([
            { text: `  Searching for "${args[0]}"...`, className: 'cmd-dim' },
            { text: '  about.txt: Full-stack engineer, AI/ML researcher', className: 'cmd-info' },
            { text: '  2 matches found.', className: 'cmd-success' },
          ]);
        } else {
          addOutput([{ text: '  grep: missing pattern', className: 'cmd-error' }]);
        }
        break;

      case 'man': {
        const topic = args[0] || '';
        if (topic === 'rohan' || topic === 'me') {
          addOutput([
            { text: '  ROHAN(1)            User Commands', className: 'cmd-highlight' },
            { text: '  NAME:    rohan - builder, researcher, quantitative thinker', className: 'cmd-info' },
            { text: '  SYNOPSIS: rohan [--code] [--research] [--quant]', className: 'cmd-info' },
            { text: '  BUGS:    Occasionally fueled by excessive caffeine.', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([{ text: `  No manual entry for ${topic || '???'}. Try: man rohan`, className: 'cmd-error' }]);
        }
        break;
      }

      case 'top':
        addOutput([
          { text: '  PID   USER   CPU%  COMMAND', className: 'cmd-dim' },
          { text: '  1001  rohan  94.0  languages.process', className: 'cmd-highlight' },
          { text: '  1002  rohan  88.0  frameworks.service', className: 'cmd-cyan' },
          { text: '  1003  rohan  81.0  cloud.daemon', className: 'cmd-warn' },
          { text: '  1004  rohan  76.0  ml-ai.pipeline', className: 'cmd-error' },
        ]);
        break;

      case 'pwd':
        addOutput([{ text: '  /home/rohan/portfolio', className: 'cmd-info' }]);
        break;

      case 'date':
        addOutput([{ text: `  ${new Date().toString()}`, className: 'cmd-info' }]);
        break;

      case 'uptime': {
        const el = Math.floor((Date.now() - sessionStart) / 1000);
        addOutput([{ text: `  up ${Math.floor(el/60)} min ${el%60} sec, 1 user, load: 0.42`, className: 'cmd-info' }]);
        break;
      }

      case 'history': {
        const all = [...FAKE_HISTORY, ...commandHistory];
        addOutput(all.map((h, i) => ({ text: `  ${String(i+1).padStart(4)}  ${h}`, className: 'cmd-dim' })));
        break;
      }

      case 'matrix':
        onMatrixIntensify();
        addOutput([{ text: '  [MATRIX] Rain intensity toggled.', className: 'cmd-success' }]);
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'exit':
        onClose();
        break;

      case 'sudo':
        if (args.join(' ').toLowerCase() === 'hire rohan') {
          onAchievement('hired');
          addOutput([
            { text: '  [sudo] password for visitor: ********', className: 'cmd-dim' },
            { text: '  ✓ AUTHENTICATION SUCCESSFUL', className: 'cmd-success' },
            { text: '  ✓ Opening email client...', className: 'cmd-success' },
            { text: '  ✓ Excellent decision.', className: 'cmd-highlight' },
          ]);
          setTimeout(() => { window.location.href = 'mailto:rchintak@umd.edu?subject=Let\'s%20work%20together&body=Hi%20Rohan,'; }, 1500);
        } else if (args.includes('-rf') && (args.includes('/') || args.includes('/*'))) {
          onAchievement('destroyer');
          addOutput([
            { text: '  Nice try. This portfolio is indestructible.', className: 'cmd-warn' },
            { text: '  Incident reported to /dev/null', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([{ text: `  sudo: ${args.join(' ')}: command not found. Try: sudo hire rohan`, className: 'cmd-error' }]);
        }
        break;

      case 'rm':
        onAchievement('destroyer');
        addOutput([{ text: '  Nice try. This portfolio is indestructible.', className: 'cmd-warn' }]);
        break;

      case 'vim': case 'nano': case 'emacs':
        addOutput([{ text: `  ${command}: read-only filesystem. Check GitHub: github.com/RohanChintakindi`, className: 'cmd-warn' }]);
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
  }, [addOutput, commandHistory, onClose, onNavigate, onMatrixIntensify, onThemeChange, currentTheme, onHack, achievements, onAchievement, commandCount, onCommandRun, sessionStart, typingTest]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { processCommand(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const all = [...FAKE_HISTORY, ...commandHistory];
      if (!all.length) return;
      const idx = historyIndex === -1 ? all.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx); setInput(all[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const all = [...FAKE_HISTORY, ...commandHistory];
      if (historyIndex === -1) return;
      const idx = historyIndex + 1;
      if (idx >= all.length) { setHistoryIndex(-1); setInput(''); }
      else { setHistoryIndex(idx); setInput(all[idx]); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (input) {
        const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
        if (match) setInput(match);
      }
    } else if (e.key === 'Escape') { onClose(); }
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
            {typingTest && <span className="cmd-warn" style={{ marginLeft: 'auto', marginRight: 8, fontSize: '0.6rem' }}>TYPING TEST ACTIVE</span>}
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
              {ghostSuggestion && !typingTest && (
                <span className="command-line-ghost">{input}{ghostSuggestion}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
