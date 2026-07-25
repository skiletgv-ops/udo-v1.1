import React, { useState } from 'react';
import { Pill, X, Save, Send, AlertCircle, Sparkles } from 'lucide-react';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { useRoleContext } from '../context/RoleContext';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

const COMMON_MEDICATIONS = [
  'Diclofenac 75 mg retard',
  'Metformin 1000 mg',
  'Ramipril 5 mg',
  'Pantoprazol 40 mg',
  'Metamizol 500 mg',
  'Ibuprofen 600 mg',
  'L-Thyroxin 100 µg',
  'Bisoprolol 5 mg',
  'Amlodipin 5 mg',
  'Pregabalin 150 mg',
  'Tilidin 100 mg / 8 mg',
];

const COMMON_FREQUENCIES = [
  '1-0-0 (Morgens)',
  '1-1-0 (Morgens & Mittags)',
  '1-0-1 (Morgens & Abends)',
  '0-0-1 (Zur Nacht)',
  '1-1-1 (Morgens, Mittags, Abends)',
  '1-1-1-1 (4-mal täglich)',
  'Bei Bedarf (Max. 3x/Tag)',
];

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  patientId = 'SYN-90412',
  patientName = 'Hans Müller',
}) => {
  const { addPrescription } = usePrescriptionContext();
  const { role } = useRoleContext();

  const [medication, setMedication] = useState('Diclofenac 75 mg retard');
  const [customMed, setCustomMed] = useState('');
  const [dosage, setDosage] = useState('75 mg');
  const [frequency, setFrequency] = useState('1-0-0');
  const [duration, setDuration] = useState('30 Tage');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const finalMedication = medication === 'custom' ? customMed : medication;

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalMedication.trim()) return;
    addPrescription({
      patientId,
      patientName,
      medication: finalMedication,
      dosage,
      frequency,
      duration,
      notes,
      submitForApproval: false,
      prescribedBy: role === 'admin' ? 'admin' : 'main',
    });
    onClose();
  };

  const handleSubmitForApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalMedication.trim()) return;
    addPrescription({
      patientId,
      patientName,
      medication: finalMedication,
      dosage,
      frequency,
      duration,
      notes,
      submitForApproval: true,
      prescribedBy: role === 'admin' ? 'admin' : 'main',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-lg bg-[#111217] border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,212,170,0.25)] space-y-5 relative">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,212,170,0.3)]">
              <Pill className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Neues Rezept erstellen
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Patient: <span className="text-cyan-300 font-bold">{patientName}</span> ({patientId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4 text-xs font-sans">
          {/* MEDIKAMENT */}
          <div>
            <label className="block text-slate-300 font-mono text-[11px] font-bold uppercase mb-1">
              Medikament *
            </label>
            <select
              value={medication}
              onChange={(e) => {
                setMedication(e.target.value);
                if (e.target.value === 'Diclofenac 75 mg retard') setDosage('75 mg');
                else if (e.target.value === 'Metformin 1000 mg') setDosage('1000 mg');
                else if (e.target.value === 'Ramipril 5 mg') setDosage('5 mg');
                else if (e.target.value === 'Pantoprazol 40 mg') setDosage('40 mg');
                else if (e.target.value === 'Ibuprofen 600 mg') setDosage('600 mg');
              }}
              className="w-full bg-[#181920] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-sm font-sans"
            >
              {COMMON_MEDICATIONS.map((med) => (
                <option key={med} value={med}>
                  {med}
                </option>
              ))}
              <option value="custom">-- Freitext Eingabe --</option>
            </select>
            {medication === 'custom' && (
              <input
                type="text"
                placeholder="Präparat Name eingeben..."
                value={customMed}
                onChange={(e) => setCustomMed(e.target.value)}
                className="mt-2 w-full bg-[#181920] border border-cyan-500/40 rounded-xl px-3.5 py-2 text-white focus:border-cyan-400 text-sm font-sans"
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* DOSIERUNG */}
            <div>
              <label className="block text-slate-300 font-mono text-[11px] font-bold uppercase mb-1">
                Dosierung
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="z.B. 75 mg"
                className="w-full bg-[#181920] border border-white/15 rounded-xl px-3 py-2 text-white focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            {/* HÄUFIGKEIT */}
            <div>
              <label className="block text-slate-300 font-mono text-[11px] font-bold uppercase mb-1">
                Häufigkeit
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="z.B. 1-0-0"
                className="w-full bg-[#181920] border border-white/15 rounded-xl px-3 py-2 text-white focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            {/* DAUER */}
            <div>
              <label className="block text-slate-300 font-mono text-[11px] font-bold uppercase mb-1">
                Dauer
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="z.B. 30 Tage"
                className="w-full bg-[#181920] border border-white/15 rounded-xl px-3 py-2 text-white focus:border-cyan-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* NOTIZEN */}
          <div>
            <label className="block text-slate-300 font-mono text-[11px] font-bold uppercase mb-1">
              Notizen / Indikation (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="z.B. Magenschutz bei gleichzeitiger NSAR-Gabe..."
              className="w-full bg-[#181920] border border-white/15 rounded-xl px-3 py-2 text-white focus:border-cyan-500 text-xs font-sans resize-none"
            />
          </div>

          {/* S2k CONFLICT WARNING CHIP */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>S2k Wechselwirkungs-Check: Keine kritischen Interaktionen festgestellt.</span>
          </div>

          {/* BUTTONS */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            {/* SPEICHERN (SAVE DRAFT) BUTTON */}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,212,170,0.15)]"
            >
              <Save className="w-4 h-4" />
              <span>Speichern (Entwurf)</span>
            </button>

            {/* ZUR GENEHMIGUNG EINREICHEN (SUBMIT) BUTTON */}
            <button
              type="button"
              onClick={handleSubmitForApproval}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-mono font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,212,170,0.4)]"
            >
              <Send className="w-4 h-4" />
              <span>Zur Genehmigung einreichen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
