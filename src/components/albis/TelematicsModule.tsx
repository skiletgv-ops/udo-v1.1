import React, { useState } from 'react';
import { Network, Send, CheckCircle2, AlertTriangle, RefreshCw, ShieldCheck, Lock, FileCode2 } from 'lucide-react';

interface TelematicsItem {
  id: string;
  type: 'eRezept' | 'eAU' | 'eArztbrief' | 'ePA';
  patientName: string;
  recipient: string;
  status: 'Pending' | 'Transmitting' | 'Sent' | 'Failed';
  timestamp: string;
}

export const TelematicsModule: React.FC = () => {
  const [items, setItems] = useState<TelematicsItem[]>([
    { id: 'TI-901', type: 'eRezept', patientName: 'Müller, Hans', recipient: 'Gematik Fachdienst eRezept', status: 'Pending', timestamp: '10:14' },
    { id: 'TI-902', type: 'eArztbrief', patientName: 'Schneider, Sabine', recipient: 'KIM Adresse: voss@praxis-mitte.kim.telematik', status: 'Sent', timestamp: '09:45' },
    { id: 'TI-903', type: 'eAU', patientName: 'Fischer, Elena', recipient: 'AOK Rheinland KIM Gateway', status: 'Pending', timestamp: '10:20' },
    { id: 'TI-904', type: 'ePA', patientName: 'Hoffmann, Michael', recipient: 'ePA Krankenkasse Aktenkonto', status: 'Failed', timestamp: '08:30' }
  ]);

  const [isSimulatingGateway, setIsSimulatingGateway] = useState(false);

  const handleBatchSend = () => {
    setIsSimulatingGateway(true);

    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'Sent',
          timestamp: new Date().toLocaleTimeString().slice(0, 5)
        }))
      );
      setIsSimulatingGateway(false);
    }, 2000);
  };

  const handleRetryFailed = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Sent', timestamp: new Date().toLocaleTimeString().slice(0, 5) } : item))
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Autonomous Telematics Engine (TI 2.0)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                KIM & KONNEKTOR STUB
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Automatisierte Batch-Verarbeitung von eRezept, eAU, eArztbrief & ePA
            </p>
          </div>
        </div>

        <button
          onClick={handleBatchSend}
          disabled={isSimulatingGateway}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <Send size={15} />
          <span>One-Click Batch Process</span>
        </button>
      </div>

      {/* SECURE GATEWAY SIMULATION MODAL OVERLAY */}
      {isSimulatingGateway && (
        <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center gap-3 font-mono text-xs text-cyan-200 animate-pulse">
          <RefreshCw size={18} className="animate-spin text-cyan-400" />
          <span>Übertrage XML/FHIR Payloads an Konnektor & KIM Gateway... HSM-B Karte Verifizierung...</span>
        </div>
      )}

      {/* DASHBOARD TABLE */}
      <div className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-2 font-mono text-xs">
        <div className="grid grid-cols-12 text-[10px] text-slate-500 border-b border-white/10 pb-2 uppercase font-bold">
          <span className="col-span-2">ID & Typ</span>
          <span className="col-span-3">Patient</span>
          <span className="col-span-4">KIM Empfänger</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1 text-right">Aktion</span>
        </div>

        {items.map((item) => {
          let badge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
          if (item.status === 'Sent') badge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          if (item.status === 'Failed') badge = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

          return (
            <div key={item.id} className="grid grid-cols-12 items-center py-2 border-b border-white/5 text-slate-300">
              <div className="col-span-2">
                <span className="font-bold text-white block">{item.id}</span>
                <span className="text-[10px] text-cyan-300">{item.type}</span>
              </div>
              <div className="col-span-3 font-bold text-slate-200">{item.patientName}</div>
              <div className="col-span-4 text-[11px] text-slate-400 truncate">{item.recipient}</div>
              <div className="col-span-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge}`}>
                  {item.status}
                </span>
              </div>
              <div className="col-span-1 text-right">
                {item.status === 'Failed' && (
                  <button
                    onClick={() => handleRetryFailed(item.id)}
                    className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                    title="Auto-Retry"
                  >
                    <RefreshCw size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
