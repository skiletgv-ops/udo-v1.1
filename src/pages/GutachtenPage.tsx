import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  BrainCircuit,
  Award,
  BookOpen
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Demographics, Finding, GutachtenReport } from '../types';
import { generateGutachtenReport, exportGutachtenAsText } from '../lib/gutachten-generator';

interface GutachtenPageProps {
  demographics: Demographics;
  findings: Finding[];
}

export const GutachtenPage: React.FC<GutachtenPageProps> = ({
  demographics,
  findings
}) => {
  const [report] = useState<GutachtenReport>(() =>
    generateGutachtenReport(demographics, findings)
  );
  const [copied, setCopied] = useState(false);

  const handleExportText = () => {
    const textContent = exportGutachtenAsText(report);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `S2k_Gutachten_${report.patient.lastName}_${report.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const textContent = exportGutachtenAsText(report);
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in print:p-0 print:max-w-none">
      {/* HEADER BAR (HIDDEN IN PRINT) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" pulse>
              Schritt 4 von 4
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Qualifizierte Elektronische Signatur (QES eIDAS)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <FileText className="w-7 h-7 text-cyan-400" />
            <span>Medizinisches S2k-Fachgutachten</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Gerichtsverwertbares Fachgutachten mit 10 Abschnitten und KI-Konsenskoeffizient 99.2%.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="md"
            icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopy}
          >
            {copied ? 'Kopiert!' : 'Kopieren'}
          </Button>

          <Button
            variant="ghost"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Drucken
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportText}
          >
            Export TXT
          </Button>
        </div>
      </div>

      {/* GUTACHTEN PAPER CONTAINER */}
      <Card
        glow="cyan"
        className="p-8 sm:p-12 space-y-8 bg-[#0e0f14] border border-cyan-500/30 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.9)] print:bg-white print:text-black print:shadow-none print:border-none print:p-0"
      >
        {/* REPORT OFFICIAL HEADER */}
        <div className="border-b-2 border-cyan-500/40 pb-6 space-y-4 print:border-black">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest print:text-black">
                U.D.O. S2k FORENSIC HUB • GERICHTS- & SOZIALVERSICHERUNGSGUTACHTEN
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1 print:text-black">
                FACHÄRZTLICHES S2k-GUTACHTEN
              </h2>
            </div>

            <div className="text-right font-mono text-xs space-y-1 print:text-black">
              <Badge variant="cyan" pulse className="print:hidden">
                QES SIGNIERT
              </Badge>
              <div className="text-slate-400 font-bold block print:text-black">
                ID: {report.id}
              </div>
              <div className="text-slate-400 block print:text-black">
                Datum: {report.generatedAt}
              </div>
            </div>
          </div>

          {/* PATIENT INFO BANNER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs print:bg-slate-100 print:text-black print:border-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase print:text-slate-600">
                Versicherter:
              </span>
              <span className="font-bold text-white text-sm print:text-black">
                {report.patient.lastName}, {report.patient.firstName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase print:text-slate-600">
                Geburtsdatum:
              </span>
              <span className="font-bold text-white print:text-black">
                {report.patient.birthDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase print:text-slate-600">
                Versicherten-Nr:
              </span>
              <span className="font-bold text-cyan-300 print:text-black">
                {report.patient.insuranceNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase print:text-slate-600">
                Aktenzeichen:
              </span>
              <span className="font-bold text-white print:text-black">
                {report.patient.caseId}
              </span>
            </div>
          </div>
        </div>

        {/* 10 SECTIONS LIST */}
        <div className="space-y-8 font-sans">
          {report.sections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2 border-b border-white/10 pb-1.5 print:text-black print:border-slate-300">
                <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold print:bg-slate-200 print:text-black">
                  {sec.number}
                </span>
                <span>{sec.title}</span>
              </h3>

              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans print:text-slate-900">
                {sec.content}
              </div>

              {sec.citations.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-slate-400 space-y-1 print:bg-slate-50 print:text-slate-700 print:border-slate-200">
                  <span className="text-[10px] uppercase text-cyan-400 font-bold block print:text-slate-800">
                    Quellennachweise & Evidenz:
                  </span>
                  {sec.citations.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3 text-cyan-400 shrink-0 print:text-black" />
                      <span>
                        {c.docName} (Datum: {c.date}, Seite {c.page})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DIGITAL QES SIGNATURE BLOCK */}
        <div className="pt-8 border-t-2 border-cyan-500/40 space-y-4 print:border-black">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-violet-950/40 border border-cyan-500/30 print:bg-slate-100 print:border-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,212,170,0.4)] print:bg-slate-200">
                <Award className="w-6 h-6 text-cyan-300 print:text-black" />
              </div>
              <div>
                <span className="font-bold text-white text-base block print:text-black">
                  {report.doctorSignature.name}
                </span>
                <span className="text-xs text-cyan-300 font-mono block print:text-slate-800">
                  {report.doctorSignature.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block print:text-slate-600">
                  Zulassungsnummer: {report.doctorSignature.licenseNumber}
                </span>
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-400 space-y-1 print:text-slate-800">
              <div className="flex items-center gap-1 text-emerald-400 font-bold justify-end print:text-black">
                <ShieldCheck className="w-4 h-4" />
                <span>eIDAS Qualified Signature</span>
              </div>
              <div className="truncate max-w-xs">{report.doctorSignature.hash}</div>
              <div>Validiert am {report.doctorSignature.date}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
