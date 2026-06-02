import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

const AudioContext = createContext<{
  volume: number;
  muted: boolean;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
}>(null!);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <AudioContext.Provider value={{ volume, muted, setVolume, setMuted }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioContext = () => useContext(AudioContext);