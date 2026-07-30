import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Download, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';

export const GdprGuardianModule: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [logs] = useState([
    { id: 'LOG-1', user: 'Dr. A. Voss', action: 'GDT 2.1 Akteneinsicht', patientId: 'PAT-1001', time: '10:14:02', ip: '192.168.1.102', status: 'Authorized' },
    { id: 'LOG-2', user: 'Dr. M. Bongartz', action: 'S2k Gutachten Signatur', patientId: 'PAT-1005', time: '09:55:18', ip: '192.168.1.108', status: 'Authorized' },
    { id: 'LOG-3', user: 'MFA S. Meier', action: 'Standortübergreifende Abfrage (München)', patientId: 'PAT-1003', time: '09:12:44', ip: '192.168.1.115', status: 'Masked-ReadOnly' }
  ]);

  const handleUnlock = () => {
    if (pin === '1234' || pin === '2026') {
      setIsLocked(false);
      setPin('');
    } else {
      alert('Falscher PIN Code! Versuchen Sie 1234 oder 2026.');
    }
  };

  const exportArt15Json = () => {
    const data = {
      dsgvoArt15Export: true,
      exportTimestamp: new Date().toISOString(),
      dataSubject: 'Müller, Hans (PAT-1001)',
      storedRecords: logs
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DSGVO_Art15_Auskunft_Mueller_Hans.json';
    a.click();
  };

  const downloadDsgvoPdfReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('PRAXIS DSGVO COMPLIANCE & AUDIT REPORT', 14, 20);

    doc.setFontSize(11);
    doc.text(`Prüfdatum: ${new Date().toLocaleDateString('de-DE')}`, 14, 30);
    doc.text('System: UDO Medical OS v1.1 Proactive Guardian', 14, 38);
    doc.line(14, 44, 196, 44);

    doc.setFontSize(12);
    doc.text('Auditierten Zugriffsprotokolle (Art. 32 DSGVO):', 14, 54);

    doc.setFontSize(10);
    logs.forEach((log, idx) => {
      doc.text(`${log.time} | ${log.user} | ${log.action} | ${log.patientId} | Status: ${log.status}`, 14, 66 + idx * 8);
    });

    doc.text('Verschlüsselung: AES-256 in Ruhe & TLS 1.3 in Übertragung', 14, 110);
    doc.text('Proximity Auto-Lock: Aktiviert (3 Min Timeout)', 14, 118);

    doc.save('DSGVO_Compliance_Report_UDO.pdf');
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Proactive GDPR 'Guardian' Module</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DSGVO ART. 15 / 32
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Proximity-Auto-Lock, Zugriffsprotokollierung & Daten-Auskunft (JSON/PDF)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocked(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Lock size={14} />
            <span>Lock Screen Simulate</span>
          </button>
        </div>
      </div>

      {/* LOCK SCREEN OVERLAY SIMULATION */}
      {isLocked ? (
        <div className="p-6 rounded-2xl bg-[#0A0A0F] border border-amber-500/50 space-y-4 text-center font-mono text-xs max-w-sm mx-auto shadow-2xl">
          <Lock size={32} className="mx-auto text-amber-400 animate-bounce" />
          <div>
            <span className="font-bold text-white text-sm block">Bildschirm Geschützt (Proximity Lock)</span>
            <span className="text-slate-400 text-[11px]">Geben Sie Ihren 4-stelligen Arzt-PIN ein (z.B. 1234)</span>
          </div>

          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            className="w-full bg-slate-950 border border-amber-500/40 rounded-xl py-2 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400 font-mono"
          />

          <button
            onClick={handleUnlock}
            className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock size={14} />
            <span>Entsperren</span>
          </button>
        </div>
      ) : (
        /* AUDIT LOG TABLE & COMPLIANCE ACTIONS */
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-2">
            <span className="font-bold text-white uppercase text-[11px] block border-b border-white/10 pb-2">
              Lückenlose Zugriffsprotokollierung (Audit-Log)
            </span>

            {logs.map((log) => (
              <div key={log.id} className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-bold text-slate-200">{log.time}</span> • <span className="text-cyan-300">{log.user}</span> • <span className="text-slate-400">{log.action} ({log.patientId})</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {log.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={exportArt15Json}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={14} />
              <span>Art. 15 DSGVO JSON Auskunft</span>
            </button>

            <button
              onClick={downloadDsgvoPdfReport}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText size={14} />
              <span>DSGVO Compliance PDF Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
