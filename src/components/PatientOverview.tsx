import React, { useState } from 'react';
import {
  UserCheck,
  FileText,
  BrainCircuit,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Microscope,
  Stethoscope,
  BookOpen,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  User,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ActiveTab, Demographics, DocumentItem, AIAgent } from '../types';
import { triggerAudioCue } from '../services/audioFeedbackService';

export interface PatientOverviewProps {
  demographics?: Demographics;
  documents?: DocumentItem[];
  agents?: AIAgent[];
  onSelectTab?: (tab: ActiveTab) => void;
  onClose?: () => void;
  isModal?: boolean;
}

// Preset demo patients for quick switching
const DEMO_PATIENTS = [
  {
    id: 'PAT-88492',
    name: 'Dr. med. Erika Becker',
    birthDate: '14.03.1978',
    insurance: 'Techniker Krankenkasse (GKV)',
    caseId: 'S2K-2026-9921',
    diagnosis: 'Pharmakoresistente fokale Epilepsie (ICD G40.2)',
    riskLevel: 'Kritisch / QS-Audit erforderlich',
    activeDocsCount: 5,
    pendingApprovalsCount: 2,
    scanProgress: 100
  },
  {
    id: 'PAT-77120',
    name: 'Thomas Schmidt',
    birthDate: '02.11.1965',
    insurance: 'Barmer GEK',
    caseId: 'S2K-2026-4410',
    diagnosis: 'Somatoforme autonome Funktionsstörung (ICD F45.3)',
    riskLevel: 'Normal / S2k Abnahme bereit',
    activeDocsCount: 3,
    pendingApprovalsCount: 1,
    scanProgress: 85
  },
  {
    id: 'PAT-90311',
    name: 'Sabine Weber',
    birthDate: '28.07.1989',
    insurance: 'AOK Bayern',
    caseId: 'S2K-2026-1184',
    diagnosis: 'Migräne ohne Aura (ICD G43.0)',
    riskLevel: 'Abgeschlossen',
    activeDocsCount: 4,
    pendingApprovalsCount: 0,
    scanProgress: 100
  }
];

