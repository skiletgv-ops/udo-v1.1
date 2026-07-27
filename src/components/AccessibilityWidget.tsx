import React, { useState, useRef, useEffect } from "react";
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
  Play,
  Pause,
  Search,
  Heart,
  History,
  Music,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Station {
  name: string;
  country: string;
  region?: string;
  genre: string;
  featured: boolean;
  stream: string;
}

const RADIO_STATIONS: Station[] = [
  {
    "name":"Radio Köln",
    "country":"Germany",
    "region":"NRW",
    "genre":"Local / Hits",
    "featured":true,
    "stream":"http://mp3.radiokoeln.c.nmdn.net/ps-radiokoeln/livestream.mp3"
  },
  {
    "name":"1LIVE",
    "country":"Germany",
    "region":"NRW",
    "genre":"Pop / Youth",
    "featured":false,
    "stream":"https://www1.wdr.de/radio/1live/index.html"
  },
  {
    "name":"WDR 2",
    "country":"Germany",
    "region":"NRW",
    "genre":"Adult Hits",
    "featured":false,
    "stream":"https://www1.wdr.de/radio/wdr2/index.html"
  },
  {
    "name":"WDR 4",
    "country":"Germany",
    "region":"NRW",
    "genre":"Oldies",
    "featured":false,
    "stream":"https://www1.wdr.de/radio/wdr4/index.html"
  },
  {
    "name":"WDR 5",
    "country":"Germany",
    "region":"NRW",
    "genre":"Talk / Culture",
    "featured":false,
    "stream":"https://www1.wdr.de/radio/wdr5/index.html"
  },
  {
    "name":"Radio Bonn/Rhein-Sieg",
    "country":"Germany",
    "region":"NRW",
    "genre":"Local",
    "featured":false,
    "stream":"https://www.radiobonn.de"
  },
  {
    "name":"Antenne Düsseldorf",
    "country":"Germany",
    "region":"NRW",
    "genre":"Local",
    "featured":false,
    "stream":"https://www.antenneduesseldorf.de"
  },
  {
    "name":"Radio Essen",
    "country":"Germany",
    "region":"NRW",
    "genre":"Local",
    "featured":false,
    "stream":"https://www.radioessen.de"
  },
  {
    "name":"Radio Bochum",
    "country":"Germany",
    "region":"NRW",
    "genre":"Local",
    "featured":false,
    "stream":"https://www.radiobochum.de"
  },
  {
    "name":"Radio Lippe",
    "country":"Germany",
    "region":"NRW",
    "genre":"Local",
    "featured":false,
    "stream":"https://www.radiolippe.de"
  },
  {
    "name":"Radio 10",
    "country":"Netherlands",
    "genre":"Greatest Hits",
    "featured":true,
    "stream":"https://www.radio10.nl/radio"
  }
];

const REAL_STREAMS: Record<string, string> = {
  "Radio Köln": "https://radiokoeln.stream46.radiohost.de/radiokoeln-live_mp3-192",
  "1LIVE": "https://wdr-1live-live.icecast.wdr.de/wdr/1live/live/mp3/128/stream.mp3",
  "WDR 2": "https://wdr-wdr2-koln.icecast.wdr.de/wdr/wdr2/koln/mp3/128/stream.mp3",
  "WDR 4": "https://wdr-wdr4-live.icecast.wdr.de/wdr/wdr4/live/mp3/128/stream.mp3",
  "WDR 5": "https://wdr-wdr5-live.icecast.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3",
  "Radio Bonn/Rhein-Sieg": "https://live.radiobonn.de/bonn/mp3-128/internetradio/",
  "Antenne Düsseldorf": "https://live.antenneduesseldorf.de/aduesseldorf/mp3-128/internetradio/",
  "Radio Essen": "https://live.radioessen.de/ressen/mp3-128/internetradio/",
  "Radio Bochum": "https://live.radiobochum.de/rbochum/mp3-128/internetradio/",
  "Radio Lippe": "https://live.radiolippe.de/rlippe/mp3-128/internetradio/",
  "Radio 10": "https://stream.radio10.nl/radio10"
};

