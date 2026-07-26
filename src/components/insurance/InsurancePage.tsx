import React, { useState } from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import {
  UploadCloud,
  FileCheck2,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Paperclip,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';

interface InsuranceDoc {
  id: string;
  patientId: string;
  patientName: string;
  docType: 'Kostenübernahme' | 'Versicherungskarte' | 'Privatärztlicher Beihilfeantrag';
  fileName: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_follow_up';
  notes?: string;
}

export const InsurancePage: React.FC = () => {
  const { logAuditAction } = useUdoStore();

  const [docs, setDocs] = useState<InsuranceDoc[]>([
    {
      id: 'ins-1',
      patientId: 'PAT-4829',
      patientName: 'Thomas Müller',
      docType: 'Kostenübernahme',
      fileName: 'kostenuebernahme_pkv_debeka.pdf',
      uploadedAt: '2026-07-25T10:30:00Z',
      status: 'approved',
      notes: 'Zusage für S2k Gutachten & stationäre Abklärung erteilt (Aktenzeichen: PKV-89211).'
    },
    {
      id: 'ins-2',
      patientId: 'PAT-1092',
      patientName: 'Sabine Weber',
      docType: 'Versicherungskarte',
      fileName: 'egk_scan_weber.pdf',
      uploadedAt: '2026-07-26T08:00:00Z',
      status: 'pending',
      notes: 'eGK Auslesen ausstehend - Online-Abgleich VSDM.'
    },
    {
      id: 'ins-3',
      patientId: 'PAT-3381',
      patientName: 'Klaus Hoffmann',
      docType: 'Privatärztlicher Beihilfeantrag',
      fileName: 'beihilfe_antrag_becker.pdf',
      uploadedAt: '2026-07-24T15:20:00Z',
      status: 'needs_follow_up',
      notes: 'Beihilfe verlangt zusätzliche Begründung für GOÄ-Faktor 3.5.'
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState('PAT-4829');
  const [docType, setDocType] = useState<'Kostenübernahme' | 'Versicherungskarte' | 'Privatärztlicher Beihilfeantrag'>('Kostenübernahme');
  const [uploadFileName, setUploadFileName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;

    const newDoc: InsuranceDoc = {
      id: `ins-${Date.now()}`,
      patientId: selectedPatientId,
      patientName: selectedPatientId === 'PAT-4829' ? 'Thomas Müller' : 'Klaus Hoffmann',
      docType,
      fileName: uploadFileName,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      notes: 'Dokument hochgeladen. Sachbearbeiter-Prüfung ausstehend.'
    };

    setDocs([newDoc, ...docs]);
    setUploadFileName('');
    logAuditAction('UPLOAD_INSURANCE_DOC', selectedPatientId, 'INSURANCE', `Uploaded ${docType}: ${uploadFileName}`);
  };

  const getStatusBadge = (status: InsuranceDoc['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock size={12} className="animate-pulse" /> Pending
          </span>
        );
      case 'needs_follow_up':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <AlertTriangle size={12} /> Needs Follow-up
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle size={12} /> Rejected
          </span>
        );
    }
  };

  const filteredDocs = docs.filter((d) => filterStatus === 'all' || d.status === filterStatus);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="text-cyan-400" />
            <span>Versicherungs- & Kostenübernahme Management</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Dokumenten-Upload & Status-Tracker (GKV / PKV / Beihilfe / Kostenträger)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* UPLOAD FORM */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2 border-b border-white/10 pb-3">
            <UploadCloud size={16} className="text-cyan-400" />
            <span>Neues Dokument Hochladen</span>
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="PAT-4829">Thomas Müller (PAT-4829)</option>
                <option value="PAT-1092">Sabine Weber (PAT-1092)</option>
                <option value="PAT-3381">Klaus Hoffmann (PAT-3381)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Dokument-Typ</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="Kostenübernahme">Kostenübernahmeerklärung</option>
                <option value="Versicherungskarte">Versicherungskarte (eGK / PKV)</option>
                <option value="Privatärztlicher Beihilfeantrag">Privatärztlicher Beihilfeantrag</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Dateiname / Pfad</label>
              <input
                type="text"
                required
                placeholder="z.B. kostenuebernahme_pkv_2026.pdf"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UploadCloud size={16} />
              <span>An Patientenakte Anheften</span>
            </button>
          </form>
        </div>

        {/* STATUS TRACKER TABLE */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Paperclip size={16} className="text-violet-400" />
              <span>Status-Tracker & Kostenträger-Historie</span>
            </h2>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value="all">Alle Status</option>
              <option value="pending font-mono">Pending</option>
              <option value="approved font-mono">Approved</option>
              <option value="needs_follow_up font-mono">Needs Follow-up</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredDocs.map((d) => (
              <div
                key={d.id}
                className="p-4 bg-slate-950/70 border border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-sans hover:border-cyan-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span>{d.patientName}</span>
                    <span className="text-[10px] font-mono text-slate-500">({d.patientId})</span>
                  </div>
                  <div className="text-xs text-cyan-300 font-mono flex items-center gap-1.5">
                    <Paperclip size={12} /> {d.docType}: <span className="text-slate-300 font-normal">{d.fileName}</span>
                  </div>
                  {d.notes && <p className="text-[11px] text-slate-400 font-mono mt-1">{d.notes}</p>}
                </div>

                <div className="flex flex-col md:items-end gap-1 shrink-0">
                  {getStatusBadge(d.status)}
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(d.uploadedAt).toLocaleString('de-DE')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage;