export const PatientOverview: React.FC<PatientOverviewProps> = ({
  demographics,
  documents = [],
  agents = [],
  onSelectTab,
  onClose,
  isModal = false
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const activePatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];

  // Default sample active documents if not passed
  const displayDocs =
    documents.length > 0
      ? documents
      : [
          {
            id: 'doc-1',
            name: 'MRT_Gehirn_3T_T2_FLAIR.pdf',
            type: 'MRT',
            size: '14.2 MB',
            uploadDate: '28.07.2026',
            status: 'bereit' as const,
            category: 'MRT' as const
          },
          {
            id: 'doc-2',
            name: 'EEG_Langzeit_24h_Protokoll.pdf',
            type: 'EEG',
            size: '8.7 MB',
            uploadDate: '28.07.2026',
            status: 'bereit' as const,
            category: 'Sonstiges' as const
          },
          {
            id: 'doc-3',
            name: 'Arztbrief_Neurologie_Charite.pdf',
            type: 'Anamnese',
            size: '2.4 MB',
            uploadDate: '27.07.2026',
            status: 'bereit' as const,
            category: 'Anamnese' as const
          },
          {
            id: 'doc-4',
            name: 'Labor_Serum_Antiepileptika_Spiegel.pdf',
            type: 'Labor',
            size: '1.1 MB',
            uploadDate: '26.07.2026',
            status: 'bereit' as const,
            category: 'Labor' as const
          }
        ];

  // Default AI Agents status
  const defaultAgentStatus = [
    {
      id: 'clara',
      name: 'Dr. Clara Voss',
      specialty: 'Konsil Anamnese & Befunde',
      icon: Activity,
      color: 'text-cyan-400',
      progress: 100,
      status: 'complete',
      findingsCount: 4,
      confidence: 98
    },
    {
      id: 'eric',
      name: 'Dr. Eric Thorne',
      specialty: 'Interaktions- & Medikationsanalyse',
      icon: Microscope,
      color: 'text-violet-400',
      progress: 100,
      status: 'complete',
      findingsCount: 2,
      confidence: 96
    },
    {
      id: 'marcel',
      name: 'Dr. Marcel Richter',
      specialty: 'Differentialdiagnostik S2k',
      icon: Stethoscope,
      color: 'text-cyan-400',
      progress: activePatient.scanProgress,
      status: activePatient.scanProgress === 100 ? 'complete' : 'scanning',
      findingsCount: 3,
      confidence: 94
    },
    {
      id: 'hannes',
      name: 'Prof. Hannes Weber',
      specialty: 'EEG Signal Core & AWMF Normen',
      icon: BookOpen,
      color: 'text-violet-400',
      progress: 100,
      status: 'complete',
      findingsCount: 3,
      confidence: 99
    }
  ];

  // Sample pending approvals for current patient
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'app-1',
      title: 'BTM-Rezept Sperren-Prüfung (Levetiracetam 1000mg)',
      type: 'Rezeptsperre',
      urgency: 'Hoch',
      date: 'Heute, 11:20',
      requestedBy: 'System / Pharmakologie-Agent'
    },
    {
      id: 'app-2',
      title: 'S2k Gutachten Entwurf ärztliche Gegenzeichnung',
      type: 'KBV Gutachten',
      urgency: 'Mittel',
      date: 'Gestern, 16:45',
      requestedBy: 'MFA Intake Stufe 2'
    }
  ]);

  const handleApprove = (id: string, title: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    triggerAudioCue(
      'approval-complete',
      'Freigabe Erteilt',
      `Genehmigung für "${title}" wurde erfolgreich erteilt.`
    );
  };

  const currentPatientName = demographics
    ? `${demographics.firstName} ${demographics.lastName}`
    : activePatient.name;

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* HEADER BAR WITH PATIENT SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d0e15] border border-cyan-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-0.5 shadow-[0_0_20px_rgba(0,212,170,0.4)] shrink-0">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 uppercase tracking-wider">
                Pat-ID: {activePatient.id}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Fall-Nr: {demographics?.caseId || activePatient.caseId}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
              {currentPatientName}
            </h2>
          </div>
        </div>

        {/* DEMO PATIENT SELECTOR */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold hidden sm:inline">
            Patient Wechseln:
          </span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-white/5 border border-white/10 hover:border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0f1017] text-slate-200">
                {p.name} ({p.id})
              </option>
            ))}
          </select>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
              title="Schließen"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* METRIC CHIPS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Geburtsdatum</span>
            <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {demographics?.birthDate || activePatient.birthDate}
            </span>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300">
            {demographics?.gender || 'weiblich'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Kostenträger</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 truncate max-w-[150px]">
              <Building2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              {demographics?.insuranceProvider || activePatient.insurance}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
            GKV
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-cyan-400 uppercase block font-bold">Aktive Dokumente</span>
            <span className="text-lg font-black text-cyan-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              {displayDocs.length} Akten
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
            Audit OK
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400 uppercase block font-bold">Ausstehende Freigaben</span>
            <span className="text-lg font-black text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {pendingApprovals.length} Offen
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            pendingApprovals.length > 0 ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {pendingApprovals.length > 0 ? 'Aktion Nötig' : 'Keine'}
          </span>
        </div>
      </div>

      {/* MAIN TWO COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ACTIVE DOCUMENTS & RECENT SCANS STATUS */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4-KI SPECIALIST AGENT SCAN STATUS */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="font-mono text-sm font-extrabold text-white uppercase tracking-wider">
                  4-KI-Agenten Consensus Status
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab && onSelectTab('scan')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
              >
                Scan öffnen <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {defaultAgentStatus.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${agent.color}`} />
                        <div>
                          <span className="font-bold text-xs text-white block leading-tight">
                            {agent.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {agent.specialty}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={agent.status === 'complete' ? 'cyan' : 'violet'}
                      >
                        {agent.status === 'complete' ? '100% Ready' : 'Analyse...'}
                      </Badge>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-violet-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-0.5">
                      <span>Befunde: {agent.findingsCount}</span>
                      <span>Konfidenz: {agent.confidence}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ACTIVE DOCUMENTS SUMMARY */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-violet-400" />
                <h3 className="font-mono text-sm font-extrabold text-white uppercase tracking-wider">
                  Aktive Akten & Dokumente ({displayDocs.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab && onSelectTab('documents')}
                className="text-xs font-mono text-violet-400 hover:text-violet-300"
              >
                Audit-Pipeline <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-2">
              {displayDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3 font-mono"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white truncate block">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{doc.category}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Geprüft (S2k)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PENDING APPROVALS & QUICK ACTIONS */}
        <div className="space-y-6">
          {/* PENDING APPROVALS QUEUE */}
          <Card className="p-5 space-y-4 border-amber-500/30 bg-gradient-to-b from-amber-950/10 to-transparent">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-mono text-sm font-extrabold text-white uppercase tracking-wider">
                  Ausstehende Genehmigungen
                </h3>
              </div>
              <Badge variant="amber">
                {pendingApprovals.length} Offen
              </Badge>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/5 text-center font-mono text-xs text-slate-400 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-emerald-300">Alle Genehmigungen Erteilt</p>
                <p className="text-[10px] text-slate-500">Keine ausstehenden Freigaben für diesen Patienten.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-amber-500/20 space-y-2.5 font-mono text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white leading-snug">{app.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30 shrink-0">
                        {app.urgency}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <div>Anforderer: {app.requestedBy}</div>
                      <div>Datum: {app.date}</div>
                    </div>

                    <div className="pt-1 flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApprove(app.id, app.title)}
                        className="text-[10px] py-1 px-2.5 h-auto font-bold"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Freigeben
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* QUICK ACTIONS NAVIGATION SHORTCUTS */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-mono text-xs font-extrabold text-white uppercase tracking-wider">
                Schnell-Aktionen & Navigation
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => onSelectTab && onSelectTab('scan')}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  <span>4-KI-Agenten Scan starten</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onSelectTab && onSelectTab('gutachten')}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-violet-500/10 border border-white/10 hover:border-violet-500/40 text-slate-200 hover:text-violet-300 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  <span>S2k Gutachten bearbeiten</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onSelectTab && onSelectTab('documents')}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Audit-Pipeline & ALBIS Export</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onSelectTab && onSelectTab('consult')}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Voice Consult & Diktat</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
