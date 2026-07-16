import { useState, useEffect, useRef, useCallback } from "react";

export type WakeWordPermissionState = "prompt" | "granted" | "denied";
export type WakeWordListeningState = "idle" | "passive_listening" | "active_listening";

interface UseWakeWordListenerProps {
  lang?: string;
  onWakeWordDetected?: () => void;
  onCommandDetected?: (command: string) => void;
  onStateChange?: (state: WakeWordListeningState) => void;
  onError?: (error: string) => void;
}

export function useWakeWordListener({
  lang = "de-DE",
  onWakeWordDetected,
  onCommandDetected,
  onStateChange,
  onError
}: UseWakeWordListenerProps) {
  const [permissionState, setPermissionState] = useState<WakeWordPermissionState>(() => {
    // Attempt to read from localStorage if previously allowed
    const saved = localStorage.getItem("udo_mic_permission");
    return (saved as WakeWordPermissionState) || "prompt";
  });

  const [listeningState, setListeningState] = useState<WakeWordListeningState>("idle");
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const listeningStateRef = useRef<WakeWordListeningState>("idle");
  const isEnabledRef = useRef<boolean>(false);
  const autoRestartTimeoutRef = useRef<any>(null);

  // Sync ref to prevent state-stale closures in callbacks
  useEffect(() => {
    listeningStateRef.current = listeningState;
    if (onStateChange) onStateChange(listeningState);
  }, [listeningState, onStateChange]);

  // Request Microphone Permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop stream immediately since we just wanted to confirm permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState("granted");
      localStorage.setItem("udo_mic_permission", "granted");
      return true;
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      setPermissionState("denied");
      localStorage.setItem("udo_mic_permission", "denied");
      if (onError) {
        onError("Zugriff verweigert");
      }
      return false;
    }
  }, [onError]);

  // Handle Speech Recognition Result
  const handleResult = useCallback((event: any) => {
    const resultsLength = event.results.length;
    const latestResult = event.results[resultsLength - 1];
    
    if (!latestResult.isFinal) return;
    
    const transcript = latestResult[0].transcript.trim();
    if (!transcript) return;

    console.log(`[UDO Voice] Transcript (${listeningStateRef.current}): "${transcript}"`);
    const lowercaseText = transcript.toLowerCase();

    if (listeningStateRef.current === "passive_listening") {
      // Check if text contains wake word "udo"
      if (lowercaseText.includes("udo") || lowercaseText.includes("u.d.o.")) {
        console.log("[UDO Voice] Wake word 'UDO' detected!");
        
        // Extract command if user said "UDO, [command]" in one breath
        const wakeWordIndex = lowercaseText.indexOf("udo");
        const afterWakeWord = transcript.slice(wakeWordIndex + 3).trim().replace(/^[,.-]+/g, "").trim();

        if (onWakeWordDetected) {
          onWakeWordDetected();
        }

        if (afterWakeWord && afterWakeWord.length > 1) {
          // Process command immediately
          console.log(`[UDO Voice] Extracted inline command: "${afterWakeWord}"`);
          if (onCommandDetected) {
            onCommandDetected(afterWakeWord);
          }
          // Resume passive listening
          setListeningState("passive_listening");
        } else {
          // Transition to active listening, wait for follow-up
          setListeningState("active_listening");
          
          // Set a fallback timer to return to passive if user is silent for 8 seconds
          setTimeout(() => {
            if (listeningStateRef.current === "active_listening") {
              console.log("[UDO Voice] Active listening timed out. Reverting to passive.");
              setListeningState("passive_listening");
            }
          }, 8000);
        }
      }
    } else if (listeningStateRef.current === "active_listening") {
      console.log(`[UDO Voice] Command caught: "${transcript}"`);
      if (onCommandDetected) {
        onCommandDetected(transcript);
      }
      // Revert back to passive wake-word mode after command processed
      setListeningState("passive_listening");
    }
  }, [onWakeWordDetected, onCommandDetected]);

  // Restart Recognition logic
  const restartRecognition = useCallback(() => {
    if (!isEnabledRef.current || permissionState !== "granted") return;

    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
    }

    autoRestartTimeoutRef.current = setTimeout(() => {
      try {
        if (recognitionRef.current && !isRecognitionActive) {
          recognitionRef.current.start();
          setIsRecognitionActive(true);
          console.log("[UDO Voice] Passive wake-word listening resumed.");
        }
      } catch (err) {
        // Recognition might already be running, catch silently
      }
    }, 400);
  }, [permissionState, isRecognitionActive]);

  // Start Voice Listener
  const startListening = useCallback(() => {
    if (permissionState !== "granted") {
      console.warn("[UDO Voice] Cannot start listener without permission granted.");
      return;
    }

    isEnabledRef.current = true;
    
    // Stop existing instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) {
        onError("Speech recognition not supported in this browser.");
      }
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = false;

    rec.onstart = () => {
      setIsRecognitionActive(true);
      if (listeningStateRef.current === "idle") {
        setListeningState("passive_listening");
      }
    };

    rec.onresult = handleResult;

    rec.onerror = (event: any) => {
      console.warn("[UDO Voice] Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setPermissionState("prompt");
        localStorage.removeItem("udo_mic_permission");
      }
      if (onError) {
        onError(event.error);
      }
    };

    rec.onend = () => {
      setIsRecognitionActive(false);
      // Continuous loop restart if enabled
      if (isEnabledRef.current) {
        restartRecognition();
      } else {
        setListeningState("idle");
      }
    };

    recognitionRef.current = rec;
    
    try {
      rec.start();
    } catch (e) {
      console.warn("[UDO Voice] Error starting recognition:", e);
    }
  }, [permissionState, lang, handleResult, restartRecognition, onError]);

  // Stop Listening Loop
  const stopListening = useCallback(() => {
    isEnabledRef.current = false;
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setListeningState("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isEnabledRef.current = false;
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return {
    permissionState,
    listeningState,
    requestPermission,
    startListening,
    stopListening,
    isSupported: typeof window !== "undefined" && (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition)
  };
}
