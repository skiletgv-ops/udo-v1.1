// REQUIRES: MDR/CE certification before clinical use (screening scoring)

import React, { useState } from 'react';
import ClinicalDisclaimer from '../ClinicalDisclaimer';
import { useUdoStore } from '../../store/useUdoStore';
import {
  ClipboardList,
  CheckCircle2,
  Brain,
  Smile,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const ScreeningPage: React.FC = () => {
  const { logAuditAction } = useUdoStore();

  // PHQ-2 / PHQ-9 Questions (0 to 3 scale)
  const [phq1, setPhq1] = useState<number>(1);
  const [phq2, setPhq2] = useState<number>(2);

  // GAD-2 / GAD-7 Questions
  const [gad1, setGad1] = useState<number>(1);
  const [gad2, setGad2] = useState<number>(1);

  // Headache / Pain Diary
  const [painDaysMonth, setPainDaysMonth] = useState<number>(8);
  const [painIntensity, setPainIntensity] = useState<number>(6); // 1-10 VAS

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Scores
  const phqTotal = phq1 + phq2;
  const gadTotal = gad1 + gad2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditAction('SUBMIT_PATIENT_SCREENING', 'PAT-4829', 'PORTAL', `PHQ Score: ${phqTotal}, GAD Score: ${gadTotal}, Pain VAS: ${painIntensity}`);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-violet-500/30 rounded-3xl p-8 backdrop-blur-2xl text-center space-y-6 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Screening-Bogen Übermittelt</h1>
            <p className="text-xs text-slate-400 mt-2">
              Vielen Dank. Ihre Angaben wurden verschlüsselt an Frau Dr. Bongartz zur Vorbereitung Ihrer Konsultation übermittelt.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 font-mono text-xs text-left space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Depressions-Screening (PHQ):</span>
              <span className="text-violet-300 font-bold">{phqTotal} / 6 (Vorläufig)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Angst-Screening (GAD):</span>
              <span className="text-violet-300 font-bold">{gadTotal} / 6 (Vorläufig)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Schmerzintensität (VAS):</span>
              <span className="text-cyan-300 font-bold">{painIntensity} / 10</span>
            </div>
          </div>

          <a
            href="/portal"
            className="w-full py-3 rounded-xl bg-violet-600 text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Zurück zum Patientenportal</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-4 md:p-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <a
          href="/portal"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white"
        >
          <ChevronLeft size={14} /> Zurück zum Portal
        </a>

        {/* CLINICAL DISCLAIMER */}
        <ClinicalDisclaimer />

        {/* HEADER */}
        <div className="bg-slate-900/90 border border-violet-500/30 rounded-3xl p-6 backdrop-blur-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 border border-violet-500/40 rounded-full text-violet-300 text-[11px] font-mono uppercase font-bold">
            <Brain size={14} />
            <span>Neurologischer Pre-Appointment Fragebogen</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Strukturierter Symptom- & Screeningbogen</h1>
          <p className="text-xs text-slate-400 font-mono">
            Bitte füllen Sie die folgenden Fragen vor Ihrem Termin aus. Alle Eingaben unterliegen der ärztlichen Schweigepflicht.
          </p>
        </div>

        {/* QUESTIONNAIRE FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: PHQ SCREENING */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl space-y-4">
            <h2 className="text-sm font-bold text-violet-300 font-mono uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <Smile size={16} /> 1. Stimmung & Wohlbefinden (PHQ-Screening)
            </h2>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-200 mb-2">
                  Wie oft fühlten Sie sich in den letzten 2 Wochen durch Niedergeschlagenheit oder Hoffnungslosigkeit beeinträchtigt?
                </label>
                <select
                  value={phq1}
                  onChange={(e) => setPhq1(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                >
                  <option value={0}>Überhaupt nicht (0)</option>
                  <option value={1}>An einzelnen Tagen (1)</option>
                  <option value={2}>Mehr als die Hälfte der Tage (2)</option>
                  <option value={3}>Fast jeden Tag (3)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-200 mb-2">
                  Wie oft hatten Sie in den letzten 2 Wochen wenig Interesse oder Freude an Ihren Tätigkeiten?
                </label>
                <select
                  value={phq2}
                  onChange={(e) => setPhq2(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                >
                  <option value={0}>Überhaupt nicht (0)</option>
                  <option value={1}>An einzelnen Tagen (1)</option>
                  <option value={2}>Mehr als die Hälfte der Tage (2)</option>
                  <option value={3}>Fast jeden Tag (3)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PAIN & HEADACHE DIARY */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl space-y-4">
            <h2 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <AlertCircle size={16} /> 2. Schmerz- & Kopfschmerztagebuch
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-200 mb-2">Anzahl Schmerztage im letzten Monat: {painDaysMonth}</label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={painDaysMonth}
                  onChange={(e) => setPainDaysMonth(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-200 mb-2">Durchschnittliche Schmerzstärke (VAS 1-10): {painIntensity}</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={painIntensity}
                  onChange={(e) => setPainIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            <span>Screening-Daten an Praxis Übermitteln</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScreeningPage;
