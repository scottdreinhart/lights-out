/**
 * Web Audio API Sound Synthesis for Blackjack
 * SFX generated programmatically — no external audio files
 */
let audioCtx = null;
function getCtx() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    return audioCtx;
}
function playTone(freq, duration, type = 'sine', gain = 0.3) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}
// Betting action - bright, positive tone
export function playBet() {
    playTone(659, 0.1, 'sine', 0.2);
}
// Card deal sound - quick descending tone
export function playDeal() {
    playTone(523, 0.08, 'sine', 0.15);
    setTimeout(() => playTone(440, 0.08, 'sine', 0.15), 50);
}
// Hit action - single ascending tone
export function playHit() {
    playTone(784, 0.1, 'triangle', 0.2);
}
// Stand action - lower tone
export function playStand() {
    playTone(440, 0.15, 'sine', 0.2);
}
// Double down - two quick tones
export function playDoubleDown() {
    playTone(659, 0.08, 'square', 0.2);
    setTimeout(() => playTone(659, 0.08, 'square', 0.2), 100);
}
// Split hand - chord-like sound
export function playSplit() {
    playTone(523, 0.1, 'sine', 0.15);
    playTone(659, 0.1, 'sine', 0.15);
}
// Blackjack - winner fanfare
export function playBlackjack() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 100);
    });
}
// Win - ascending arpeggio
export function playWin() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.12, 'sine', 0.18), i * 80);
    });
}
// Lose - descending tones
export function playLose() {
    playTone(440, 0.2, 'sine', 0.2);
    setTimeout(() => playTone(330, 0.2, 'sine', 0.2), 150);
    setTimeout(() => playTone(262, 0.3, 'sine', 0.15), 300);
}
// Push (tie) - middle ground sound
export function playPush() {
    playTone(587, 0.2, 'triangle', 0.18);
}
// Dealer hit - quick tone
export function playDealerHit() {
    playTone(659, 0.08, 'sine', 0.15);
}
