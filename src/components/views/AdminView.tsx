import React, { useState } from 'react';
import { Key, Shield, FolderSync, ShieldCheck, Lock, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlbisGdtBridgePanel } from '../AlbisGdtBridgePanel';
import CompliancePanel from '../CompliancePanel';
import ApiKeysAdmin from '../ApiKeysAdmin';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'albis' | 'compliance' | 'apikeys' | 'qes'>('albis');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in pb-16">
      {/* View Title */}
      <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">System & Praxis-Schnittstellen</Badge>
            <Badge variant="emerald">CGM ALBIS GDT 2.1 Aktiv</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            U.D.O. Systemverwaltung & Integrationen
          </h1>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('albis')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'albis'
                ? 'bg-[#B87333]/20 border border-[#B87333]/50 text-[#E8A87C] shadow-[0_0_15px_rgba(184,115,51,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderSync className="w-4 h-4 text-[#E8A87C]" />
            CGM ALBIS GDT 2.1
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compliance'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,212,170,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            DSGVO Compliance
          </button>

          <button
            onClick={() => setActiveTab('apikeys')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'apikeys'
                ? 'bg-violet-500/20 border border-violet-500/50 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Key className="w-4 h-4 text-violet-400" />
            KI-API Keys
          </button>

          <button
            onClick={() => setActiveTab('qes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'qes'
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4 text-rose-400" />
            QES Signatur HSM
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'albis' && <AlbisGdtBridgePanel />}

      {activeTab === 'compliance' && <CompliancePanel />}

      {activeTab === 'apikeys' && <ApiKeysAdmin />}

      {activeTab === 'qes' && (
        <Card glow="rose" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-rose-400 font-mono font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>Qualifizierte Elektronische Signatur (QES) Status</span>
            </div>
            <Badge variant="emerald">eIDAS HSM Online</Badge>
          </div>

          <p className="text-xs text-slate-300">
            Das BSI-zertifizierte Hardware-Sicherheitsmodul (HSM) signiert erstelle Gutachten eIDAS-konform und verankert den Hash im lokalen Audit-Log.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">HSM Module Status:</span>
              <span className="text-emerald-400 font-bold">ONLINE (BSI Zertifiziert)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Signaturschlüssel:</span>
              <span className="text-cyan-300 font-bold">G-2026-7742-QES</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">eIDAS Zertifikatsklasse:</span>
              <span className="text-white">Klasse III (Arztinstanz Dr. Bongartz)</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
