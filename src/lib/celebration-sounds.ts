/**
 * Synthesized celebration sounds using Web Audio API.
 * No external files needed — generates pleasant melodies programmatically.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playNote(ctx: AudioContext, freq: number, start: number, duration: number, gain = 0.15, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

/** Birthday: cheerful ascending melody */
export function playBirthdaySound() {
  const ctx = getCtx();
  const notes = [523, 523, 587, 523, 698, 659, 523, 523, 587, 523, 784, 698];
  notes.forEach((freq, i) => playNote(ctx, freq, i * 0.25, 0.3, 0.12, "triangle"));
  // Add a sparkle layer
  [1047, 1175, 1319, 1397].forEach((f, i) => playNote(ctx, f, 1.5 + i * 0.15, 0.2, 0.06, "sine"));
}

/** Valentine: warm romantic chord progression */
export function playValentineSound() {
  const ctx = getCtx();
  // Warm chord: C-E-G arpeggiated
  const chords = [
    [261, 329, 392],
    [293, 349, 440],
    [329, 392, 494],
    [261, 329, 523],
  ];
  chords.forEach((chord, ci) => {
    chord.forEach((freq, ni) => {
      playNote(ctx, freq, ci * 0.8 + ni * 0.12, 0.9, 0.1, "sine");
    });
  });
  // Gentle high sparkle
  [784, 880, 1047].forEach((f, i) => playNote(ctx, f, 2.8 + i * 0.2, 0.4, 0.05, "sine"));
}

/** Confession: heartbeat + sweet ascending notes */
export function playConfessionSound() {
  const ctx = getCtx();
  // Heartbeat bass
  [80, 80].forEach((f, i) => playNote(ctx, f, i * 0.3, 0.15, 0.2, "sine"));
  // Sweet melody
  const melody = [392, 440, 494, 523, 587, 659, 784];
  melody.forEach((freq, i) => playNote(ctx, freq, 0.6 + i * 0.2, 0.35, 0.1, "triangle"));
  // Shimmer
  [1047, 1319, 1568].forEach((f, i) => playNote(ctx, f, 2.2 + i * 0.15, 0.3, 0.04, "sine"));
}

/** Anniversary: elegant golden chimes */
export function playAnniversarySound() {
  const ctx = getCtx();
  // Bell-like chimes
  const chimes = [523, 659, 784, 1047, 784, 659, 523, 659, 784, 1047, 1319];
  chimes.forEach((freq, i) => {
    playNote(ctx, freq, i * 0.3, 0.5, 0.08, "sine");
    playNote(ctx, freq * 2, i * 0.3, 0.25, 0.03, "sine"); // overtone
  });
  // Final chord
  [523, 659, 784, 1047].forEach((f) => playNote(ctx, f, 3.3, 1.2, 0.06, "sine"));
}
