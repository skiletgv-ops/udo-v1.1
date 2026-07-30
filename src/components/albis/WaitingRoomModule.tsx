import React, { useState } from 'react';
import { SyntheticPatient, SYNTHETIC_PATIENTS } from '../../data/mockAlbisDB';
import { Users, Search, CalendarClock, ArrowRight, CheckCircle2, Clock, FileText, AlertTriangle } from 'lucide-react';

interface WaitingRoomModuleProps {
  onOpenReport?: (p: SyntheticPatient) => void;
}

export const WaitingRoomModule: React.FC<WaitingRoomModuleProps> = ({ onOpenReport }) => {
  const [patients, setPatients] = useState<SyntheticPatient[]>(SYNTHETIC_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedPatientId, setDraggedPatientId] = useState<string | null>(null);

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesName = `${p.lastName} ${p.firstName}`.toLowerCase().includes(term);
    const matchesId = p.id.toLowerCase().includes(term) || p.caseId.toLowerCase().includes(term);
    const matchesIcd = p.diagnoses.some((d) => d.icdCode.toLowerCase().includes(term) || d.description.toLowerCase().includes(term));
    const matchesReport = (p.recentReportTitle || '').toLowerCase().includes(term);

    return matchesName || matchesId || matchesIcd || matchesReport;
  });

  const getStatusColumn = (status: SyntheticPatient['status']) => {
    return filteredPatients.filter((p) => p.status === status);
  };

  const handleStatusChange = (patientId: string, newStatus: SyntheticPatient['status']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-4 font-sans text-slate-200">
      {/* HEADER & GLOBAL INSTANT SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400 flex items-center justify-center text-violet-300">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Waiting Room & Check-in Flow</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                DRAG & DROP
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Echtzeit-Patientenfluss von Anmeldung über Gutachten-Draft bis Check-out
            </p>
          </div>
        </div>

        {/* GLOBAL SEARCH INPUT */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Global Suche: Name, ICD-10, Fall-ID..."
            className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* KANBAN QUEUE COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* COLUMN 1: WAITING */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => draggedPatientId && handleStatusChange(draggedPatientId, 'Waiting')}
          className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3 min-h-[220px]"
        >
          <div className="flex justify-between items-center font-mono text-xs border-b border-white/10 pb-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Clock size={14} /> Warteraum ({getStatusColumn('Waiting').length})
            </span>
            <span className="text-[10px] text-slate-500">Check-In</span>
          </div>

          <div className="space-y-2">
            {getStatusColumn('Waiting').map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onDragStart={() => setDraggedPatientId(p.id)}
                onMove={() => handleStatusChange(p.id, 'In-Consultation')}
                moveLabel="-> Behandlung"
                onOpenReport={onOpenReport}
              />
            ))}
          </div>
        </div>

        {/* COLUMN 2: IN-CONSULTATION */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => draggedPatientId && handleStatusChange(draggedPatientId, 'In-Consultation')}
          className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3 min-h-[220px]"
        >
          <div className="flex justify-between items-center font-mono text-xs border-b border-white/10 pb-2">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <CalendarClock size={14} /> In Behandlung ({getStatusColumn('In-Consultation').length})
            </span>
            <span className="text-[10px] text-slate-500">Arztzimmer</span>
          </div>

          <div className="space-y-2">
            {getStatusColumn('In-Consultation').map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onDragStart={() => setDraggedPatientId(p.id)}
                onMove={() => handleStatusChange(p.id, 'Gutachten-Draft')}
                moveLabel="-> Gutachten"
                onOpenReport={onOpenReport}
              />
            ))}
          </div>
        </div>

        {/* COLUMN 3: GUTACHTEN DRAFT */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => draggedPatientId && handleStatusChange(draggedPatientId, 'Gutachten-Draft')}
          className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3 min-h-[220px]"
        >
          <div className="flex justify-between items-center font-mono text-xs border-b border-white/10 pb-2">
            <span className="font-bold text-violet-300 flex items-center gap-1.5">
              <FileText size={14} /> Gutachten Draft ({getStatusColumn('Gutachten-Draft').length})
            </span>
            <span className="text-[10px] text-slate-500">UDO Editor</span>
          </div>

          <div className="space-y-2">
            {getStatusColumn('Gutachten-Draft').map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onDragStart={() => setDraggedPatientId(p.id)}
                onMove={() => handleStatusChange(p.id, 'Completed')}
                moveLabel="-> Signiert"
                onOpenReport={onOpenReport}
              />
            ))}
          </div>
        </div>

        {/* COLUMN 4: COMPLETED / CHECKED-OUT */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => draggedPatientId && handleStatusChange(draggedPatientId, 'Completed')}
          className="p-3 rounded-xl bg-[#0A0A0F]/90 border border-white/10 space-y-3 min-h-[220px]"
        >
          <div className="flex justify-between items-center font-mono text-xs border-b border-white/10 pb-2">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Abgeschlossen ({getStatusColumn('Completed').length + getStatusColumn('Checked-Out').length})
            </span>
            <span className="text-[10px] text-slate-500">Archiv/TI</span>
          </div>

          <div className="space-y-2">
            {[...getStatusColumn('Completed'), ...getStatusColumn('Checked-Out')].map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onDragStart={() => setDraggedPatientId(p.id)}
                onOpenReport={onOpenReport}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PatientCardProps {
  patient: SyntheticPatient;
  onDragStart: () => void;
  onMove?: () => void;
  moveLabel?: string;
  onOpenReport?: (p: SyntheticPatient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onDragStart, onMove, moveLabel, onOpenReport }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="p-3 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400/50 space-y-2 transition-all cursor-grab active:cursor-grabbing font-mono text-xs"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="font-bold text-white block">{patient.lastName}, {patient.firstName}</span>
          <span className="text-[10px] text-slate-400">{patient.id} • {patient.insuranceType}</span>
        </div>

        {patient.triagePriority === 'High' && (
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertTriangle size={10} /> NOTFALL
          </span>
        )}
      </div>

      <div className="text-[10px] text-slate-400 line-clamp-1">
        ICD: {patient.diagnoses.map((d) => d.icdCode).join(', ')}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <button
          onClick={() => onOpenReport && onOpenReport(patient)}
          className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
        >
          Akte öffnen
        </button>

        {onMove && (
          <button
            onClick={onMove}
            className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{moveLabel}</span>
            <ArrowRight size={10} />
          </button>
        )}
      </div>
    </div>
  );
};
