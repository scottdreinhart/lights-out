import { Howl } from 'howler';
import { useEffect, useState } from 'react';

export function useMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [music, setMusic] = useState<Howl | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const playMusic = (src: string, volume = 0.5) => {
    if (reducedMotion) {
      return;
    }
    const newMusic = new Howl({ src, volume, loop: true });
    newMusic.play();
    setMusic(newMusic);
    setIsPlaying(true);
  };

  const stopMusic = () => {
    if (music) {
      music.stop();
      setMusic(null);
      setIsPlaying(false);
    }
  };

  return { playMusic, stopMusic, isPlaying };
}