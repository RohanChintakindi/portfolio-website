import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BootSequenceProps {
  onComplete: () => void;
}

const SSH_LINES = [
  { text: '$ ssh rohan@portfolio.dev', className: 'boot-cmd', delay: 0 },
  { text: 'The authenticity of host \'portfolio.dev (143.198.72.41)\' can\'t be established.', className: 'boot-info', delay: 400 },
  { text: 'ED25519 key fingerprint is SHA256:a8Kj2nR4vMp...xQ9tBz.', className: 'boot-info', delay: 600 },
  { text: 'Are you sure you want to continue connecting? (yes/no) yes', className: 'boot-warn', delay: 900 },
  { text: 'Warning: Permanently added \'portfolio.dev\' to known hosts.', className: 'boot-warn', delay: 1200 },
  { text: 'Connection established. Entering system...', className: 'boot-ok', delay: 1500 },
  { text: '', className: '', delay: 1800 },
];

const BOOT_LINES = [
  { text: 'ROHAN-OS v4.2.1 BIOS', className: 'boot-info', delay: 2000 },
  { text: 'Copyright (c) 2024-2027 Chintakindi Systems', className: 'boot-info', delay: 2100 },
  { text: '', className: '', delay: 2200 },
  { text: 'CPU: Neural Processing Unit @ 3.8GHz ... [OK]', className: 'boot-ok', delay: 2300 },
  { text: 'Memory Test: 32768MB .................. [OK]', className: 'boot-ok', delay: 2450 },
  { text: 'GPU: CUDA Accelerator x2 ............. [OK]', className: 'boot-ok', delay: 2600 },
  { text: 'Network: Secure Channel .............. [OK]', className: 'boot-ok', delay: 2750 },
  { text: '', className: '', delay: 2850 },
  { text: 'Loading kernel modules...', className: 'boot-info', delay: 2950 },
  { text: '  > react.runtime.v19 ................ loaded', className: 'boot-ok', delay: 3100 },
  { text: '  > typescript.compiler.v5 ........... loaded', className: 'boot-ok', delay: 3200 },
  { text: '  > motion.animation.engine .......... loaded', className: 'boot-ok', delay: 3300 },
  { text: '', className: '', delay: 3400 },
  { text: 'Mounting filesystem /dev/portfolio ... [OK]', className: 'boot-ok', delay: 3500 },
  { text: 'Starting display server ............. [OK]', className: 'boot-ok', delay: 3600 },
  { text: '', className: '', delay: 3700 },
  { text: '> Initializing rohan.portfolio v1.0.0', className: 'boot-cmd', delay: 3800 },
  { text: 'PROGRESS_BAR', className: '', delay: 3950 },
  { text: '', className: '', delay: 4800 },
  { text: '> System ready. Launching interface...', className: 'boot-cmd', delay: 5000 },
];

const ALL_LINES = [...SSH_LINES, ...BOOT_LINES];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    ALL_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
          if (line.text === 'PROGRESS_BAR') {
            setTimeout(() => setProgress(100), 100);
          }
        }, line.delay)
      );
    });

    timers.push(
      setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 500);
      }, 5400)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    setTimeout(onComplete, 200);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="boot-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button className="skip-boot" onClick={handleSkip}>
            skip &gt;
          </button>
          <div className="boot-content">
            {ALL_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="boot-line"
                style={{ animationDelay: '0ms' }}
              >
                {line.text === 'PROGRESS_BAR' ? (
                  <span>
                    <span className="boot-cmd">&gt; Loading modules: </span>
                    <span className="boot-progress-bar">
                      <span
                        className="boot-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                    {progress === 100 && <span className="boot-ok"> 100%</span>}
                  </span>
                ) : line.text === '' ? (
                  <br />
                ) : (
                  <span className={line.className}>{line.text}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
