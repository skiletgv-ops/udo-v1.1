import React, { useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Sparkles,
  MessageSquare,
  Lock,
  Unlock,
  Download,
  RotateCcw,
  Check,
  X,
  FileCheck,
  Zap,
  HelpCircle,
  Eye,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { GutachtenDraftVariant, GutachtenSectionItem, TrackChangeItem } from "./gutachtenTypes";

interface Phase6ReviewEditorViewProps {
  activeDraft: GutachtenDraftVariant;
  onOpenDocEvidence: (docId: string, page: number) => void;
  onOpenExportModal: () => void;
}

export default function Phase6ReviewEditorView({
  activeDraft,
  onOpenDocEvidence,
  onOpenExportModal,
}: Phase6ReviewEditorViewProps) {
  const [sections, setSections] = useState<GutachtenSectionItem[]>(activeDraft.sections);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [activeSectionText, setActiveSectionText] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [reviewerComments, setReviewerComments] = useState<
    Array<{ id: string; author: string; text: string; date: string }>
  >([
    {
      id: "c-1",
      author: "Prof. Dr. med. V. Altenberg (Obergutachterin)",
      text: "Abschnitt IV (Kausalität): S2k-Leitlinienbezug ist hervorragend herausgearbeitet. Bitte bei der MdE auf 20 v.H. präzisieren.",
      date: "Heute, 10:14 Uhr",
    },
  ]);
  const [newCommentInput, setNewCommentInput] = useState("");

  const [trackChanges, setTrackChanges] = useState<TrackChangeItem[]>([
    {
      id: "tc-1",
      sectionId: "sec-5",
      type: "insertion",
      originalText: "Die MdE beträgt 20%.",
      suggestedText: "Die Minderung der Erwerbsfähigkeit (MdE) auf dem allgemeinen Arbeitsmarkt wird auf 20 v.H. (zwanzig vom Hundert) festgesetzt.",
      author: "Dr. Clara (Med-Gemini KI-Rephraser)",
      status: "pending",
    },
  ]);

  const handleStartEdit = (sec: GutachtenSectionItem) => {
    setEditingSectionId(sec.id);
    setActiveSectionText(sec.content);
  };

  const handleSaveEdit = (secId: string) => {
    setSections(
      sections.map((s) => (s.id === secId ? { ...s, content: activeSectionText } : s))
    );
    setEditingSectionId(null);
  };

  const handleAiRephrase = (secId: string, style: "formal" | "concise" | "court") => {
    const target = sections.find((s) => s.id === secId);
    if (!target) return;

    let rephrased = target.content;
    if (style === "formal") {
      rephrased += "\n\n[In fachlich-gutachtlicher Konformität mit den AWMF-Richtlinien wird diese Einschätzung explizit bestätigt.]";
    } else if (style === "concise") {
      rephrased = rephrased.slice(0, 180) + "... [Auf das Wesentliche gekürzt].";
    } else {
      rephrased += "\n\n[Gerichtsverwertbare Formulierung gemäß § 109 SGG mit unmittelbarem Aktenbezug].";
    }

    setSections(
      sections.map((s) => (s.id === secId ? { ...s, content: rephrased } : s))
    );
  };

  const handleAddComment = () => {
    if (!newCommentInput.trim()) return;
    setReviewerComments([
      ...reviewerComments,
      {
        id: `c-${Date.now()}`,
        author: "Facharzt / Reviewer",
        text: newCommentInput,
        date: "Gerade eben",
      },
    ]);
    setNewCommentInput("");
  };

  const handleAcceptTrackChange = (tcId: string) => {
    setTrackChanges(
      trackChanges.map((tc) => (tc.id === tcId ? { ...tc, status: "accepted" } : tc))
    );
  };

  const handleRejectTrackChange = (tcId: string) => {
    setTrackChanges(
      trackChanges.map((tc) => (tc.id === tcId ? { ...tc, status: "rejected" } : tc))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Review Control Bar */}
      <div className="bg-[#111217]/90 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
              <span>Interaktiver Gutachten-Editor &amp; Prüflabor</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  isApproved
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {isApproved ? "✓ GUTACHTEN FREIGEGEBEN" : "⏳ REVISION DURCH FACHARZT"}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Gutachterliche Endbearbeitung, KI-Absatzumformulierungen &amp; Ärztliche Freigabe
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsApproved(!isApproved)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all cursor-pointer border ${
              isApproved
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
            }`}
          >
            {isApproved ? (
              <>
                <Lock size={15} />
                <span>Freigabe Stornieren</span>
              </>
            ) : (
              <>
                <Unlock size={15} />
                <span>Als Obergutachter Freigeben</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenExportModal}
            disabled={!isApproved}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase flex items-center gap-2 transition-all cursor-pointer ${
              isApproved
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                : "bg-white/10 text-slate-500 cursor-not-allowed opacity-60"
            }`}
            title={!isApproved ? "Bitte vor dem Export freigeben" : "PDF, DOCX oder RTF Exportieren"}
          >
            <Download size={15} />
            <span>Dokument Exportieren</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Sections vs Side Comments Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Sections Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((sec) => {
            const isEditing = editingSectionId === sec.id;

            return (
              <div
                key={sec.id}
                className="p-6 rounded-3xl bg-[#111217]/90 border border-white/10 hover:border-cyan-500/30 transition-all space-y-4 shadow-xl relative"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black text-cyan-300 font-sans tracking-wide">
                    {sec.title}
                  </h4>

                  <div className="flex items-center gap-2">
                    {/* KI Rephrase Quick Buttons */}
                    <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px]">
                      <span className="text-slate-500 font-mono px-1">KI-Stil:</span>
                      <button
                        onClick={() => handleAiRephrase(sec.id, "formal")}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
                      >
                        Formal S2k
                      </button>
                      <button
                        onClick={() => handleAiRephrase(sec.id, "concise")}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
                      >
                        Prägnant
                      </button>
                      <button
                        onClick={() => handleAiRephrase(sec.id, "court")}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
                      >
                        Gerichtsfest
                      </button>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => handleStartEdit(sec)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Bearbeiten</span>
                      </button>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSaveEdit(sec.id)}
                          className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={13} /> Speichern
                        </button>
                        <button
                          onClick={() => setEditingSectionId(null)}
                          className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X size={13} /> Abbrechen
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Content */}
                {!isEditing ? (
                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {sec.content}
                  </p>
                ) : (
                  <textarea
                    rows={8}
                    value={activeSectionText}
                    onChange={(e) => setActiveSectionText(e.target.value)}
                    className="w-full bg-black/60 border border-cyan-400/50 rounded-2xl p-4 text-xs text-white font-sans leading-relaxed focus:outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar: Track Changes & Peer Review Comments */}
        <div className="space-y-6">
          {/* Peer Reviewer Comments Box */}
          <div className="p-5 rounded-3xl bg-[#111217]/90 border border-white/10 shadow-xl space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Ärztliche Gutachter-Hinweise</span>
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {reviewerComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="font-bold text-cyan-300">{comment.author}</span>
                    <span>{comment.date}</span>
                  </div>
                  <p className="text-slate-200">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <textarea
                rows={2}
                placeholder="Kommentar oder Regress-Hinweis ergänzen..."
                value={newCommentInput}
                onChange={(e) => setNewCommentInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAddComment}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase cursor-pointer transition-all"
              >
                Kommentar Hinzufügen
              </button>
            </div>
          </div>

          {/* AI Track Changes Box */}
          <div className="p-5 rounded-3xl bg-[#111217]/90 border border-white/10 shadow-xl space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 font-mono flex items-center gap-2">
              <Zap size={16} />
              <span>Vorgeschlagene KI-Korrekturen</span>
            </h4>

            <div className="space-y-3">
              {trackChanges.map((tc) => (
                <div
                  key={tc.id}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs"
                >
                  <span className="text-[10px] font-mono text-slate-400 block">{tc.author}</span>
                  <div className="space-y-1">
                    <p className="line-through text-rose-400/80 text-[11px]">{tc.originalText}</p>
                    <p className="text-emerald-300 font-medium text-[11px]">{tc.suggestedText}</p>
                  </div>

                  {tc.status === "pending" ? (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleAcceptTrackChange(tc.id)}
                        className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold cursor-pointer"
                      >
                        ✓ Übernehmen
                      </button>
                      <button
                        onClick={() => handleRejectTrackChange(tc.id)}
                        className="px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold cursor-pointer"
                      >
                        ✕ Ablehnen
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block pt-1">
                      Status: {tc.status === "accepted" ? "Übernommen" : "Abgelehnt"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
