import { useState, useCallback, useRef } from 'react';

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'firstCommand', name: 'Hello World', desc: 'Run your first command', icon: '>', unlocked: false },
  { id: 'themeChanger', name: 'Aesthetic', desc: 'Change the terminal theme', icon: '~', unlocked: false },
  { id: 'konamiMaster', name: 'Konami Master', desc: 'Enter the Konami code', icon: '↑', unlocked: false },
  { id: 'fortuneTeller', name: 'Fortune Teller', desc: 'Seek wisdom with fortune', icon: '*', unlocked: false },
  { id: 'cowWhisperer', name: 'Cow Whisperer', desc: 'Make the cow speak', icon: 'M', unlocked: false },
  { id: 'hired', name: 'Recruiter', desc: 'Attempt to hire Rohan', icon: '$', unlocked: false },
  { id: 'hacker', name: 'Mr. Robot', desc: 'Initiate hacker mode', icon: '#', unlocked: false },
  { id: 'secretFinder', name: 'Explorer', desc: 'Find the secret room', icon: '?', unlocked: false },
  { id: 'typingChamp', name: 'Speed Demon', desc: 'Complete the typing test', icon: '⌨', unlocked: false },
  { id: 'commandVet', name: 'Veteran', desc: 'Run 20+ commands', icon: '★', unlocked: false },
  { id: 'piper', name: 'Pipe Dream', desc: 'Use command piping', icon: '|', unlocked: false },
  { id: 'destroyer', name: 'Nice Try', desc: 'Attempt rm -rf /', icon: '!', unlocked: false },
];

export default function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('rohan-achievements');
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        return INITIAL_ACHIEVEMENTS.map((a) => ({
          ...a,
          unlocked: parsed[a.id] ?? false,
        }));
      }
    } catch { /* ignore */ }
    return INITIAL_ACHIEVEMENTS;
  });

  const pendingToasts = useRef<Achievement[]>([]);

  const unlock = useCallback((id: string) => {
    setAchievements((prev) => {
      const existing = prev.find((a) => a.id === id);
      if (!existing || existing.unlocked) return prev;

      const updated = prev.map((a) =>
        a.id === id ? { ...a, unlocked: true } : a
      );

      // Persist
      const map: Record<string, boolean> = {};
      updated.forEach((a) => { map[a.id] = a.unlocked; });
      try { localStorage.setItem('rohan-achievements', JSON.stringify(map)); } catch { /* ignore */ }

      // Queue toast
      const achievement = updated.find((a) => a.id === id);
      if (achievement) pendingToasts.current.push(achievement);

      return updated;
    });
  }, []);

  const consumeToasts = useCallback((): Achievement[] => {
    const toasts = [...pendingToasts.current];
    pendingToasts.current = [];
    return toasts;
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return { achievements, unlock, consumeToasts, unlockedCount, totalCount };
}
