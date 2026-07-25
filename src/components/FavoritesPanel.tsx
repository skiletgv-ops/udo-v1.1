import React, { useState } from "react";
import { 
  Star, 
  Bookmark, 
  Zap, 
  ArrowRight, 
  FileCode2, 
  Activity, 
  CheckCircle2, 
  Heart,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface FavoriteItem {
  id: string;
  type: "template" | "icd10" | "prompt" | "mde_rule";
  title: string;
  description: string;
  code?: string;
  tag: string;
}

const FAVORITES_DATA: FavoriteItem[] = [
  {
    id: "fav-1",
    type: "mde_rule",
    title: "S2k Neurotrauma MdE-Tabelle",
    description: "Standardisierte MdE-Einschätzung bei Posttraumatischem Belastungssyndrom & Schädel-Hirn-Trauma I-III",
    code: "AWMF-008/001",
    tag: "AWMF S2k"
  },
  {
    id: "fav-2",
    type: "icd10",
    title: "ICD-10-GM G93.1: Anoxische Hirnschädigung",
    description: "Häufiger BG-Diagnosecode für hypoxic-ischemic encephalopathy mit MdE > 50%",
    code: "ICD G93.1",
    tag: "Neurologie"
  },
  {
    id: "fav-3",
    type: "template",
    title: "Vollständiges BG-S2k Gutachten Template",
    description: "4-Augen Konsensus Textbaustein für gerichtliche MdE-Feststellung",
    code: "GUTACHTEN-PRO",
    tag: "Gutachten"
  },
  {
    id: "fav-4",
    type: "prompt",
    title: "KI-Differenzialdiagnose & AWMF-Abgleich Prompt",
    description: "Multi-Agenten Konsensusbefehl zur Überprüfung von Widersprüchen in Vorbefunden",
    code: "PROMPT-UDO",
    tag: "Multi-Agent"
  }
];

export default function FavoritesPanel() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(FAVORITES_DATA);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-5 text-slate-100 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Star size={20} className="fill-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              FAVORITEN & SCHNELLZUGRIFFE
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Gepinntes AWMF-Regelwerk, Vorlagen & Favoritencode-Schnipsel für schnelle Konsultationen
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
          {favorites.length} Gepinnt
        </span>
      </div>

      {/* Grid of Favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map(item => (
          <div
            key={item.id}
            className="bg-slate-950/80 border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
                  {item.tag}
                </span>
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                  title="Unpin / Remove"
                >
                  <Star size={16} className="fill-amber-400 text-amber-400 group-hover:text-rose-400" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              {item.code && (
                <span className="text-teal-400 bg-slate-900 px-2 py-1 rounded border border-white/5 font-bold">
                  {item.code}
                </span>
              )}

              <button
                onClick={() => copyCode(item.id, item.code || item.title)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
              >
                {copiedId === item.id ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Zap size={14} className="text-amber-400" />
                )}
                <span>{copiedId === item.id ? "Kopiert" : "Übernehmen"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
