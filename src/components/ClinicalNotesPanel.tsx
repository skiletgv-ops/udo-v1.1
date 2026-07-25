import React, { useState, useEffect } from "react";
import { 
  FileEdit, 
  Save, 
  Trash2, 
  Check, 
  Sparkles, 
  Tag, 
  Clock, 
  Copy,
  Brain,
  Share2
} from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: string[];
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: "note-1",
    title: "Konsilnotiz: Post-EEG Amplitudenasymmetrie",
    content: "Pat. zeigt nach Schädel-Trauma re. fokal verlangsamtes Theta. S2k Empfehlung: Wiederholung EEG nach 4 Wochen + MRT Verlaufskontrolle.",
    updatedAt: "Heute, 14:15",
    tags: ["EEG", "Verlauf", "S2k"]
  },
  {
    id: "note-2",
    title: "MdE Einschätzung Vorbereitung BG-Sitzung",
    content: "Empfohlene Gesamtmde: 30% (Einzel-MdE Neurologie: 20%, Einzel-MdE HNO/Tinnitus: 10%). Integrierte Gesamtmde gemäß AWMF Regelung.",
    updatedAt: "Gestern, 09:30",
    tags: ["MdE 30%", "BG-Gutachten"]
  }
];

export default function ClinicalNotesPanel() {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem("udo_clinical_notes");
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setTitleInput(activeNote.title);
      setContentInput(activeNote.content);
      setTagInput(activeNote.tags.join(", "));
    }
  }, [activeNoteId]);

  const saveCurrentNote = () => {
    const tagsArray = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const updated = notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: titleInput || "Unbenannte Notiz",
          content: contentInput,
          tags: tagsArray,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return n;
    });

    setNotes(updated);
    localStorage.setItem("udo_clinical_notes", JSON.stringify(updated));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const createNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: "Neue Klinische Notiz",
      content: "",
      updatedAt: "Gerade eben",
      tags: ["Entwurf"]
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (updated.length > 0) setActiveNoteId(updated[0].id);
    localStorage.setItem("udo_clinical_notes", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4 text-slate-100 font-sans">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-white/10 rounded-2xl p-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <FileEdit size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              KLINISCHER SCRATCHPAD & FALL-NOTIZEN
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Schnell-Notizen, Differenzialdiagnosen & Memos mit auto-lokaler Speicherung
            </p>
          </div>
        </div>

        <button
          onClick={createNewNote}
          className="px-3.5 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.4)]"
        >
          + Neue Notiz
        </button>
      </div>

      {/* Grid: Note List + Note Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-[420px]">
        
        {/* Note Selector Sidebar */}
        <div className="md:col-span-4 flex flex-col space-y-2 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
          {notes.map(n => {
            const isActive = n.id === activeNoteId;

            return (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-slate-900 border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    : "bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-900/40"
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {n.content || "Kein Inhalt..."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500">
                  <span>{n.updatedAt}</span>
                  <div className="flex gap-1">
                    {n.tags.map(t => (
                      <span key={t} className="px-1 bg-white/5 rounded text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Editor Main Area */}
        <div className="md:col-span-8 bg-slate-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          {activeNote ? (
            <>
              <div className="space-y-3">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Titel der Notiz..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-violet-400 font-mono"
                />

                <textarea
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Schreiben Sie hier Ihre klinischen Befund-Notizen, Gedankengänge oder AWMF-Querverweise..."
                  className="w-full h-64 bg-slate-900/80 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-violet-400 font-sans resize-none scrollbar-thin"
                />

                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-violet-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Tags kommagetrennt (z.B. EEG, MdE, Konsil)..."
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              {/* Editor Footer Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer text-xs flex items-center gap-1.5 font-mono"
                  title="Notiz löschen"
                >
                  <Trash2 size={14} />
                  <span>Löschen</span>
                </button>

                <button
                  onClick={saveCurrentNote}
                  className="px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {isSaved ? <Check size={16} /> : <Save size={16} />}
                  <span>{isSaved ? "Gespeichert!" : "Notiz Speichern"}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
              Wählen Sie eine Notiz oder erstellen Sie eine neue.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
