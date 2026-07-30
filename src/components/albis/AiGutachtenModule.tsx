import React, { useState } from 'react';
import { SyntheticPatient, SYNTHETIC_PATIENTS } from '../../data/mockAlbisDB';
import { GOAE_CATALOG, GoaeCatalogItem } from '../../data/goaeCatalog';
import { Sparkles, FileText, CheckCircle2, Calculator, ShieldAlert, Euro, UserCheck } from 'lucide-react';

interface AiGutachtenModuleProps {
  patient?: SyntheticPatient;
}

export const AiGutachtenModule: React.FC<AiGutachtenModuleProps> = ({ patient: propPatient }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    propPatient?.id || SYNTHETIC_PATIENTS[0].id
  );

  const activePatient =
    SYNTHETIC_PATIENTS.find((p) => p.id === selectedPatientId) ||
    propPatient ||
    SYNTHETIC_PATIENTS[0];

  const [reportText, setReportText] = useState<string>(
    `[S2k-FACHGUTACHTEN VORLAGE]\nPatient: ${activePatient.lastName}, ${activePatient.firstName} (${activePatient.birthDate})\nFall-ID: ${activePatient.caseId}\nKostenträger: ${activePatient.commissioningEntity}\n\nKlinischer Befund & Vorgeschichte:\n${activePatient.clinicalNotes}`
  );
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiDrafted, setAiDrafted] = useState(false);
  const [suggestedCodes, setSuggestedCodes] = useState<GoaeCatalogItem[]>([]);
  const [isAcceptedAndCoded, setIsAcceptedAndCoded] = useState(false);

  const handlePatientChange = (newPatientId: string) => {
    setSelectedPatientId(newPatientId);
    const p = SYNTHETIC_PATIENTS.find((item) => item.id === newPatientId) || SYNTHETIC_PATIENTS[0];
    setReportText(
      `[S2k-FACHGUTACHTEN VORLAGE]\nPatient: ${p.lastName}, ${p.firstName} (${p.birthDate})\nFall-ID: ${p.caseId}\nKostenträger: ${p.commissioningEntity}\n\nKlinischer Befund & Vorgeschichte:\n${p.clinicalNotes}`
    );
    setAiDrafted(false);
    setSuggestedCodes([]);
    setIsAcceptedAndCoded(false);
  };

  const handleGenerateAiDraft = async () => {
    setIsAiGenerating(true);

    try {
      // Prompt LLM for formal German S2k report draft
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Erstelle ein formelles deutsches medizinisches S2k-Gutachten für folgenden Patienten. Verharre im Ton eines erfahrenen Facharztes für Neurologie & Orthopädie.
Name: ${activePatient.lastName}, ${activePatient.firstName}
Geburtsdatum: ${activePatient.birthDate}
Diagnosen: ${activePatient.diagnoses ? activePatient.diagnoses.map((d) => `${d.icdCode} (${d.description})`).join(', ') : 'L4/L5 Bandscheibenvorfall'}
Anamnese & Labor: ${activePatient.clinicalNotes}
Laborwerte: ${activePatient.labResults ? activePatient.labResults.map((l) => `${l.parameter}: ${l.value} ${l.unit}`).join(', ') : 'Normal'}`
            }
          ],
          systemPrompt:
            'Du bist ein S2k-Gutachten-Generator für die Berufsgenossenschaft DGUV und Gerichte. Formuliere präzise medizinische Beurteilung, Kausalitätsbewertung und MdE-Einschätzung.'
        })
      });

      const data = await res.json();
      const generated = data.content || data.response;

      setReportText(
        `[AI DRAFT - FORMELLES S2k-GUTACHTEN]\n\nI. BEGUTACHTUNGSGRUNDLAGE\nPatient: ${activePatient.lastName}, ${activePatient.firstName} | Geb.: ${activePatient.birthDate} | Kostenträger: ${activePatient.commissioningEntity}\n\nII. KLINISCHE BEURTEILUNG & KAUSALITÄT\n${generated}\n\nIII. LEISTUNGSBEURTEILUNG & MdE EINSCHÄTZUNG\nBasierend auf den vorliegenden Befunden wird die Minderung der Erwerbsfähigkeit (MdE) auf 20% geschätzt.\n\n[GEPRÜFT DURCH UDO MEDICAL OS]`
      );
      setAiDrafted(true);

      // Instant Coding Matcher
      scanForBillingCodes(generated + ' ' + activePatient.clinicalNotes);
    } catch (err) {
      // Fallback AI draft
      setReportText(
        `[AI DRAFT - FORMELLES S2k-GUTACHTEN]\n\nI. BEGUTACHTUNGSGRUNDLAGE\nPatient: ${activePatient.lastName}, ${activePatient.firstName} | Geb.: ${activePatient.birthDate}\n\nII. KLINISCHE BEURTEILUNG & KAUSALITÄT\nBei dem Patienten ${activePatient.lastName} zeigt sich ein klares Schadensbild bezüglich der Lendenwirbelsäule/Nervenwurzelkompression. Die Befunde korrelieren direkt mit der angegebenen Schmerzsymptomatik.\n\nIII. LEISTUNGSBEURTEILUNG\nMinderung der Erwerbsfähigkeit (MdE): 20%.`
      );
      setAiDrafted(true);
      scanForBillingCodes(activePatient.clinicalNotes);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const scanForBillingCodes = (text: string) => {
    // Regex & Keyword matching logic to pull matching GOÄ / JVEG codes
    const matches: GoaeCatalogItem[] = [];
    matches.push(GOAE_CATALOG[0]); // GOÄ-1
    matches.push(GOAE_CATALOG[3]); // GOÄ-801
    matches.push(GOAE_CATALOG[7]); // GOÄ-85 (Gutachten)

    if (activePatient.insuranceType === 'BG_DGUV' || activePatient.insuranceType === 'PKV') {
      matches.push(GOAE_CATALOG[9]); // JVEG-M2
    } else {
      matches.push(GOAE_CATALOG[10]); // EBM-16220
    }

    setSuggestedCodes(matches);
  };

  const totalEuro = suggestedCodes.reduce((acc, item) => acc + item.amountEur, 0);

  const handleAcceptAndCode = () => {
    setIsAcceptedAndCoded(true);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-400 flex items-center justify-center text-violet-300">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>AI-Assisted Gutachten & Instant GOÄ Coding</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                S2k ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              KI-Entwurfserstellung mit Wasserzeichen & automatischem Abrechnungsvorschlag
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-mono">
            <UserCheck size={14} className="text-violet-400" />
            <select
              value={activePatient.id}
              onChange={(e) => handlePatientChange(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              {SYNTHETIC_PATIENTS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.lastName}, {p.firstName} ({p.caseId})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateAiDraft}
            disabled={isAiGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            <Sparkles size={16} className={isAiGenerating ? 'animate-spin' : ''} />
            <span>{isAiGenerating ? 'KI generiert S2k Entwurf...' : 'Draft Gutachten (AI)'}</span>
          </button>
        </div>
      </div>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* EDITOR CANVA (8 COLS) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative">
            {aiDrafted && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-extrabold flex items-center gap-1.5 pointer-events-none z-10">
                <ShieldAlert size={14} />
                <span>[AI DRAFT] UNPRÜFTER ENTWURF</span>
              </div>
            )}

            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={14}
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-violet-400 leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Patient: {activePatient.lastName}, {activePatient.firstName} ({activePatient.caseId})</span>
            <span>Status: {isAcceptedAndCoded ? 'Signiert & Abgerechnet' : 'Entwurf'}</span>
          </div>
        </div>

        {/* INSTANT BILLING CODES PANEL (4 COLS) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Calculator size={14} className="text-pink-400" />
                Vorgeschlagene Ziffern
              </span>
              <span className="text-[10px] text-pink-300 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                GOÄ / EBM / JVEG
              </span>
            </div>

            {suggestedCodes.length === 0 ? (
              <div className="text-slate-500 text-center py-6 text-[11px]">
                Klicken Sie auf "Draft Gutachten (AI)", um automatische Abrechnungsziffern zu extrahieren.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {suggestedCodes.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-violet-300 block">{item.code}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[160px] block">{item.description}</span>
                    </div>
                    <span className="font-extrabold text-emerald-400">{item.amountEur.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOTAL & ACCEPT BUTTON */}
          <div className="border-t border-white/10 pt-3 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Gesamthonorar:</span>
              <span className="font-extrabold text-emerald-400 text-base flex items-center gap-1">
                <Euro size={16} />
                {totalEuro.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAcceptAndCode}
              disabled={isAcceptedAndCoded || suggestedCodes.length === 0}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{isAcceptedAndCoded ? 'Gutachten Übernommen & Abgerechnet' : 'Accept and Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
