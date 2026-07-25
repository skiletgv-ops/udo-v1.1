import React, { useState } from "react";
import {
  Clock,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Calendar,
  User,
  Building,
  Activity,
  AlertCircle,
  FileText
} from "lucide-react";
import { TimelineEventItem } from "./gutachtenTypes";

interface Phase2MedicalTimelineViewProps {
  timelineEvents: TimelineEventItem[];
  onOpenDocEvidence: (docId: string, page: number) => void;
  onUpdateTimelineEvents: (events: TimelineEventItem[]) => void;
}

export default function Phase2MedicalTimelineView({
  timelineEvents,
  onOpenDocEvidence,
  onUpdateTimelineEvents,
}: Phase2MedicalTimelineViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TimelineEventItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);

  const filteredEvents = timelineEvents.filter((ev) => {
    const q = searchTerm.toLowerCase();
    return (
      ev.date.toLowerCase().includes(q) ||
      ev.doctor.toLowerCase().includes(q) ||
      ev.hospital.toLowerCase().includes(q) ||
      ev.complaint.toLowerCase().includes(q) ||
      ev.diagnosis.toLowerCase().includes(q) ||
      ev.treatment.toLowerCase().includes(q)
    );
  });

  const handleStartEdit = (ev: TimelineEventItem) => {
    setEditingId(ev.id);
    setEditForm({ ...ev });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = timelineEvents.map((ev) =>
      ev.id === editingId ? ({ ...ev, ...editForm } as TimelineEventItem) : ev
    );
    onUpdateTimelineEvents(updated);
    setEditingId(null);
  };

  const handleDeleteEvent = (id: string) => {
    onUpdateTimelineEvents(timelineEvents.filter((e) => e.id !== id));
  };

  const handleAddNewEvent = () => {
    const newEv: TimelineEventItem = {
      id: `tl-${Date.now()}`,
      date: new Date().toLocaleDateString("de-DE"),
      doctor: "Dr. med. Altenberg (Obergutachterin)",
      hospital: "Praxis für Neurologie",
      specialty: "Neurologie",
      complaint: "Manuell ergänzter Ereigniseintrag.",
      diagnosis: "Gütachterliche Verlaufskontrolle",
      treatment: "Evaluation der Restsymptomatik",
      medication: "Unverändert",
      outcome: "Befund konsolidiert",
      followUp: "Abschlussgutachten",
      sourceDocId: "doc-1",
      sourceDocName: "Klinikum_Koeln_Entlassungsbericht_2025-03-20.pdf",
      sourcePage: 1,
      confidence: 100,
    };
    onUpdateTimelineEvents([newEv, ...timelineEvents]);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-[#111217]/80 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Symptom, Arzt, Diagnose oder Datum suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-mono text-slate-400">
            {filteredEvents.length} von {timelineEvents.length} Ereignissen
          </span>
          <button
            onClick={handleAddNewEvent}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Ereignis Hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-cyan-500/30 pl-6 space-y-6 ml-3">
        {filteredEvents.map((ev) => {
          const isEditing = editingId === ev.id;

          return (
            <div key={ev.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#111217] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

              {/* Event Card */}
              <div className="p-5 rounded-2xl bg-[#111217]/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
                {!isEditing ? (
                  <>
                    {/* Top Info Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1">
                          <Calendar size={13} />
                          {ev.date}
                        </span>
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <User size={13} className="text-slate-400" />
                          {ev.doctor}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Building size={13} className="text-slate-500" />
                          {ev.hospital}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                          {ev.specialty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => onOpenDocEvidence(ev.sourceDocId, ev.sourcePage)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] text-cyan-300 font-mono flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>{ev.sourceDocName} S.{ev.sourcePage}</span>
                        </button>
                        <button
                          onClick={() => handleStartEdit(ev)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Eintrag Bearbeiten"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Löschen"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Flow Chain */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-amber-400 uppercase block">
                          Symptom / Beschwerde
                        </span>
                        <p className="text-slate-200 font-medium">{ev.complaint}</p>
                      </div>

                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase block">
                          Diagnose {ev.icd10 && `(${ev.icd10})`}
                        </span>
                        <p className="text-cyan-200 font-bold">{ev.diagnosis}</p>
                      </div>

                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-teal-400 uppercase block">
                          Behandlung &amp; Medikation
                        </span>
                        <p className="text-slate-200">{ev.treatment}</p>
                        {ev.medication && (
                          <p className="text-[10px] font-mono text-slate-400 mt-1">
                            Rx: {ev.medication}
                          </p>
                        )}
                      </div>

                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase block">
                          Ergebnis &amp; Follow-up
                        </span>
                        <p className="text-slate-200">{ev.outcome}</p>
                        {ev.followUp && (
                          <p className="text-[10px] font-mono text-emerald-400/80 mt-1">
                            ➔ {ev.followUp}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Inline Edit Form */
                  <div className="space-y-3 p-2 bg-black/40 rounded-xl border border-cyan-500/40">
                    <div className="flex justify-between items-center text-xs font-mono text-cyan-400 border-b border-white/10 pb-2">
                      <span>Ereignis Bearbeiten ({ev.date})</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} /> Speichern
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded bg-white/10 text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} /> Abbrechen
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 uppercase block">Datum</label>
                        <input
                          type="text"
                          value={editForm.date || ""}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 uppercase block">Arzt / Behandler</label>
                        <input
                          type="text"
                          value={editForm.doctor || ""}
                          onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 uppercase block">Institution</label>
                        <input
                          type="text"
                          value={editForm.hospital || ""}
                          onChange={(e) => setEditForm({ ...editForm, hospital: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 uppercase block">Beschwerde</label>
                        <textarea
                          rows={2}
                          value={editForm.complaint || ""}
                          onChange={(e) => setEditForm({ ...editForm, complaint: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 uppercase block">Diagnose</label>
                        <textarea
                          rows={2}
                          value={editForm.diagnosis || ""}
                          onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
