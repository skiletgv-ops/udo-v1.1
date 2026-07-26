import React, { useState } from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import {
  User,
  FileText,
  Pill,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Heart,
  ExternalLink
} from 'lucide-react';

export const IntakePage: React.FC = () => {
  const { addIntakeForm } = useUdoStore();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [insuranceType, setInsuranceType] = useState<'private' | 'gesetzlich'>('gesetzlich');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [telehealthConsent, setTelehealthConsent] = useState(false);
  const [dataSharingConsent, setDataSharingConsent] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientName = `${firstName} ${lastName}`.trim() || 'Neuer Patient';
    const patientId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;

    addIntakeForm({
      patientId,
      patientName,
      birthDate,
      insuranceType,
      medicalHistory,
      currentMedications,
      consents: {
        gdprConsent,
        telehealthConsent,
        dataSharingConsent
      },
      isSynthetic: true
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-bounce">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Anmeldung Erfolgreich</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Vielen Dank! Ihre Angaben wurden verschlüsselt an die Praxis Dr. med. Ulrike Bongartz übermittelt.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 text-left font-mono text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Versicherungsstatus:</span>
              <span className="text-cyan-300 font-bold uppercase">{insuranceType}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">In Bearbeitung (synthetic: true)</span>
            </div>
          </div>

          <a
            href="/calendar"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar size={18} />
            <span>Jetzt Termin Online Buchen</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center py-10 px-4 text-slate-100 font-sans">
      <div className="max-w-2xl w-full mx-auto bg-slate-900/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-teal-500" />

        {/* HEADER */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-[11px] font-mono uppercase tracking-wider font-bold">
            <Heart size={14} className="text-rose-400 animate-pulse" />
            <span>Praxis Dr. med. Ulrike Bongartz • Digital Intake</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Patienten-Aufnahmebogen & Anamnese
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Schritt {step} von 5: {step === 1 ? 'Persönliche Daten' : step === 2 ? 'Anamnese' : step === 3 ? 'Medikation' : step === 4 ? 'Versicherung' : 'Einwilligung'}
          </p>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* FORM STEPS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2">
                <User size={16} /> 1. Persönliche Daten
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Vorname *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="z.B. Thomas"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Nachname *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="z.B. Müller"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Geburtsdatum *</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Telefon / Mobil *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 170 1234567"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">E-Mail Adresse *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="thomas@example.de"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2">
                <FileText size={16} /> 2. Medizinische Vorgeschichte & Beschwerden
              </h2>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Aktuelle Hauptbeschwerden & Anamnese
                </label>
                <textarea
                  rows={5}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Beschreiben Sie Ihre Symptome, Dauer und Bisherige Behandlungen..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2">
                <Pill size={16} /> 3. Aktuelle Medikation
              </h2>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Welche Medikamente nehmen Sie regelmäßig ein?
                </label>
                <textarea
                  rows={5}
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="z.B. Ibuprofen 600mg 1-0-1, Metoprolol 50mg 1-0-0..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2">
                <ShieldCheck size={16} /> 4. Versicherungsart
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInsuranceType('gesetzlich')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    insuranceType === 'gesetzlich'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Gesetzlich Versichert</div>
                  <p className="text-[11px] font-mono text-slate-400">GKV mit Überweisung / eGK</p>
                </button>

                <button
                  type="button"
                  onClick={() => setInsuranceType('private')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    insuranceType === 'private'
                      ? 'bg-violet-500/20 border-violet-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Privat Versichert / Selbstzahler</div>
                  <p className="text-[11px] font-mono text-slate-400">PKV / Beihilfe / S2k Gutachten</p>
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2">
                <ShieldCheck size={16} /> 5. Datenschutz & Einwilligungen
              </h2>

              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-white/10 text-xs font-mono text-slate-300">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 accent-cyan-400 rounded"
                  />
                  <span>
                    Ich willige in die Verarbeitung meiner Gesundheitsdaten gemäß DSGVO für die neurologische Behandlung ein.*
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={telehealthConsent}
                    onChange={(e) => setTelehealthConsent(e.target.checked)}
                    className="mt-1 accent-cyan-400 rounded"
                  />
                  <span>
                    Ich stimme der Kontaktaufnahme per SMS / WhatsApp für Termin-Erinnerungen zu.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataSharingConsent}
                    onChange={(e) => setDataSharingConsent(e.target.checked)}
                    className="mt-1 accent-cyan-400 rounded"
                  />
                  <span>
                    Einwilligung zur elektronischen Übermittlung von Befunden an überweisende Ärzte.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} /> Zurück
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Weiter <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!gdprConsent}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(52,211,153,0.4)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Absenden & Buchen
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakePage;
