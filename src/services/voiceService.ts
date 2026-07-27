// Voice Service: ElevenLabs TTS + Web Speech API fallback + First session spoken welcome greeting

export interface VoiceConfig {
  elevenlabsKey?: string;
  elevenlabsVoiceId?: string; // Default warm professional German voice
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
    // Stop any currently playing audio
    this.stopAudio();

    if (onStart) onStart();

    try {
      // Try ElevenLabs TTS via backend /api/tts
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId: "21m00Tcm4TlvDq8ikWAM" // Default warm human voice
        })
      });

      if (response.ok && response.headers.get("Content-Type")?.includes("audio")) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        this.currentAudio = audio;

        audio.onended = () => {
          if (onEnd) onEnd();
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          this.fallbackWebSpeech(text, onEnd);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs TTS unavailable, falling back to Web Speech API:", err);
    }

    // Fallback to Web Speech API
    this.fallbackWebSpeech(text, onEnd);
  }

  private fallbackWebSpeech(text: string, onEnd?: () => void): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.95; // Slightly slower, calm delivery
    utterance.pitch = 1.0;

    // Pick best available German voice
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith("de") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Marlene") || v.name.includes("Stefan") || v.name.includes("Vicki"))) ||
                    voices.find(v => v.lang.startsWith("de"));
    if (deVoice) utterance.voice = deVoice;

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
