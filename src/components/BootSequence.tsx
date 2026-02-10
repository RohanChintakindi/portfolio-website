import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'ROHAN-OS v4.2.1 BIOS', className: 'boot-info', delay: 0 },
  { text: 'Copyright (c) 2024-2027 Chintakindi Systems', className: 'boot-info', delay: 100 },
  { text: '', className: '', delay: 200 },
  { text: 'CPU: Neural Processing Unit @ 3.8GHz ... [OK]', className: 'boot-ok', delay: 300 },
  { text: 'Memory Test: 32768MB .................. [OK]', className: 'boot-ok', delay: 500 },
  { text: 'GPU: CUDA Accelerator x2 ............. [OK]', className: 'boot-ok', delay: 650 },
  { text: 'Network: Secure Channel .............. [OK]', className: 'boot-ok', delay: 800 },
  { text: '', className: '', delay: 900 },
  { text: 'Loading kernel modules...', className: 'boot-info', delay: 1000 },
  { text: '  > react.runtime.v19 ................ loaded', className: 'boot-ok', delay: 1150 },
  { text: '  > typescript.compiler.v5 ........... loaded', className: 'boot-ok', delay: 1300 },
  { text: '  > motion.animation.engine .......... loaded', className: 'boot-ok', delay: 1450 },
  { text: '', className: '', delay: 1550 },
  { text: 'Mounting filesystem /dev/portfolio ... [OK]', className: 'boot-ok', delay: 1650 },
  { text: 'Starting display server ............. [OK]', className: 'boot-ok', delay: 1800 },
  { text: '', className: '', delay: 1900 },
  { text: '> Initializing rohan.portfolio v1.0.0', className: 'boot-cmd', delay: 2000 },
  { text: 'PROGRESS_BAR', className: '', delay: 2200 },
  { text: '', className: '', delay: 3200 },
  { text: '> System ready. Launching interface...', className: 'boot-cmd', delay: 3400 },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
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
        setTimeout(onComplete, 600);
      }, 3800)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="boot-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="boot-content">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
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
                    {progress === 100 && (
                      <span className="boot-ok"> 100%</span>
                    )}
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
