// Web Audio API & Accessibility Speech Feedback Service for UDO S2k System

export type AudioCueType = 'scan-complete' | 'audit-complete' | 'approval-complete' | 'alert';

export interface AudioCueDetail {
  type: AudioCueType;
  title?: string;
  message?: string;
  speakMessage?: boolean;
}

class AudioFeedbackService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    // Lazy init audio context on demand
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public playCue(type: AudioCueType, title?: string, message?: string) {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(ctx.destination);

      if (type === 'scan-complete') {
        // AI Scan completion chime (2-tone ascending sine)
        this.playTone(ctx, masterGain, 440, now, 0.18, 'sine'); // A4
        this.playTone(ctx, masterGain, 659.25, now + 0.12, 0.25, 'sine'); // E5
      } else if (type === 'audit-complete') {
        // Document audit completion chime (3-tone harmonic chord)
        this.playTone(ctx, masterGain, 523.25, now, 0.15, 'sine'); // C5
        this.playTone(ctx, masterGain, 659.25, now + 0.10, 0.15, 'sine'); // E5
        this.playTone(ctx, masterGain, 783.99, now + 0.20, 0.30, 'sine'); // G5
      } else if (type === 'approval-complete') {
        // Approval signed chime (crisp double ping)
        this.playTone(ctx, masterGain, 587.33, now, 0.12, 'triangle'); // D5
        this.playTone(ctx, masterGain, 880, now + 0.1, 0.25, 'triangle'); // A5
      } else if (type === 'alert') {
        // Gentle warning cue
        this.playTone(ctx, masterGain, 349.23, now, 0.15, 'sine'); // F4
        this.playTone(ctx, masterGain, 311.13, now + 0.12, 0.25, 'sine'); // Eb4
      }
    } catch (err) {
      console.warn('Audio feedback synthesis warning:', err);
    }

    if (this.speechEnabled && message && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'de-DE';
        utterance.rate = 1.05;
        utterance.volume = this.volume * 0.9;
        window.speechSynthesis.speak(utterance);
      } catch (speechErr) {
        // Fallback gracefully
      }
    }
  }

  private playTone(
    ctx: AudioContext,
    destination: GainNode,
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine'
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.4, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const audioService = new AudioFeedbackService();

export function triggerAudioCue(type: AudioCueType, title?: string, message?: string) {
  audioService.playCue(type, title, message);
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent<AudioCueDetail>('udo-audio-cue', {
          detail: { type, title, message }
        })
      );
    }, 0);
  }
}
