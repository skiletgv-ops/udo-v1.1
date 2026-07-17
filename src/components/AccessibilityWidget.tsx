import React, { useState } from "react";
import { useGlobalSystem } from "./GlobalSystemContext";
import { 
  Glasses, 
  Minus, 
  Plus, 
  Volume2, 
  VolumeX, 
  Radio, 
  X, 
  RotateCcw,
  Sparkles,
  Check,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AccessibilityWidget() {
  const {
    fontScale,
    setFontScale,
    colorblindMode,
    setColorblindMode,
    audioEnabled,
    setAudioEnabled,
    radioKolnActive,
    setRadioKolnActive,
    language
  } = useGlobalSystem();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "acoustic">("visual");

  const handleReset = () => {
    setFontScale(1.0);
    setColorblindMode("normal");
    setAudioEnabled(false);
    setRadioKolnActive(false);
  };

  const handleFontIncrease = () => {
    setFontScale(Math.min(1.5, Number((fontScale + 0.1).toFixed(1))));
  };

  const handleFontDecrease = () => {
    setFontScale(Math.max(0.8, Number((fontScale - 0.1).toFixed(1))));
  };

  return (
    <>
      {/* SVG GPU COLORBLINDNESS FILTER DEFINITIONS (Hidden) */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.290, 0.617, 0.093, 0, 0
                                                 0.290, 0.617, 0.093, 0, 0
                                                 -0.02, 0.280, 0.740, 0, 0
                                                 0,     0,     0,     1, 0" />
          </filter>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.200, 0.800, 0.000, 0, 0
                                                 0.200, 0.800, 0.000, 0, 0
                                                 -0.01, 0.230, 0.780, 0, 0
                                                 0,     0,     0,     1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.970, 0.110, -0.08, 0, 0
                                                 0.020, 0.820, 0.160, 0, 0
                                                 0.020, 0.820, 0.160, 0, 0
                                                 0,     0,     0,     1, 0" />
          </filter>
          <filter id="monochrome-filter">
            <feColorMatrix type="matrix" values="0.333, 0.333, 0.333, 0, 0
                                                 0.333, 0.333, 0.333, 0, 0
                                                 0.333, 0.333, 0.333, 0, 0
                                                 0,     0,     0,     1, 0" />
          </filter>
        </defs>
      </svg>

      {/* FLOATING GLASSES TRIGGER BUTTON */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-xl border ${
            isOpen 
              ? "bg-teal-500 text-slate-950 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]" 
              : "bg-slate-900/90 hover:bg-slate-950 text-white border-white/10 hover:border-teal-500/40"
          } hover:scale-105 active:scale-95 cursor-pointer`}
          title={language === "en" ? "Accessibility & Synthesizer" : "Barrierefreiheit & Synthesizer"}
        >
          <Glasses size={20} className={isOpen ? "animate-pulse" : ""} />
        </button>

        {/* ACCESSIBILITY BOARD PANEL */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="absolute bottom-16 left-0 w-80 sm:w-96 bg-slate-950/95 border border-white/15 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 backdrop-blur-3xl text-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Glasses size={18} className="text-teal-400 animate-pulse" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-extrabold">
                    {language === "en" ? "System Optimizer" : "System-Optimierung"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer text-[10px] font-mono flex items-center gap-1 uppercase"
                    title={language === "en" ? "Reset Settings" : "Zurücksetzen"}
                  >
                    <RotateCcw size={10} />
                    <span>{language === "en" ? "Reset" : "Reset"}</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-xl border border-white/5 mb-4 shrink-0">
                <button
                  onClick={() => setActiveTab("visual")}
                  className={`py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                    activeTab === "visual"
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🕶️ {language === "en" ? "Visual (Glasses)" : "Visuell (Brille)"}
                </button>
                <button
                  onClick={() => setActiveTab("acoustic")}
                  className={`py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                    activeTab === "acoustic"
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🔊 {language === "en" ? "Acoustic (Synth)" : "Akustik (Synth)"}
                </button>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "visual" && (
                  <div className="space-y-4">
                    {/* Font size adjusting panel */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">
                          🔎 {language === "en" ? "Font Scale Adjustment" : "Schriftgrößen-Anpassung"}
                        </span>
                        <span className="text-xs font-mono text-teal-400 font-bold">
                          {Math.round(fontScale * 100)}%
                        </span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center gap-3">
                        <button
                          onClick={handleFontDecrease}
                          disabled={fontScale <= 0.8}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-teal-400 transition-all duration-200"
                            style={{ width: `${((fontScale - 0.8) / 0.7) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={handleFontIncrease}
                          disabled={fontScale >= 1.5}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">
                        {language === "en" ? "Scales all health reports & UI elements proportionally" : "Skaliert alle Texte & UI-Elemente proportional"}
                      </p>
                    </div>

                    {/* Colorblind / Contrast presets */}
                    <div>
                      <span className="text-xs font-bold text-slate-300 block mb-2">
                        🎨 {language === "en" ? "Contrast & Colorblind Presets" : "Kontrast & Farbenblindheits-Modi"}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "normal", label: language === "en" ? "Default UI" : "Standard" },
                          { id: "deuteranopia", label: language === "en" ? "Red-Green Mode" : "Rot-Grün Schwäche" },
                          { id: "tritanopia", label: language === "en" ? "Blue-Yellow Mode" : "Blau-Gelb Schwäche" },
                          { id: "monochrome", label: language === "en" ? "High Contrast" : "Monochrom" },
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => setColorblindMode(mode.id as any)}
                            className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition-all cursor-pointer flex justify-between items-center ${
                              colorblindMode === mode.id
                                ? "bg-teal-500/10 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
                                : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                            }`}
                          >
                            <span>{mode.label}</span>
                            {colorblindMode === mode.id && <Check size={12} className="text-teal-400 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "acoustic" && (
                  <div className="space-y-4">
                    {/* Ambient space drone */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {audioEnabled ? (
                            <Volume2 size={16} className="text-teal-400 animate-bounce" />
                          ) : (
                            <VolumeX size={16} className="text-slate-500" />
                          )}
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {language === "en" ? "Futuristic Ambient Loop" : "Futuristischer Hintergrund-Sound"}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">
                              {language === "en" ? "Sweeping synthetic wave" : "Modulierender Synthesizer-Fluss"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setAudioEnabled(!audioEnabled)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                            audioEnabled
                              ? "bg-rose-500 hover:bg-rose-600 text-white"
                              : "bg-teal-500 hover:bg-teal-600 text-slate-950"
                          }`}
                        >
                          {audioEnabled ? (language === "en" ? "OFF" : "AUS") : (language === "en" ? "ON" : "AN")}
                        </button>
                      </div>

                      {audioEnabled && (
                        <div className="flex items-center gap-1 h-6 justify-center bg-black/30 rounded-lg p-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                            <div
                              key={bar}
                              className="w-1 bg-teal-400/80 rounded-full"
                              style={{
                                height: `${Math.sin(bar * 0.4) * 50 + 50}%`,
                                animation: "bounce 0.8s ease-in-out infinite alternate",
                                animationDelay: `${bar * 0.08}s`
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Radio Köln sequencing station */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Radio size={16} className={radioKolnActive ? "text-teal-400 animate-pulse" : "text-slate-500"} />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              📡 {language === "en" ? "+ Radio Köln Station" : "+ Radio Köln Funk"}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">
                              {language === "en" ? "Electro-beat broadcast" : "Rhythmischer Elektro-Takt"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setRadioKolnActive(!radioKolnActive);
                            if (!audioEnabled) {
                              setAudioEnabled(true); // Auto-enable master audio
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                            radioKolnActive
                              ? "bg-rose-500 hover:bg-rose-600 text-white"
                              : "bg-teal-500 hover:bg-teal-600 text-slate-950"
                          }`}
                        >
                          {radioKolnActive ? (language === "en" ? "OFF" : "AUS") : (language === "en" ? "ON" : "AN")}
                        </button>
                      </div>

                      {radioKolnActive && (
                        <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-2.5 text-center">
                          <span className="text-[10px] font-mono text-teal-400 font-black tracking-widest uppercase animate-pulse">
                            📻 LIVE: RADIO KÖLN RETRO ELECTRONIC SYNTH
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
