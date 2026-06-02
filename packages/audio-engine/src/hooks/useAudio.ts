import { Howl } from 'howler';
import { useEffect, useState } from 'react';

export function useAudio() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const playSound = (src: string) => {
    if (reducedMotion) {
      return;
    }
    const sound = new Howl({ src, volume: 0.5 });
    sound.play();
  };

  return { playSound };
}