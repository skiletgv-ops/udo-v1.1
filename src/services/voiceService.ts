// Voice Service: ElevenLabs TTS + Web Speech API fallback + First session spoken welcome greeting

import { cleanTextForSpeech } from "../lib/utils";

export interface VoiceConfig {
  elevenlabsKey?: string;
  elevenlabsVoiceId?: string; // Default Claude Mellow Male Voice
  autoWelcomePlayed?: boolean;
}

class VoiceService {
  private hasPlayedWelcomeThisSession: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.hasPlayedWelcomeThisSession = sessionStorage.getItem("udo_welcome_played") === "true";
    }
  }

  public isWelcomePlayed(): boolean {
    return this.hasPlayedWelcomeThisSession;
  }

  public async playWelcomeGreetingIfNeeded(onStart?: () => void, onEnd?: () => void): Promise<boolean> {
    if (this.hasPlayedWelcomeThisSession) return false;

    const welcomeText = "Willkommen im UDO Konsultations-System der Praxis Dr. Bongartz. Ich begleite Sie heute als Ihr klinischer KI-Assistent. Wie kann ich Ihnen bei der Befundanalyse oder Gutachtenerstellung helfen?";

    this.hasPlayedWelcomeThisSession = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("udo_welcome_played", "true");
    }

    await this.speakText(welcomeText, onStart, onEnd);
    return true;
  }

  public async speakText(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
      if (onEnd) onEnd();
      return;
    }

    // Stop any currently playing audio
    this.stopAudio();

    if (onStart) onStart();

    try {
      // Trigger Hybrid TTS via backend /api/tts
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanedText })
      });

      const engineUsed = response.headers.get("X-TTS-Engine-Used") || "Hybrid TTS Backend";
      const charCount = response.headers.get("X-TTS-Char-Count") || cleanedText.length.toString();

      if (response.ok && response.headers.get("Content-Type")?.includes("audio")) {
        console.log(`[HYBRID TTS CLIENT] Speech starting | Engine: ${engineUsed} | Text Length: ${charCount} chars`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        this.currentAudio = audio;

        audio.onended = () => {
          if (onEnd) onEnd();
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          this.fallbackWebSpeech(cleanedText, onEnd);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs TTS unavailable, falling back to Web Speech API:", err);
    }

    // Fallback to Web Speech API
    this.fallbackWebSpeech(cleanedText, onEnd);
  }

  private fallbackWebSpeech(text: string, onEnd?: () => void): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.98; // Calm, natural delivery
    utterance.pitch = 1.0; // Natural warm tone

    // Pick best available German/English MALE voice (excluding female voice names)
    const voices = window.speechSynthesis.getVoices();
    const femaleNames = ["marlene", "vicki", "anna", "petra", "hedda", "zira", "hazel", "samantha", "victoria", "katja", "gundula"];
    
    const maleDeVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      const isFemale = femaleNames.some(f => name.includes(f));
      if (isFemale) return false;
      return v.lang.startsWith("de") && (name.includes("stefan") || name.includes("markus") || name.includes("daniel") || name.includes("male") || name.includes("george") || name.includes("david") || name.includes("google deutsch"));
    }) || voices.find(v => {
      const name = v.name.toLowerCase();
      return v.lang.startsWith("de") && !femaleNames.some(f => name.includes(f));
    }) || voices.find(v => v.lang.startsWith("de"));

    if (maleDeVoice) utterance.voice = maleDeVoice;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();

