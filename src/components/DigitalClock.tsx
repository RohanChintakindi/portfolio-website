import { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(time.getHours()).padStart(2, '0');
  const m = String(time.getMinutes()).padStart(2, '0');
  const s = String(time.getSeconds()).padStart(2, '0');

  return (
    <span className="digital-clock">
      <span className="clock-digit">{h}</span>
      <span className="clock-sep">:</span>
      <span className="clock-digit">{m}</span>
      <span className="clock-sep">:</span>
      <span className="clock-digit">{s}</span>
    </span>
  );
}
