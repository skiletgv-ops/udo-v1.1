// Web Audio API & Accessibility Speech Feedback Service for UDO S2k System (Refactored to use VoiceService)
import { voiceService } from './voiceService';

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

  public playOpeningSound() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (ctx) {
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(this.volume * 0.8, now);
        masterGain.connect(ctx.destination);

        // Futuristic 4-note ascending boot chime (C4 -> G4 -> C5 -> E5)
        this.playTone(ctx, masterGain, 261.63, now, 0.15, 'sine');
        this.playTone(ctx, masterGain, 392.00, now + 0.08, 0.15, 'sine');
        this.playTone(ctx, masterGain, 523.25, now + 0.16, 0.20, 'triangle');
        this.playTone(ctx, masterGain, 659.25, now + 0.26, 0.35, 'sine');
      }
    } catch (err) {
      console.warn('Site opening sound warning:', err);
    }
  }

  private radioInterval: any = null;
  private isRadioActive: boolean = false;

  public toggleRadio(station: string, onFreqNote?: (msg: string) => void): boolean {
    if (this.isRadioActive) {
      this.stopRadio();
      return false;
    } else {
      this.startRadio(station, onFreqNote);
      return true;
    }
  }

  public startRadio(station: string, onFreqNote?: (msg: string) => void) {
    this.stopRadio();
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.isRadioActive = true;

    // Frequencies tailored for medical lounge relaxation (Hz)
    const freqs = station.includes('DGKN') || station.includes('EEG')
      ? [261.63, 329.63, 392.00, 523.25, 659.25] // C maj / Alpha 10Hz resonance
      : station.includes('GOÄ') || station.includes('Jazz')
      ? [220.00, 277.18, 329.63, 392.00, 440.00] // Smooth Jazz A minor 7
      : [293.66, 369.99, 440.00, 554.37, 659.25]; // Cyber Synth

    let step = 0;
    this.radioInterval = setInterval(() => {
      if (!this.isRadioActive) return;
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.25, now);
      masterGain.connect(ctx.destination);

      const f = freqs[step % freqs.length];
      this.playTone(ctx, masterGain, f, now, 0.35, 'sine');
      if (onFreqNote) {
        onFreqNote(`🎵 ${station} [${Math.round(f)} Hz]`);
      }
      step++;
    }, 400);
  }

  public stopRadio() {
    this.isRadioActive = false;
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
  }

  public playJokeChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx) {
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(this.volume * 0.7, now);
        masterGain.connect(ctx.destination);

        // Comedy / Doctor laughter synth chord (G4 -> B4 -> D5 -> G5)
        this.playTone(ctx, masterGain, 392.00, now, 0.1, 'triangle');
        this.playTone(ctx, masterGain, 493.88, now + 0.08, 0.1, 'triangle');
        this.playTone(ctx, masterGain, 587.33, now + 0.16, 0.12, 'sine');
        this.playTone(ctx, masterGain, 783.99, now + 0.24, 0.25, 'sine');
      }
    } catch (err) {
      console.warn('Joke chime warning:', err);
    }
  }

  public isRadioPlaying(): boolean {
    return this.isRadioActive;
  }

  public playCue(type: AudioCueType, title?: string, message?: string) {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (ctx) {
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
      }
    } catch (err) {
      console.warn('Audio feedback synthesis warning:', err);
    }

    if (this.speechEnabled && message) {
      voiceService.speakText(message, { isVoiceMuted: !this.speechEnabled });
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

export function playSiteOpeningSound() {
  audioService.playOpeningSound();
}

export function triggerAudioCue(type: AudioCueType, title?: string, message?: string) {
  audioService.playCue(type, title, message);
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent<AudioCueDetail>('udo-audio-cue', {
          detail: { type, title, message },
        })
      );
    }, 0);
  }
}
