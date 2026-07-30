import React, { useState } from 'react';
import { SyntheticPatient, SYNTHETIC_PATIENTS } from '../../data/mockAlbisDB';
import { ShieldAlert, FileCheck2, Download, AlertOctagon, CheckCircle2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export const IntelligentTriageModule: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<SyntheticPatient>(SYNTHETIC_PATIENTS[0]);
  const [generatedPdf, setGeneratedPdf] = useState(false);

  const highTriageList = SYNTHETIC_PATIENTS.filter((p) => p.triagePriority === 'High');

  const downloadPriorAuthPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('DGUV / BG KOSTENÜBERNAHME-ANTRAG (PRIOR AUTH)', 14, 20);

    doc.setFontSize(11);
    doc.text(`Patient: ${selectedPatient.lastName}, ${selectedPatient.firstName}`, 14, 32);
    doc.text(`Geburtsdatum: ${selectedPatient.birthDate}`, 14, 40);
    doc.text(`Versicherungs-ID: ${selectedPatient.insuranceNumber} (${selectedPatient.insuranceType})`, 14, 48);
    doc.text(`Fallnummer: ${selectedPatient.caseId}`, 14, 56);
    doc.text(`Kostenträger: ${selectedPatient.commissioningEntity}`, 14, 64);

    doc.line(14, 70, 196, 70);

    doc.setFontSize(12);
    doc.text('Dringlichkeits-Einstufung & Medizinische Indikation:', 14, 80);
    doc.setFontSize(10);
    doc.text(`Priorität: ${selectedPatient.triagePriority} (KI Triage Evaluierung)`, 14, 88);
    doc.text(`Anlass: ${selectedPatient.triageReason}`, 14, 96, { maxWidth: 170 });

    doc.text('Diagnosen:', 14, 115);
    selectedPatient.diagnoses.forEach((d, idx) => {
      doc.text(`- ${d.icdCode}: ${d.description}`, 20, 123 + idx * 8);
    });

    doc.text('DGUV Eilantrag auf Kostenübernahme für Notfall-Begutachtung & OP-Freigabe.', 14, 150);
    doc.text('Ausgestellt durch UDO Medical OS System', 14, 160);

    doc.save(`Kostenuebernahme_${selectedPatient.lastName}_${selectedPatient.caseId}.pdf`);
    setGeneratedPdf(true);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-400 flex items-center justify-center text-rose-300">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Intelligent Patient Triage & Prior Auth</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                NLP SCANNER
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              KI-Erkennung von Notfall-Überweisungen & automatische Kostenübernahme PDF-Erstellung
            </p>
          </div>
        </div>
      </div>

      {/* TRIAGE FEED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* HIGH PRIORITY PATIENT LIST (5 COLS) */}
        <div className="lg:col-span-5 p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3 font-mono text-xs">
          <span className="font-bold text-rose-300 uppercase text-[11px] flex items-center gap-1.5 border-b border-white/10 pb-2">
            <AlertOctagon size={14} /> Priority Triage Feed ({highTriageList.length})
          </span>

          <div className="space-y-2">
            {highTriageList.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedPatient.id === p.id
                    ? 'bg-rose-950/40 border-rose-500/50 text-white'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:border-rose-500/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{p.lastName}, {p.firstName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    HIGH TRIAGE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {p.triageReason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRIOR AUTH FORM GENERATOR (7 COLS) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-4 font-mono text-xs">
          <div className="border-b border-white/10 pb-2 flex justify-between items-center">
            <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
              <FileCheck2 size={14} className="text-cyan-400" /> Auto-Kostenübernahme Formular
            </span>
            <span className="text-[10px] text-cyan-300">{selectedPatient.caseId}</span>
          </div>

          <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-white/5 text-[11px]">
            <div><strong className="text-slate-400">Patient:</strong> {selectedPatient.lastName}, {selectedPatient.firstName} ({selectedPatient.birthDate})</div>
            <div><strong className="text-slate-400">Versicherungs-ID:</strong> {selectedPatient.insuranceNumber} ({selectedPatient.insuranceType})</div>
            <div><strong className="text-slate-400">Kostenträger:</strong> {selectedPatient.commissioningEntity}</div>
            <div><strong className="text-slate-400">Indikation:</strong> {selectedPatient.triageReason}</div>
          </div>

          <button
            onClick={downloadPriorAuthPdf}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download size={16} />
            <span>Kostenübernahme PDF Generieren & Herunterladen</span>
          </button>

          {generatedPdf && (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 size={14} /> Kostenübernahme PDF erfolgreich generiert und heruntergeladen!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
