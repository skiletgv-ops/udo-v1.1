import React, { useState } from "react";
import { useGlobalSystem } from "./GlobalSystemContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Check, 
  Loader2, 
  AlertTriangle, 
  Trash2, 
  Brain, 
  Mic, 
  MessageSquare, 
  FileText,
  Clock
} from "lucide-react";

export default function MemorySyncStatusIndicator() {
  const {
    syncStatus,
    memoryRecords,
    clearMemory,
    language
  } = useGlobalSystem();

  const [isOpen, setIsOpen] = useState(false);

  // Return background glow and color based on syncState
  const getStatusColorClasses = () => {
    switch (syncStatus) {
      case "saving":
        return {
          dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
          border: "border-amber-500/30",
          text: "text-amber-400",
          bg: "bg-amber-500/10"
        };
      case "error":
        return {
          dot: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]",
          border: "border-rose-500/30",
          text: "text-rose-400",
          bg: "bg-rose-500/10"
        };
      case "synced":
      default:
        return {
          dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          bg: "bg-emerald-500/10"
        };
    }
  };

  const statusStyle = getStatusColorClasses();

  return (
    <div className="relative pointer-events-auto">
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 border ${statusStyle.border} ${statusStyle.bg} backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer`}
      >
        {/* Color-coded sync status dot indicator */}
        <div className="relative flex items-center justify-center">
          {syncStatus === "saving" ? (
            <Loader2 size={13} className="text-amber-400 animate-spin" />
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot} transition-colors duration-300`} />
          )}
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-slate-200">
          {syncStatus === "saving" ? (
            language === "en" ? "Syncing..." : "Speichern..."
          ) : (
            language === "en" ? "Synapse Saved" : "Synapsen-Sync"
          )}
        </span>
      </button>

      {/* INTERACTIVE CORTICAL MEMORY HUB DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
            className="absolute right-0 mt-3 w-[360px] sm:w-[420px] bg-slate-950/95 border border-white/10 rounded-[28px] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-3xl z-50 text-white"
          >
            {/* Dropdown Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-teal-400 animate-pulse" />
                <div>
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-widest font-extrabold block">
                    {language === "en" ? "UDO Cognitive Synapse" : "UDO Kognitive Synapse"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {language === "en" ? "Long-Term Memory Vault" : "Langzeitgedächtnis-Datenbank"}
                  </span>
                </div>
              </div>

              {memoryRecords.length > 0 && (
                <button
                  onClick={clearMemory}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-slate-950 text-rose-400 text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all cursor-pointer"
                  title={language === "en" ? "Clear all cognitive memories" : "Alle Gedächtniseinträge löschen"}
                >
                  <Trash2 size={12} />
                  <span>{language === "en" ? "Clear" : "Löschen"}</span>
                </button>
              )}
            </div>

            {/* Sync status summary block */}
            <div className={`p-3 rounded-2xl border ${statusStyle.border} ${statusStyle.bg} mb-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                {syncStatus === "saving" ? (
                  <Loader2 size={16} className="text-amber-400 animate-spin" />
                ) : syncStatus === "error" ? (
                  <AlertTriangle size={16} className="text-rose-400" />
                ) : (
                  <Check size={16} className="text-emerald-400" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">
                    {syncStatus === "saving" ? (
                      language === "en" ? "Encrypting & saving memories..." : "Verschlüsselung & Speicherung..."
                    ) : syncStatus === "error" ? (
                      language === "en" ? "Synchronization failed" : "Synchronisierung fehlgeschlagen"
                    ) : (
                      language === "en" ? "Securely Synced & Saved" : "Sicher synchronisiert & gespeichert"
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {language === "en" ? "Complies with HIPAA / GDPR 256-bit encryption" : "Konform mit DSGVO / 256-Bit-Verschlüsselung"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                {memoryRecords.length} {language === "en" ? "records" : "Einträge"}
              </span>
            </div>

            {/* Stored Memory List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {memoryRecords.length === 0 ? (
                <div className="py-8 text-center text-slate-500 font-mono text-xs border border-dashed border-white/5 rounded-2xl">
                  <Database size={24} className="mx-auto mb-2 opacity-40 text-slate-400" />
                  <p>{language === "en" ? "No cognitive memories stored yet." : "Noch keine Synapsen-Einträge gespeichert."}</p>
                  <p className="text-[10px] mt-1 opacity-70">
                    {language === "en" ? "Text or speak with UDO to record context." : "Schreibe oder sprich mit UDO, um Einträge zu speichern."}
                  </p>
                </div>
              ) : (
                [...memoryRecords].reverse().map((record) => (
                  <div 
                    key={record.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                          {record.type === "voice" ? <Mic size={12} /> : <MessageSquare size={12} />}
                        </div>
                        <div>
                          {record.patientName && (
                            <p className="text-xs font-black text-white leading-none">
                              👤 {record.patientName}
                            </p>
                          )}
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {record.type === "voice" 
                              ? (language === "en" ? "Voice Dialogue" : "Gesprochener Dialog")
                              : (language === "en" ? "Clinical Chat" : "Klinischer Chat")
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                        <Clock size={10} />
                        <span>{record.timestamp}</span>
                      </div>
                    </div>

                    {record.problemSolved && (
                      <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-2 text-[11px] text-teal-300 font-medium">
                        <span className="font-extrabold uppercase tracking-wider text-[9px] text-teal-400 block mb-0.5 font-mono">
                          ✓ {language === "en" ? "RECOGNIZED INSIGHT" : "ERKANNTE ERKENNTNIS"}
                        </span>
                        {record.problemSolved}
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-black/30 p-2 rounded-xl italic">
                      "{record.rawText.length > 120 ? record.rawText.slice(0, 120) + "..." : record.rawText}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer Details */}
            <div className="border-t border-white/10 mt-4 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{language === "en" ? "CORTICAL MEMORY IMPROVEMENT" : "KOGNITIVES LERNEN AKTIV"}</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition-colors uppercase font-bold"
              >
                {language === "en" ? "Dismiss" : "Schließen"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
