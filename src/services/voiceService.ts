// Voice Service Abstraction: Gemini TTS, ElevenLabs, Web Speech API Fallback, STT, and Interruption (Barge-in)
import { cleanTextForSpeech } from '../lib/utils';
import { loggerService } from './loggerService';

export type VoiceProvider = 'gemini' | 'elevenlabs' | 'web-speech';
export type VoiceLanguage = 'de-DE' | 'en-US';

export interface VoiceOptions {
  speechRate?: number;
  isVoiceMuted?: boolean;
  lang?: VoiceLanguage;
  provider?: VoiceProvider;
  onStart?: () => void;
  onEnd?: () => void;
  onChunk?: (chunkIndex: number) => void;
}

export interface SttCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
}

class VoiceService {
  private static instance: VoiceService;
  private currentAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private activeAbortController: AbortController | null = null;
  private currentProvider: VoiceProvider = 'gemini';
  private currentLanguage: VoiceLanguage = 'de-DE';
  private isListeningSTT: boolean = false;
  private speechRecognition: any = null;
  private hasPlayedWelcomeThisSession: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.hasPlayedWelcomeThisSession = sessionStorage.getItem('udo_welcome_played') === 'true';
    }
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public getAbortController(): AbortController {
    if (!this.activeAbortController) {
      this.activeAbortController = new AbortController();
    }
    return this.activeAbortController;
  }

  public getAbortSignal(): AbortSignal {
    return this.getAbortController().signal;
  }

  public setProvider(provider: VoiceProvider): void {
    this.currentProvider = provider;
    loggerService.info(`[VOICE SERVICE] Provider switched to: ${provider}`);
  }

  public getProvider(): VoiceProvider {
    return this.currentProvider;
  }

  public setLanguage(lang: VoiceLanguage): void {
    this.currentLanguage = lang;
    loggerService.info(`[VOICE SERVICE] Language set to: ${lang}`);
  }

  public getLanguage(): VoiceLanguage {
    return this.currentLanguage;
  }

  public isWelcomePlayed(): boolean {
    return this.hasPlayedWelcomeThisSession;
  }

  public async playWelcomeGreetingIfNeeded(onStart?: () => void, onEnd?: () => void): Promise<boolean> {
    if (this.hasPlayedWelcomeThisSession) return false;

    const welcomeText =
      this.currentLanguage === 'en-US'
        ? 'Welcome to the UDO Consultation System. I am your AI clinical assistant. How can I assist you with document analysis today?'
        : 'Willkommen im UDO Konsultations-System der Praxis Dr. Bongartz. Ich begleite Sie heute als Ihr klinischer KI-Assistent. Wie kann ich Ihnen bei der Befundanalyse oder Gutachtenerstellung helfen?';

    this.hasPlayedWelcomeThisSession = true;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('udo_welcome_played', 'true');
    }

    await this.speakText(welcomeText, { onStart, onEnd });
    return true;
  }

  /**
   * Barge-in & Interruption: Immediately stops audio playback and aborts pending requests.
   */
  public interrupt(): void {
    loggerService.info('[VOICE SERVICE] Interruption (Barge-in) triggered', {
      ttsEvents: { event: 'interrupted', provider: this.currentProvider },
    });

    // Abort active fetch requests
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = new AbortController();
    }

    // Stop HTML Audio Element
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // Close / Suspend Web Audio Context if active
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.suspend();
      } catch (e) {
        // ignore
      }
    }

    // Cancel Web Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Stop STT listening
    this.stopSTT();
  }

  /**
   * Primary Speech Synthesis method.
   */
  public async speakText(text: string, options: VoiceOptions = {}): Promise<void> {
    const speechRate = options.speechRate ?? 1.0;
    const isVoiceMuted = options.isVoiceMuted ?? false;
    const lang = options.lang || this.currentLanguage;
    const provider = options.provider || this.currentProvider;

    if (isVoiceMuted) {
      loggerService.info('[VOICE SERVICE] Voice is muted, skipping speech playback');
      if (options.onEnd) options.onEnd();
      return;
    }

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Interrupt any playing speech before starting new speech
    this.interrupt();

    const signal = this.getAbortSignal();

    loggerService.info(`[VOICE SERVICE] Starting TTS speech synthesis`, {
      ttsEvents: { event: 'start', provider, charCount: cleanedText.length },
    });

    if (options.onStart) options.onStart();

    // 1. Try Gemini streaming TTS or Backend Hybrid TTS
    if (provider === 'gemini' || provider === 'elevenlabs') {
      try {
        const response = await fetch('/api/voice-chat/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanedText, lang }),
          signal,
        });

        if (response.ok && response.headers.get('Content-Type')?.includes('audio')) {
          const blob = await response.blob();
          if (signal.aborted) return;

          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          this.currentAudio = audio;
          audio.playbackRate = speechRate;

          audio.onended = () => {
            loggerService.info('[VOICE SERVICE] Audio playback ended', {
              ttsEvents: { event: 'end', provider },
            });
            if (options.onEnd) options.onEnd();
            URL.revokeObjectURL(url);
          };

          audio.onerror = (err) => {
            loggerService.warn('[VOICE SERVICE] Audio element error, falling back to WebSpeech', { error: { message: String(err) } });
            this.fallbackWebSpeech(cleanedText, lang, speechRate, options.onEnd);
          };

          await audio.play();
          return;
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          loggerService.info('[VOICE SERVICE] Speech synthesis aborted by user (Barge-in)');
          return;
        }
        loggerService.warn('[VOICE SERVICE] Backend TTS failed, falling back to browser Web Speech API:', { error: { message: String(err) } });
      }
    }

    // 2. Fallback to Web Speech API
    this.fallbackWebSpeech(cleanedText, lang, speechRate, options.onEnd);
  }

  private fallbackWebSpeech(text: string, lang: VoiceLanguage, rate: number, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

    utterance.onend = () => {
      loggerService.info('[VOICE SERVICE] WebSpeech playback completed', {
        ttsEvents: { event: 'end', provider: 'web-speech' },
      });
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      loggerService.warn('[VOICE SERVICE] WebSpeech playback error:', { error: { message: String(err) } });
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Speech-to-Text (STT) Abstraction using Web Speech API
   */
  public startSTT(callbacks: SttCallbacks, lang: VoiceLanguage = this.currentLanguage): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      loggerService.warn('[VOICE SERVICE] Web SpeechRecognition API is not supported in this browser.');
      if (callbacks.onError) callbacks.onError('SpeechRecognition not supported');
      return;
    }

    this.stopSTT();

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.lang = lang;

    this.speechRecognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript, true);
      } else if (interimTranscript) {
        callbacks.onResult(interimTranscript, false);
      }
    };

    this.speechRecognition.onerror = (event: any) => {
      loggerService.warn('[VOICE SERVICE] STT Error:', { error: { message: event.error } });
      if (callbacks.onError) callbacks.onError(event.error);
    };

    this.speechRecognition.onend = () => {
      this.isListeningSTT = false;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    this.speechRecognition.start();
    this.isListeningSTT = true;
    loggerService.info(`[VOICE SERVICE] STT listening started (${lang})`);
  }

  public stopSTT(): void {
    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {
        // ignore
      }
      this.speechRecognition = null;
    }
    this.isListeningSTT = false;
  }

  public isListening(): boolean {
    return this.isListeningSTT;
  }

  public stopAudio(): void {
    this.interrupt();
  }
}

export const voiceService = VoiceService.getInstance();
