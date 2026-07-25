import React, { useState } from 'react';
import {
  User,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Sparkles,
  ShieldAlert,
  Calendar,
  Building2,
  Plus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Demographics, DocumentItem } from '../types';
import { PrescriptionList } from '../components/PrescriptionList';

interface UploadPageProps {
  demographics: Demographics;
  setDemographics: React.Dispatch<React.SetStateAction<Demographics>>;
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  onStartScan: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  demographics,
  setDemographics,
  documents,
  setDocuments,
  onStartScan
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof Demographics, value: string) => {
    setDemographics((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newDocs: DocumentItem[] = Array.from(files).map((f, i) => ({
      id: `doc-custom-${Date.now()}-${i}`,
      name: f.name,
      type: f.type || 'application/pdf',
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toLocaleDateString('de-DE'),
      status: 'bereit',
      category: f.name.toLowerCase().includes('mrt')
        ? 'MRT'
        : f.name.toLowerCase().includes('ct')
        ? 'CT'
        : f.name.toLowerCase().includes('histo')
        ? 'Histologie'
        : f.name.toLowerCase().includes('labor')
        ? 'Labor'
        : 'Anamnese'
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const removeDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" pulse>
              Schritt 1 von 4
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              S2k Forensic Pipeline Init
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Patientendaten & Vorlageunterlagen
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Erfassen Sie die Stammdaten des Versicherten und laden Sie medizinische Befunde für die KI-Analyse hoch.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={<Sparkles className="w-5 h-5" />}
          onClick={onStartScan}
          disabled={documents.length === 0}
        >
          KI-SCAN STARTEN ({documents.length} Dokumente)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PATIENT STAMMDATEN FORM */}
        <div className="lg:col-span-6 space-y-6">
          <Card glow="cyan" className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs font-mono">
                <User className="w-4 h-4" />
                <span>Patienten-Stammdaten (Aktenzeichen: {demographics.caseId})</span>
              </div>
              <Badge variant="emerald">Identität verifiziert</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Vorname
                </label>
                <input
                  type="text"
                  value={demographics.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Nachname
                </label>
                <input
                  type="text"
                  value={demographics.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Geburtsdatum
                </label>
                <input
                  type="date"
                  value={demographics.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Geschlecht
                </label>
                <select
                  value={demographics.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as any)}
                  className="w-full bg-[#111217] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                >
                  <option value="männlich">männlich</option>
                  <option value="weiblich">weiblich</option>
                  <option value="divers">divers</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Versicherungsnummer
                </label>
                <input
                  type="text"
                  value={demographics.insuranceNumber}
                  onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Kostenträger
                </label>
                <input
                  type="text"
                  value={demographics.insuranceProvider}
                  onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Auftraggeber / Gericht / BG
                </label>
                <input
                  type="text"
                  value={demographics.commissioningEntity}
                  onChange={(e) => handleInputChange('commissioningEntity', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-mono mb-1 text-[11px] uppercase">
                  Wohnanschrift
                </label>
                <input
                  type="text"
                  value={demographics.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans"
                />
              </div>
            </div>
          </Card>

          {/* PRESCRIPTION SECTION FOR PATIENT */}
          <PrescriptionList
            patientId={demographics.caseId}
            patientName={`${demographics.firstName} ${demographics.lastName}`}
          />
        </div>

        {/* RIGHT COLUMN: DOCUMENT DROP ZONE & PRE-LOADED LIST */}
        <div className="lg:col-span-6 space-y-6">
          {/* DROP ZONE */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs font-mono">
                <Upload className="w-4 h-4" />
                <span>Dokumenten-Import (Drag & Drop)</span>
              </div>
              <Badge variant="cyan">{documents.length} Dokumente bereit</Badge>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,212,170,0.2)]'
                  : 'border-white/15 bg-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/5'
              }`}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = (e: any) => handleFileUpload(e.target.files);
                input.click();
              }}
            >
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-bold text-white">
                Befunde, MRT-Bilder oder Arztbriefe hier ablegen
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Unterstützt PDF, DICOM, TIFF, JPG (Max. 50 MB pro Datei)
              </p>
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">
                <Plus className="w-3.5 h-3.5" />
                Dateien Durchsuchen
              </span>
            </div>

            {/* PRE-LOADED DEMO DOCUMENTS LIST */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Geladene Vorlageakten ({documents.length}):
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-[10px] uppercase">
                        {doc.category}
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">
                          {doc.name}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" icon={<CheckCircle2 className="w-3 h-3" />}>
                        BEREIT
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDoc(doc.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Entfernen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
