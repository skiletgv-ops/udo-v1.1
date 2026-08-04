import React from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ClipboardList,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PortalPage: React.FC = () => {
  const { patientPortalDocs } = useUdoStore();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-slate-900/90 border border-violet-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 border border-violet-500/40 rounded-full text-violet-300 text-[11px] font-mono uppercase tracking-wider font-bold">
              <ShieldCheck size={14} className="text-violet-400" />
              <span>Geschütztes Patienten-Portal • Praxis Dr. med. Ulrike Bongartz</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Willkommen, Thomas Müller
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Patienten-ID: <span className="text-violet-300 font-bold">PAT-4829</span> • Versichertenstatus: Privat (Debeka)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/dashboard"
              className="px-5 py-3 rounded-2xl bg-slate-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-950/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <ExternalLink size={16} />
              <span>UDO 2032 Core Command</span>
            </a>

            <a
              href="/portal/screening"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <ClipboardList size={16} />
              <span>Digitalen Screening-Bogen Starten</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        {/* APPOINTMENT & STATUS TRACKER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase mb-2">
              <Calendar size={16} /> Nächster Termin
            </div>
            <div className="text-lg font-bold text-white">28. Juli 2026</div>
            <div className="text-xs text-slate-400 mt-1">10:30 Uhr • Neumarkt 1, Köln</div>
            <span className="mt-3 inline-block px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
              Bestätigt
            </span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase mb-2">
              <Clock size={16} /> S2k-Gutachten Status
            </div>
            <div className="text-lg font-bold text-white">Finalisierte Ausfertigung</div>
            <div className="text-xs text-slate-400 mt-1">Unterzeichnet von Dr. Bongartz</div>
            <span className="mt-3 inline-block px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">
              Bereit zum Download
            </span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase mb-2">
              <ShieldCheck size={16} /> Kostenübernahme PKV
            </div>
            <div className="text-lg font-bold text-white">Genehmigt</div>
            <div className="text-xs text-slate-400 mt-1">Debeka Aktenzeichen: PKV-89211</div>
            <span className="mt-3 inline-block px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
              Vollständig
            </span>
          </div>
        </div>

        {/* FINALIZED DOCUMENTS DOWNLOAD TABLE */}
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
              <FileText size={18} className="text-violet-400" />
              <span>Freigegebene Dokumente & Gutachten</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">AES-256 Verschlüsselt</span>
          </div>

          <div className="space-y-3">
            {patientPortalDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-slate-950/80 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{doc.title}</span>
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-mono">
                      {doc.category}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Freigegeben von: <span className="text-slate-200">{doc.signedBy || 'Dr. med. Ulrike Bongartz'}</span> • {new Date(doc.uploadedAt).toLocaleDateString('de-DE')}
                  </div>
                </div>

                <a
                  href={doc.fileUrl}
                  download
                  className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-200 hover:bg-violet-500 hover:text-slate-950 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
