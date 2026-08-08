// Shared UDO Humanoid Voice Synthesizer (JONAS Voice Engine)
// Provides natural male speech synthesis for offline & online modes with markdown cleanup

export interface SpeakOptions {
  lang?: 'de' | 'en' | 'de-DE' | 'en-US';
  pitch?: number;
  rate?: number;
  selectedVoiceURI?: string | null;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Strips markdown markup, hashtags, URLs, and excessive symbols so TTS speaks cleanly.
 */
export function cleanTextForVoice(text: string): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, 'Codeblock ausgelassen') // replace code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/^#{1,6}\s+/gm, '') // headers
    .replace(/[*#_~`\[\]\(\)]/g, '') // bold, italics, links
    .replace(/https?:\/\/\S+/g, '') // URLs
    .replace(/\n+/g, '. ') // newlines as pause dots
    .trim();
}

/**
 * Finds the best available natural humanoid voice (Prioritizes JONAS first).
 */
export function findJonasHumanoidVoice(lang: 'de' | 'en' = 'de', voiceURI?: string | null): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return undefined;

  // If user explicitly picked a voice URI (and it's not default)
  if (voiceURI && voiceURI !== 'JONAS_MAIN' && voiceURI !== 'DEFAULT') {
    const custom = voices.find(v => v.voiceURI === voiceURI);
    if (custom) return custom;
  }

  const targetLangPrefix = lang === 'de' ? 'de' : 'en';
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetLangPrefix));

  const femaleRegex = /katja|marlene|zira|hedda|eva|vicki|anna|petra|hazel|samantha|victoria|female/i;

  if (lang === 'de') {
    return (
      // 1. Jonas voice
      langVoices.find(v => /jonas/i.test(v.name)) ||
      voices.find(v => /jonas/i.test(v.name)) ||
      // 2. Natural male voices
      langVoices.find(v => !femaleRegex.test(v.name) && /conrad|killian|stefan|daniel|markus|male|natural|neural|guy/i.test(v.name)) ||
      // 3. Any non-female voice
      langVoices.find(v => !femaleRegex.test(v.name)) ||
      langVoices[0] ||
      voices[0]
    );
  } else {
    return (
      langVoices.find(v => !femaleRegex.test(v.name) && /guy|christopher|ryan|eric|david|george|jonas|neural|natural|male/i.test(v.name)) ||
      langVoices.find(v => !femaleRegex.test(v.name)) ||
      langVoices[0] ||
      voices[0]
    );
  }
}

/**
 * Speaks text using the high-fidelity JONAS Humanoid Voice Engine.
 */
export function speakWithJonasVoice(text: string, options: SpeakOptions = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options.onEnd) options.onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleaned = cleanTextForVoice(text);
  if (!cleaned) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleaned);
  const lang = (options.lang || 'de').toString().startsWith('de') ? 'de' : 'en';
  utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';

  const chosenVoice = findJonasHumanoidVoice(lang, options.selectedVoiceURI);
  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }

  // Humanoid vocal characteristics
  utterance.pitch = options.pitch ?? 0.95; // Warm male pitch
  utterance.rate = options.rate ?? 0.96;   // Natural, deliberate speech rate
  utterance.volume = 1.0;

  if (options.onStart) {
    utterance.onstart = options.onStart;
  }

  utterance.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  utterance.onerror = (err) => {
    console.warn('[JONAS VOICE] Speech synthesis error:', err);
    if (options.onError) options.onError(err);
    if (options.onEnd) options.onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Immediately stops any ongoing Jonas speech synthesis.
 */
export function stopJonasVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
