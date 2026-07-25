import React from "react";
import { useConsultation } from "../context/ConsultationContext";
import { VoicePoweredOrb } from "./ui/voice-powered-orb";

interface Props {
  language?: "de" | "en";
}

export default function ConsultationOrbControl({ language = "de" }: Props) {
  const { orbState, isRecording } = useConsultation();

  // Orb Hue depending on active state
  const getOrbHue = () => {
    switch (orbState) {
      case "listening": return 340; // Vibrant Rose/Red
      case "thinking": return 45;   // Bright Amber/Gold
      case "speaking": return 175;  // Glowing Teal/Cyan
      case "success": return 145;   // Emerald Green
      case "error": return 0;       // Pure Crimson Red
      default: return 185;          // Deep Teal
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto pointer-events-none">
      {/* Pure Visual Ambient Orb Container - Zero Text, Zero Buttons */}
      <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] flex items-center justify-center">
        
        {/* WebGL Canvas Orb */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
          <VoicePoweredOrb
            hue={getOrbHue()}
            enableVoiceControl={isRecording}
            glowIntensity={isRecording ? 2.8 : orbState === "speaking" ? 2.2 : 1.2}
            className="w-full h-full scale-110"
          />
        </div>

        {/* Outer Pulsing Rings - Pure Visual State Signatures */}
        <div className={`absolute inset-0 rounded-full border ${
          isRecording ? "border-rose-500/40 animate-ping" : 
          orbState === "speaking" ? "border-teal-400/40 animate-pulse" :
          "border-teal-500/20 animate-[pulse_4s_infinite]"
        } pointer-events-none z-10`} />
        
        <div className={`absolute inset-8 rounded-full border ${
          isRecording ? "border-rose-400/30" : 
          orbState === "speaking" ? "border-teal-300/30" :
          "border-teal-400/15"
        } pointer-events-none z-10`} />

      </div>
    </div>
  );
}
