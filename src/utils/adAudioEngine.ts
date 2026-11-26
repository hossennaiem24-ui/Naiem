import type { AdSceneKey } from '../types/portfolio';

class AdAudioEngine {
  private ctx: AudioContext | null = null;
  private intervalId: number | null = null;
  private step = 0;
  private isMuted = true;
  private isPlaying = false;
  private sceneKey: AdSceneKey = 'business-skyline';

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public start(sceneKey: AdSceneKey, muted: boolean): void {
    this.sceneKey = sceneKey;
    this.isMuted = muted;
    this.isPlaying = true;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const bpm = sceneKey === 'car-action' || sceneKey === 'social-streetwear' ? 128 : 112;
    const stepMs = (60 / bpm / 2) * 1000;

    this.triggerStep();
    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || this.isMuted) return;
      this.triggerStep();
    }, stepMs);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      if (this.intervalId !== null) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    } else if (this.isPlaying) {
      this.start(this.sceneKey, false);
    }
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private triggerStep(): void {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const s = this.step % 16;

    // Subtle punchy kick on beats 0, 4, 8, 12
    if (s % 4 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    }

    // Crisp hi-hat tick on off-beats
    if (s % 2 === 1) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(4200, now);
      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    // Melodic synth arp per scene mood
    const scaleMap: Record<AdSceneKey, number[]> = {
      'business-skyline': [261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66, 392.0],
      'car-action': [146.83, 146.83, 220.0, 174.61, 146.83, 261.63, 220.0, 196.0],
      'travel-aviation': [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 440.0],
      'lifestyle-alpine': [220.0, 277.18, 329.63, 440.0, 329.63, 277.18, 246.94, 329.63],
      'ai-neural': [311.13, 392.0, 466.16, 622.25, 466.16, 392.0, 349.23, 523.25],
      'social-streetwear': [196.0, 233.08, 293.66, 392.0, 293.66, 233.08, 261.63, 349.23],
      showreel: [261.63, 311.13, 392.0, 523.25, 392.0, 311.13, 293.66, 466.16],
      custom: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 392.0],
    };

    const notes = scaleMap[this.sceneKey] ?? scaleMap['business-skyline'];
    if (s % 2 === 0) {
      const noteFreq = notes[(s / 2) % notes.length];
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = this.sceneKey === 'car-action' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    }

    this.step += 1;
  }
}

export const adAudioEngine = new AdAudioEngine();
