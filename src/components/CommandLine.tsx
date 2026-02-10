import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandLineProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onMatrixIntensify: () => void;
}

interface OutputLine {
  text: string;
  className?: string;
  isHTML?: boolean;
}

const AVAILABLE_COMMANDS = [
  'help', 'ls', 'cat', 'cd', 'whoami', 'neofetch', 'clear',
  'history', 'pwd', 'date', 'uptime', 'matrix', 'exit', 'sudo',
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
  { text: '╔══════════════════════════════════════════════════════╗', className: 'cmd-border' },
  { text: '║  ROHAN-OS Terminal v4.2.1 — Available Commands      ║', className: 'cmd-border' },
  { text: '╠══════════════════════════════════════════════════════╣', className: 'cmd-border' },
  { text: '║                                                      ║', className: 'cmd-border' },
  { text: '║  Navigation:                                         ║', className: 'cmd-border' },
  { text: '║    ls [section]     List sections or section content  ║', className: 'cmd-border' },
  { text: '║    cd <section>     Navigate to a section             ║', className: 'cmd-border' },
  { text: '║    cat <file>       View section details              ║', className: 'cmd-border' },
  { text: '║                                                      ║', className: 'cmd-border' },
  { text: '║  Info:                                                ║', className: 'cmd-border' },
  { text: '║    whoami           Display bio                       ║', className: 'cmd-border' },
  { text: '║    neofetch         System info & skills              ║', className: 'cmd-border' },
  { text: '║    pwd              Current directory                 ║', className: 'cmd-border' },
  { text: '║    date             Current date                      ║', className: 'cmd-border' },
  { text: '║    uptime           Session uptime                    ║', className: 'cmd-border' },
  { text: '║    history          Command history                   ║', className: 'cmd-border' },
  { text: '║                                                      ║', className: 'cmd-border' },
  { text: '║  Fun:                                                 ║', className: 'cmd-border' },
  { text: '║    matrix           Toggle matrix rain intensity      ║', className: 'cmd-border' },
  { text: '║    sudo hire rohan  You know what to do               ║', className: 'cmd-border' },
  { text: '║                                                      ║', className: 'cmd-border' },
  { text: '║  System:                                              ║', className: 'cmd-border' },
  { text: '║    clear            Clear terminal                    ║', className: 'cmd-border' },
  { text: '║    exit             Close terminal                    ║', className: 'cmd-border' },
  { text: '║                                                      ║', className: 'cmd-border' },
  { text: '╚══════════════════════════════════════════════════════╝', className: 'cmd-border' },
];

const SECTIONS_MAP: Record<string, string> = {
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  skills: 'skills',
  contact: 'contact',
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

export default function CommandLine({ isOpen, onClose, onNavigate, onMatrixIntensify }: CommandLineProps) {
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
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

    // Add command echo
    setOutput((prev) => [
      ...prev,
      { text: `rohan@portfolio:~$ ${trimmed}`, className: 'cmd-echo' },
    ]);

    // Add to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    switch (command) {
      case 'help':
        addOutput(HELP_TEXT);
        break;

      case 'ls': {
        if (args.length === 0 || args[0] === '~/' || args[0] === '.' || args[0] === '~') {
          addOutput([
            { text: 'drwxr-xr-x  about/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  experience/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  projects/', className: 'cmd-dir' },
            { text: 'drwxr-xr-x  skills/', className: 'cmd-dir' },
            { text: '-rw-r--r--  contact.txt', className: 'cmd-file' },
            { text: '-rw-r--r--  about.txt', className: 'cmd-file' },
            { text: '-rw-r--r--  README.md', className: 'cmd-file' },
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
          { text: '  Navigating to skills section...', className: 'cmd-success' },
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
        addOutput([
          { text: `  up ${m} min ${s} sec, 1 user, load average: 0.42, 0.38, 0.35`, className: 'cmd-info' },
        ]);
        break;
      }

      case 'history': {
        const allHistory = [...FAKE_HISTORY, ...commandHistory];
        const lines = allHistory.map((h, i) => ({
          text: `  ${String(i + 1).padStart(4)}  ${h}`,
          className: 'cmd-dim',
        }));
        addOutput(lines);
        break;
      }

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
            { text: '  ⚠ Nice try. This portfolio is indestructible.', className: 'cmd-warn' },
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
            { text: '  ⚠ Nice try. This portfolio is indestructible.', className: 'cmd-warn' },
            { text: '  Incident reported to /dev/null', className: 'cmd-dim' },
          ]);
        } else {
          addOutput([{ text: `  rm: cannot remove: Permission denied`, className: 'cmd-error' }]);
        }
        break;

      case 'vim':
      case 'nano':
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
  }, [addOutput, commandHistory, onClose, onNavigate, onMatrixIntensify]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const allHistory = [...FAKE_HISTORY, ...commandHistory];
      if (allHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? allHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(allHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const allHistory = [...FAKE_HISTORY, ...commandHistory];
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= allHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(allHistory[newIndex]);
      }
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
            <button className="command-line-close" onClick={onClose}>
              ×
            </button>
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
