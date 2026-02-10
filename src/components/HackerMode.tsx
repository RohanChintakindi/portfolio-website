import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HackerModeProps {
  active: boolean;
  onComplete: () => void;
}

const HACK_LINES = [
  'Initializing attack vector...',
  'Scanning ports: 22, 80, 443, 8080...',
  'Port 443 OPEN — TLS 1.3 detected',
  'Bypassing firewall rules...',
  'Injecting SQL payload: \' OR 1=1; DROP TABLE users;--',
  'Firewall bypassed. Establishing tunnel...',
  'SSH tunnel established on :4444',
  'Decrypting RSA-4096 key pair...',
  'Key decrypted: 0xDEADBEEF...CA FE',
  'Escalating privileges: user → root',
  'Privilege escalation successful.',
  'Downloading /etc/shadow...',
  'Extracting password hashes...',
  'Cracking hashes with hashcat...',
  'Hash cracked in 0.042s (lol)',
  'Planting persistent backdoor...',
  'Backdoor installed: /tmp/.h4ck',
  'Covering tracks: rm -rf /var/log/*',
  'Exfiltrating data...',
  '',
  '████████████████████████████ 100%',
  '',
];

const HEX_CHARS = '0123456789ABCDEF';
function randomHex(len: number): string {
  return Array.from({ length: len }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join('');
}

export default function HackerMode({ active, onComplete }: HackerModeProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'hacking' | 'granted' | 'idle'>('idle');
  const [hexStream, setHexStream] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!active) {
      setPhase('idle');
      setLines([]);
      return;
    }

    setPhase('hacking');
    setLines([]);

    // Hex stream background
    intervalRef.current = setInterval(() => {
      setHexStream(Array.from({ length: 8 }, () => randomHex(8)).join('  '));
    }, 80);

    // Add lines progressively
    HACK_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, i * 220);
    });

    // Show ACCESS GRANTED
    setTimeout(() => {
      setPhase('granted');
      clearInterval(intervalRef.current);
    }, HACK_LINES.length * 220 + 400);

    // Complete
    setTimeout(() => {
      onComplete();
    }, HACK_LINES.length * 220 + 2500);

    return () => clearInterval(intervalRef.current);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="hacker-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {phase === 'hacking' && (
            <>
              <div className="hacker-hex">{hexStream}</div>
              <div className="hacker-content">
                <div className="hacker-header">
                  [INTRUSION DETECTION SYSTEM BYPASSED]
                </div>
                {lines.map((line, i) => (
                  <div key={i} className={`hacker-line ${line.includes('████') ? 'hacker-progress' : ''}`}>
                    {line.includes('OPEN') || line.includes('successful') || line.includes('bypassed') || line.includes('cracked')
                      ? <span className="hacker-success">{line}</span>
                      : line.includes('DROP') || line.includes('rm -rf')
                      ? <span className="hacker-danger">{line}</span>
                      : line}
                  </div>
                ))}
                <span className="hacker-cursor">█</span>
              </div>
            </>
          )}

          {phase === 'granted' && (
            <motion.div
              className="hacker-granted"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div className="hacker-granted-text">ACCESS GRANTED</div>
              <div className="hacker-granted-sub">Welcome back, root.</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
