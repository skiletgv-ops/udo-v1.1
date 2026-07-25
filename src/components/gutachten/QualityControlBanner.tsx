import React from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import { QualityControlItem } from "./gutachtenTypes";

interface QualityControlBannerProps {
  qcItems: QualityControlItem[];
  onResolveItem: (id: string) => void;
}

export default function QualityControlBanner({
  qcItems,
  onResolveItem,
}: QualityControlBannerProps) {
  const unresolved = qcItems.filter((q) => !q.isResolved);

  if (unresolved.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span className="font-bold">
            Qualitätskontrolle Vollständig: Keine ungelösten Diagnosedifferenzen oder Aktenwidersprüche erkannt.
          </span>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40">
          ✓ 100% Validiert
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono">
          <AlertTriangle size={16} className="text-amber-400 animate-pulse" />
          <span>Qualitätskontrolle: {unresolved.length} Automatische Prüfhinweise</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Lösen Sie Widersprüche vor der Finalisierung
        </span>
      </div>

      <div className="space-y-2">
        {unresolved.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <span className="font-bold text-white block">{item.title}</span>
              <p className="text-slate-300 text-[11px]">{item.description}</p>
              <p className="text-[10px] font-mono text-cyan-300/90 mt-1">
                Lösungsvorschlag: {item.suggestedResolution}
              </p>
            </div>

            <button
              onClick={() => onResolveItem(item.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[10px] font-mono font-bold uppercase cursor-pointer shrink-0 self-start sm:self-auto transition-all"
            >
              Als Gelöst Markieren
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