// Gradient mapping for logos/avatars
const LOGO_GRADIENTS: Record<string, string> = {
  "Radio Köln": "from-red-650 via-orange-600 to-amber-500",
  "1LIVE": "from-slate-700 via-slate-800 to-black",
  "WDR 2": "from-blue-700 via-indigo-800 to-slate-900",
  "WDR 4": "from-amber-500 via-rose-500 to-red-650",
  "WDR 5": "from-cyan-600 via-teal-700 to-blue-800",
  "Radio Bonn/Rhein-Sieg": "from-teal-500 via-emerald-600 to-blue-700",
  "Antenne Düsseldorf": "from-red-600 via-rose-700 to-amber-600",
  "Radio Essen": "from-yellow-500 via-green-600 to-teal-700",
  "Radio Bochum": "from-sky-500 via-blue-600 to-indigo-800",
  "Radio Lippe": "from-orange-500 via-amber-600 to-yellow-600",
  "Radio 10": "from-amber-400 via-yellow-500 to-orange-500"
};

interface AccessibilityWidgetProps {
  showPortalMenu?: boolean;
  setShowPortalMenu?: (show: boolean) => void;
}

export default function AccessibilityWidget({ showPortalMenu, setShowPortalMenu }: AccessibilityWidgetProps = {}) {
  const {
    fontScale,
    setFontScale,
    colorblindMode,
    setColorblindMode,
    audioEnabled,
    setAudioEnabled,
    lineHeightScale,
    setLineHeightScale,
    fontWeightScale,
    setFontWeightScale,
    eyeWarmthScale,
    setEyeWarmthScale,
    language,
    activeView
  } = useGlobalSystem();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "acoustic">("visual");

  // Radio States
  const [currentStation, setCurrentStation] = useState<Station | null>(() => {
    try {
      const saved = localStorage.getItem("last_played_radio");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("radio_favorites");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("radio_recently_played");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize master audio play/pause
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  if (activeView) return null;

  const handleReset = () => {
    setFontScale(1.0);
    setColorblindMode("normal");
    setAudioEnabled(false);
    setLineHeightScale(1.5);
    setFontWeightScale(1);
    setEyeWarmthScale(0);
  };

  const handleFontIncrease = () => {
    setFontScale(Math.min(1.8, Number((fontScale + 0.1).toFixed(1))));
  };

  const handleFontDecrease = () => {
    setFontScale(Math.max(0.7, Number((fontScale - 0.1).toFixed(1))));
  };

  const handleLineHeightIncrease = () => {
    setLineHeightScale(Math.min(2.0, Number((lineHeightScale + 0.1).toFixed(1))));
  };

  const handleLineHeightDecrease = () => {
    setLineHeightScale(Math.max(1.2, Number((lineHeightScale - 0.1).toFixed(1))));
  };

  const handleWeightIncrease = () => {
    setFontWeightScale(Math.min(3, fontWeightScale + 1));
  };

  const handleWeightDecrease = () => {
    setFontWeightScale(Math.max(0, fontWeightScale - 1));
  };

  const handleWarmthIncrease = () => {
    setEyeWarmthScale(Math.min(5, eyeWarmthScale + 1));
  };

  const handleWarmthDecrease = () => {
    setEyeWarmthScale(Math.max(0, eyeWarmthScale - 1));
  };

  // Radio Playback functions
  const playStation = (station: Station) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const liveUrl = REAL_STREAMS[station.name] || station.stream;
    const newAudio = new Audio(liveUrl);
    newAudio.volume = 0.35; // optimal streaming volume
    audioPlayerRef.current = newAudio;
    
    setIsPlaying(true);
    setCurrentStation(station);
    localStorage.setItem("last_played_radio", JSON.stringify(station));

    // Save recently played list
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(name => name !== station.name);
      const updated = [station.name, ...filtered].slice(0, 4);
      localStorage.setItem("radio_recently_played", JSON.stringify(updated));
      return updated;
    });

    // Handle play error gracefully without breaking UI
    newAudio.play().catch(err => {
      console.warn("Failed to play live stream:", err);
    });
  };

  const togglePlayback = () => {
    if (!currentStation) {
      // Play first if none selected
      playStation(RADIO_STATIONS[0]);
      return;
    }

    if (isPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play().catch(err => {
          console.warn("Could not play station stream", err);
        });
      } else {
        playStation(currentStation);
      }
      setIsPlaying(true);
    }
  };

  const toggleFavorite = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name];
      localStorage.setItem("radio_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter stations based on search query
  const filteredStations = RADIO_STATIONS.filter(station => {
    const q = searchQuery.toLowerCase();
    return (
      station.name.toLowerCase().includes(q) ||
      station.genre.toLowerCase().includes(q) ||
      station.country.toLowerCase().includes(q) ||
      (station.region && station.region.toLowerCase().includes(q))
    );
  });

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

      {/* FLOATING ACCESSIBILITY & MEDIA CONTROL GROUP (TASK 1) */}
      <div className="fixed bottom-8 left-8 z-[30] pointer-events-auto flex items-center gap-3">
        {/* Glasses (System Optimizer) Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-xl border ${
            isOpen 
              ? "bg-teal-500 text-slate-950 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105" 
              : "bg-slate-900/90 hover:bg-slate-950 text-white border-white/10 hover:border-teal-500/40 hover:scale-105"
          } active:scale-95 cursor-pointer`}
          title={language === "en" ? "System Optimizer" : "System-Optimierung"}
        >
          <Glasses size={20} className={isOpen ? "animate-pulse" : ""} />
        </button>

        {/* Radio Stream Direct Toggle Button */}
        <button
          onClick={togglePlayback}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-xl border ${
            isPlaying 
              ? "bg-orange-500 text-slate-950 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105" 
              : "bg-slate-900/90 hover:bg-slate-950 text-white border-white/10 hover:border-orange-500/40 hover:scale-105"
          } active:scale-95 cursor-pointer`}
          title={language === "en" ? "Toggle Radio Köln Stream" : "Radio Köln umschalten"}
        >
          <Radio size={20} className={isPlaying ? "animate-pulse" : ""} />
        </button>

        {/* ACCESSIBILITY BOARD PANEL */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="absolute bottom-16 left-0 w-80 sm:w-96 bg-slate-950/95 border border-white/15 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl text-white pointer-events-auto"
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
                  📻 {language === "en" ? "Radio Player" : "Radio-Empfänger"}
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
                            style={{ width: `${((fontScale - 0.7) / 1.1) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={handleFontIncrease}
                          disabled={fontScale >= 1.8}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">
                        {language === "en" ? "Scales all health reports & UI elements proportionally" : "Skaliert alle Texte & UI-Elemente proportional"}
                      </p>
                    </div>

                    {/* Line height adjusting panel */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">
                          ↕️ {language === "en" ? "Line Spacing / Height" : "Zeilenabstand / Höhe"}
                        </span>
                        <span className="text-xs font-mono text-teal-400 font-bold">
                          {lineHeightScale.toFixed(1)}x
                        </span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center gap-3">
                        <button
                          onClick={handleLineHeightDecrease}
                          disabled={lineHeightScale <= 1.2}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-teal-400 transition-all duration-200"
                            style={{ width: `${((lineHeightScale - 1.2) / 0.8) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={handleLineHeightIncrease}
                          disabled={lineHeightScale >= 2.0}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Font weight adjusting panel */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">
                          🔤 {language === "en" ? "Text Weight / Thickness" : "Schriftdicke / Stärke"}
                        </span>
                        <span className="text-xs font-mono text-teal-400 font-bold">
                          {fontWeightScale === 0 ? (language === "en" ? "Light" : "Leicht") :
                           fontWeightScale === 1 ? (language === "en" ? "Normal" : "Normal") :
                           fontWeightScale === 2 ? (language === "en" ? "Medium" : "Medium") :
                           (language === "en" ? "Bold" : "Fett")}
                        </span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center gap-3">
                        <button
                          onClick={handleWeightDecrease}
                          disabled={fontWeightScale <= 0}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-teal-400 transition-all duration-200"
                            style={{ width: `${(fontWeightScale / 3) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={handleWeightIncrease}
                          disabled={fontWeightScale >= 3}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Blue-Light filter warmth adjusting panel */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">
                          ☀️ {language === "en" ? "Eye Warmth (Blue-Light Filter)" : "Bildschirmwärme (Blaulichtfilter)"}
                        </span>
                        <span className="text-xs font-mono text-teal-400 font-bold">
                          {eyeWarmthScale === 0 ? (language === "en" ? "Off" : "Aus") : `${eyeWarmthScale * 20}%`}
                        </span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center gap-3">
                        <button
                          onClick={handleWarmthDecrease}
                          disabled={eyeWarmthScale <= 0}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-teal-400 transition-all duration-200"
                            style={{ width: `${(eyeWarmthScale / 5) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={handleWarmthIncrease}
                          disabled={eyeWarmthScale >= 5}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white transition-all disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
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
                    {/* CURRENTLY PLAYING PLAYER BAR (Material 3 Dark UI style card) */}
                    <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentStation ? LOGO_GRADIENTS[currentStation.name] || 'from-teal-600 to-cyan-800' : 'from-slate-800 to-slate-950'} flex items-center justify-center border border-white/10 shadow-lg text-white font-black text-sm shrink-0 relative overflow-hidden`}>
                          {currentStation ? currentStation.name.split(' ').map(n => n[0]).join('').slice(0, 2) : "UDO"}
                          {currentStation && (
                            <span className="absolute bottom-0 right-0 bg-black/60 px-1 py-0.2 text-[8px] rounded-tl">
                              {currentStation.country === "Germany" ? "🇩🇪" : "🇳🇱"}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono tracking-widest text-teal-400 font-extrabold uppercase animate-pulse">
                              {isPlaying ? "● Live stream" : "■ Paused"}
                            </span>
                            {isPlaying && (
                              <div className="flex items-center gap-0.5 h-3">
                                {[1, 2, 3, 4].map(b => (
                                  <div 
                                    key={b} 
                                    className="w-0.5 bg-teal-400 rounded-full" 
                                    style={{
                                      height: "100%",
                                      animation: "bounce 0.6s ease-in-out infinite alternate",
                                      animationDelay: `${b * 0.15}s`
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-black text-slate-100 block truncate uppercase tracking-wide mt-0.5">
                            {currentStation ? `${currentStation.name} ${currentStation.country === "Germany" ? "🇩🇪" : "🇳🇱"}` : "UDO Broadcaster"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block truncate uppercase">
                            {currentStation ? `${currentStation.genre} ${currentStation.region ? `| ${currentStation.region}` : ''}` : "Select a station below to play"}
                          </span>
                        </div>

                        {/* Large Featured Pulsing Button or standard play button */}
                        <button
                          onClick={togglePlayback}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all border ${
                            currentStation?.name === "Radio Köln"
                              ? isPlaying 
                                ? "bg-orange-500 border-orange-400 animate-glow-koln" 
                                : "bg-orange-500/20 border-orange-500/50 hover:bg-orange-500 text-orange-400 hover:text-white"
                              : currentStation?.name === "Radio 10"
                              ? isPlaying 
                                ? "bg-blue-500 border-blue-400 animate-glow-radio10" 
                                : "bg-blue-500/20 border-blue-500/50 hover:bg-blue-500 text-blue-400 hover:text-white"
                              : "bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-950 hover:border-teal-400"
                          }`}
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
                        </button>
                      </div>
                    </div>

                    {/* RECENTLY PLAYED ROW */}
                    {recentlyPlayed.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1">
                          <History size={10} />
                          {language === "en" ? "Recently Played" : "Zuletzt gehört"}
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {recentlyPlayed.map((name) => {
                            const station = RADIO_STATIONS.find(s => s.name === name);
                            if (!station) return null;
                            return (
                              <button
                                key={name}
                                onClick={() => playStation(station)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider border shrink-0 transition-all cursor-pointer ${
                                  currentStation?.name === name
                                    ? "bg-teal-500/10 border-teal-400 text-teal-300"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300"
                                }`}
                              >
                                {station.name} {station.country === "Germany" ? "🇩🇪" : "🇳🇱"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* POPULAR RADIOS SECTION */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-extrabold flex items-center gap-1.5">
                          <Radio size={12} className="animate-pulse" />
                          {language === "en" ? "Popular NRW & NL Radios" : "Beliebte NRW & NL Radios"}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {filteredStations.length} {language === "en" ? "Stations" : "Sender"}
                        </span>
                      </div>

                      {/* Search bar */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Search size={12} className="text-slate-400" />
                        </span>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={language === "en" ? "Search station or genre..." : "Sender oder Genre suchen..."}
                          className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/40 focus:bg-slate-900/80 transition-all"
                        />
                      </div>

                      {/* Stations List */}
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {filteredStations.map((station) => {
                          const isCurrent = currentStation?.name === station.name;
                          const isFav = favorites.includes(station.name);
                          const isFeaturedGlow = station.featured; // Only Köln and Radio 10 are featured (featured: true)

                          return (
                            <div
                              key={station.name}
                              onClick={() => playStation(station)}
                              className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-slate-900 border-teal-500/50 shadow-md shadow-teal-500/5"
                                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                              }`}
                            >
                              {/* Station Brand logo / monogram */}
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${LOGO_GRADIENTS[station.name] || 'from-slate-700 to-slate-900'} flex items-center justify-center text-[10px] font-mono font-black text-white shrink-0 relative shadow-sm`}>
                                  {station.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  <span className="absolute bottom-[-1px] right-[-1px] text-[8px]">
                                    {station.country === "Germany" ? "🇩🇪" : "🇳🇱"}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-black text-slate-200 truncate uppercase tracking-wide">
                                      {station.name}
                                    </span>
                                    <span className="text-[10px] shrink-0">
                                      {station.country === "Germany" ? "🇩🇪" : "🇳🇱"}
                                    </span>
                                    {isCurrent && (
                                      <span className="text-[7px] font-mono font-black bg-teal-500/35 border border-teal-400 text-teal-300 px-1.5 rounded-full animate-pulse">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-400 block truncate uppercase">
                                    {station.genre} {station.region ? `| ${station.region}` : ''}
                                  </span>
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Favorite button */}
                                <button
                                  onClick={(e) => toggleFavorite(station.name, e)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isFav
                                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white"
                                      : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                                  }`}
                                  title={isFav ? "Remove Favorite" : "Favorite"}
                                >
                                  <Heart size={11} className={isFav ? "fill-current" : ""} />
                                </button>

                                {/* Play button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isCurrent) {
                                      togglePlayback();
                                    } else {
                                      playStation(station);
                                    }
                                  }}
                                  className={`w-7.5 h-7.5 rounded-full flex items-center justify-center border text-white transition-all cursor-pointer ${
                                    station.name === "Radio Köln"
                                      ? isCurrent && isPlaying
                                        ? "bg-orange-500 border-orange-400 animate-glow-koln"
                                        : "bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500 hover:text-white"
                                      : station.name === "Radio 10"
                                      ? isCurrent && isPlaying
                                        ? "bg-blue-500 border-blue-400 animate-glow-radio10"
                                        : "bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-white"
                                      : isCurrent && isPlaying
                                      ? "bg-teal-500 border-teal-400 text-slate-950"
                                      : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:text-teal-400 hover:border-teal-500/30"
                                  }`}
                                >
                                  {isCurrent && isPlaying ? <Pause size={10} className="fill-current" /> : <Play size={10} className="fill-current ml-0.5" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {filteredStations.length === 0 && (
                          <div className="text-center py-6">
                            <span className="text-xs text-slate-500 uppercase font-mono block">
                              {language === "en" ? "No matching stations" : "Keine passenden Sender"}
                            </span>
                          </div>
                        )}
                      </div>
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
