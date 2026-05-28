/**
 * Sound effect hooks — integrates sounds with SoundContext.
 * Respects prefers-reduced-motion via SoundProvider guard.
 */
import { useCallback } from 'react';
import { useSoundContext } from '@games/sound-context';
import { playBet, playBlackjack, playDeal, playDealerHit, playDoubleDown, playHit, playLose, playPush, playSplit, playStand, playWin, } from '../../infrastructure/audio';
export function useSoundEffects() {
    const { playSound } = useSoundContext();
    return {
        onBet: useCallback(() => playSound(playBet), [playSound]),
        onDeal: useCallback(() => playSound(playDeal), [playSound]),
        onHit: useCallback(() => playSound(playHit), [playSound]),
        onStand: useCallback(() => playSound(playStand), [playSound]),
        onDoubleDown: useCallback(() => playSound(playDoubleDown), [playSound]),
        onSplit: useCallback(() => playSound(playSplit), [playSound]),
        onBlackjack: useCallback(() => playSound(playBlackjack), [playSound]),
        onWin: useCallback(() => playSound(playWin), [playSound]),
        onLose: useCallback(() => playSound(playLose), [playSound]),
        onPush: useCallback(() => playSound(playPush), [playSound]),
        onDealerHit: useCallback(() => playSound(playDealerHit), [playSound]),
    };
}
