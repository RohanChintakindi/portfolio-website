import { useState, useEffect, useRef } from 'react';

interface StatusBarProps {
  currentSection: string;
  onCommandLineToggle: () => void;
  commandLineOpen: boolean;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getScrollProgress(): number {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 0;
  return Math.round((scrollTop / docHeight) * 100);
}

function buildProgressBar(pct: number): string {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export default function StatusBar({ currentSection, onCommandLineToggle, commandLineOpen }: StatusBarProps) {
  const [uptime, setUptime] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [networkActivity, setNetworkActivity] = useState<boolean[]>([false, false, false, false, false]);
  const PID = 31337;
  const networkRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const interval = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollPct(getScrollProgress());
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fake network activity blinking
  useEffect(() => {
    networkRef.current = setInterval(() => {
      setNetworkActivity(
        Array.from({ length: 5 }, () => Math.random() > 0.4)
      );
    }, 300);
    return () => clearInterval(networkRef.current);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-indicator" />
        <span className="status-pid">PID {PID}</span>
        <span className="status-sep">│</span>
        <span className="status-section">
          <span className="status-label">SECTION</span> {currentSection}
        </span>
      </div>
      <div className="status-bar-center">
        <span className="status-network">
          {networkActivity.map((active, i) => (
            <span
              key={i}
              className={`status-net-dot ${active ? 'active' : ''}`}
            />
          ))}
        </span>
        <span className="status-progress-bar">{buildProgressBar(scrollPct)}</span>
        <span className="status-pct">{scrollPct}%</span>
      </div>
      <div className="status-bar-right">
        <span className="status-uptime">
          <span className="status-label">UP</span> {formatUptime(uptime)}
        </span>
        <span className="status-sep">│</span>
        <button
          className={`status-terminal-btn ${commandLineOpen ? 'active' : ''}`}
          onClick={onCommandLineToggle}
          title="Toggle terminal (Ctrl+`)"
        >
          &gt;_
        </button>
      </div>
    </div>
  );
}
