let ctx: AudioContext | null = null;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(freq: number, duration: number, gain = 0.05, slide?: number) {
  const c = ac();
  if (!c) return;
  void c.resume();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, c.currentTime + duration);
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  tap: (on: boolean) => on && tone(420, 0.07, 0.035),
  pickup: (on: boolean) => on && tone(360, 0.09, 0.04, 460),
  snap: (on: boolean) => on && tone(520, 0.12, 0.06, 680),
  miss: (on: boolean) => on && tone(220, 0.06, 0.02),
  done: (on: boolean) => {
    if (!on) return;
    tone(440, 0.14, 0.05, 660);
    setTimeout(() => tone(660, 0.16, 0.04), 90);
  },
  cheer: (on: boolean) => {
    if (!on) return;
    tone(523, 0.12, 0.05, 659);
    setTimeout(() => tone(659, 0.12, 0.045, 784), 110);
    setTimeout(() => tone(784, 0.2, 0.04, 1046), 220);
  },
  hint: (on: boolean) => on && tone(392, 0.16, 0.03, 349),
};
