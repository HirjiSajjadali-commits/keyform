import type { SwitchId } from '../store/options';

let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function blip(freq: number, duration: number, peakGain: number, type: OscillatorType, delay = 0) {
  const audioCtx = getContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = audioCtx.currentTime + delay;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peakGain, t0 + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.01);
}

/** Tiny synthesised WebAudio blips standing in for real switch-click samples — no audio
 * assets needed, and each switch type gets an audibly distinct character. */
export function playSwitchSound(switchType: SwitchId, phase: 'down' | 'up') {
  switch (switchType) {
    case 'linear':
      if (phase === 'down') blip(700, 0.03, 0.05, 'sine');
      break;
    case 'tactile':
      if (phase === 'down') {
        blip(480, 0.025, 0.05, 'triangle');
        blip(900, 0.02, 0.035, 'triangle', 0.01);
      }
      break;
    case 'clicky':
      if (phase === 'down') blip(1900, 0.02, 0.07, 'square');
      if (phase === 'up') blip(1400, 0.015, 0.045, 'square');
      break;
  }
}
