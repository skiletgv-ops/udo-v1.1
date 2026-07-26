// REQUIRES: MDR/CE certification before clinical use

import React, { useState } from 'react';
import ClinicalDisclaimer from '../ClinicalDisclaimer';
import { DeviceSession } from '../../types/device';
import { useUdoStore } from '../../store/useUdoStore';
import {
  ArrowLeft,
  Cpu,
  FileText,
  Paperclip,
  Check,
  Building,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface DeviceDetailViewProps {
  session: DeviceSession;
  onBack: () => void;
}

export const DeviceDetailView: React.FC<DeviceDetailViewProps> = ({ session, onBack }) => {
  const { updateSessionStatus, attachSessionToGutachten, logAuditAction } = useUdoStore();

  const [deviceType, setDeviceType] = useState<'EEG' | 'ECG' | 'Cognitive'>(
    session.deviceModel.toLowerCase().includes('eeg')
      ? 'EEG'
      : session.deviceModel.toLowerCase().includes('ecg') || session.deviceModel.toLowerCase().includes('ekg')
      ? 'ECG'
      : 'Cognitive'
  );

  const [findingsText, setFindingsText] = useState(session.findings || '');
  const [targetSection, setTargetSection] = useState('Abschnitt 3: Klinische & Apparative Befunde');
  const [isAttachedSuccess, setIsAttachedSuccess] = useState(false);

  const handleSaveFindings = () => {
    updateSessionStatus(session.id, 'reviewed', findingsText);
    logAuditAction('SAVE_DEVICE_FINDINGS', session.patientId, 'DEVICES', `Saved findings for ${session.deviceModel}`);
  };

  const handleAttachToGutachten = () => {
    updateSessionStatus(session.id, 'attached', findingsText);
    attachSessionToGutachten(session.id, targetSection);
    setIsAttachedSuccess(true);
    setTimeout(() => setIsAttachedSuccess(false), 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Zurück zur Geräte-Queue</span>
      </button>

      {/* CLINICAL DISCLAIMER AT TOP */}
      <ClinicalDisclaimer />

      {/* HEADER & METADATA CARD */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-cyan-500/15 border border-cyan-500/40 rounded-xl text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Cpu size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{session.deviceModel}</h1>
                <span className="px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/40 text-[10px] font-mono font-bold text-violet-300 uppercase">
                  Non-Diagnostic Raw Metadata
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Patient: <span className="text-cyan-300 font-bold">{session.patientName || session.patientId}</span> ({session.patientId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 bg-slate-950 border border-white/10 rounded-xl text-slate-300 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <span>{new Date(session.timestamp).toLocaleString('de-DE')}</span>
            </span>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 font-mono text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase block">Datei-Format</span>
            <span className="font-bold text-slate-200 uppercase">{session.fileType}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase block">Daten-Status</span>
            <span className="font-bold text-cyan-300 uppercase">{session.status}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase block">Synthetischer Datensatz</span>
            <span className="font-bold text-emerald-400">{session.isSynthetic ? 'Ja (Dev Simulation)' : 'Nein'}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 uppercase block">Infrastruktur</span>
            <span className="font-bold text-violet-300">Kölner Praxis Gateway</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: EMBEDDED VIEWER (PDF / PREVIEW) */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <FileText size={16} className="text-cyan-400" />
              <span>Gerätedaten-Protokoll Viewer</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              {session.fileType === 'pdf' ? 'PDF Dokument eingebettet' : 'Raw Event Metadata Log'}
            </span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl border border-white/10 p-4 overflow-auto relative flex flex-col">
            {session.fileType === 'pdf' ? (
              <iframe
                src={session.fileUrl}
                title="Device Protocol PDF"
                className="w-full h-full rounded border-0"
              />
            ) : (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-300 text-[11px] leading-relaxed">
                  <AlertCircle size={14} className="inline mr-1 text-violet-400" />
                  Keine Rohwellenformdarstellung. Strukturierte Geräteparameter werden direkt für die Gutachtensynthese extrahiert.
                </div>

                <div className="bg-slate-900/90 border border-white/10 p-3 rounded-lg text-slate-300 space-y-2">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                    Strukturierte Parameter-Extraktion:
                  </span>
                  {session.structuredFindings ? (
                    Object.entries(session.structuredFindings).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-white font-bold">{v}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">Keine strukturierten Parameter vorbanden.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: STRUCTURED FINDINGS & ATTACH FORM */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400" />
                <span>Strukturierte Befundbefüllung für Gutachten</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Freitext & Geräteklasse für den AI-Router zur Gutachten-S2k-Drafting auswählen.
              </p>
            </div>

            {/* DEVICE TYPE DROPDOWN */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                Geräte-Kategorie
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="EEG">EEG (Elektroenzephalographie)</option>
                <option value="ECG">ECG / EKG (Elektrokardiographie)</option>
                <option value="Cognitive">Kognitive Testbatterie (z.B. VTS)</option>
              </select>
            </div>

            {/* TARGET SECTION DROPDOWN */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                Ziel-Abschnitt im S2k-Gutachten
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="Abschnitt 3: Apparative & Zusatzbefunde">
                  Abschnitt 3: Apparative & Zusatzbefunde
                </option>
                <option value="Abschnitt 4: Befundbewertung & Konsensus">
                  Abschnitt 4: Befundbewertung & Konsensus
                </option>
                <option value="Abschnitt 5: Zusammenfassung & Leistungsvermögen">
                  Abschnitt 5: Zusammenfassung & Leistungsvermögen
                </option>
              </select>
            </div>

            {/* FINDINGS TEXTAREA */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                Ärztliche Befundzusammenfassung (Free-Text)
              </label>
              <textarea
                rows={6}
                value={findingsText}
                onChange={(e) => setFindingsText(e.target.value)}
                placeholder="Gerätebefund hier eingeben oder anpassen..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-sans text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            {isAttachedSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-bounce">
                <Check size={16} />
                <span>Erfolgreich an den AI-Router & S2k-Gutachtenentwurf übermittelt!</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSaveFindings}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-slate-200 hover:bg-slate-700 transition-all cursor-pointer font-bold"
              >
                Befund Speichern
              </button>

              <button
                onClick={handleAttachToGutachten}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Paperclip size={15} />
                <span>An Gutachten Anhängen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailView;
