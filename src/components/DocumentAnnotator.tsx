import React, { useRef, useState, useEffect } from "react";
import { 
  Palette, 
  Trash2, 
  Undo, 
  Check, 
  Edit3, 
  Highlighter, 
  Download,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface DocumentAnnotatorProps {
  documentText: string;
  patientName: string;
  caseId: string;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  type: "highlight" | "pen";
}

export default function DocumentAnnotator({ documentText, patientName, caseId }: DocumentAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"highlight" | "pen">("highlight");
  const [color, setColor] = useState<string>("#eab308"); // default yellow highlight
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  // Available colors for annotation
  const tools = [
    { id: "yellow-hl", type: "highlight" as const, color: "#eab308", label: "Yellow Highlight" },
    { id: "green-hl", type: "highlight" as const, color: "#22c55e", label: "Green Highlight" },
    { id: "blue-hl", type: "highlight" as const, color: "#3b82f6", label: "Blue Highlight" },
    { id: "red-pen", type: "pen" as const, color: "#ef4444", label: "Red Pen" },
    { id: "white-pen", type: "pen" as const, color: "#38bdf8", label: "Cyan Pen" },
  ];

  // Set up the canvas when sizing or strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 1) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.type === "highlight") {
        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // Reset properties
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
  }, [strokes]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    // Calculate precise coordinates relative to canvas internal dimensions
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
    setSavedStatus(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const newPoints = [...currentStroke, { x, y }];
    setCurrentStroke(newPoints);

    // Real-time rendering of the stroke currently being drawn
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = tool === "highlight" ? 18 : 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "highlight") {
      ctx.globalAlpha = 0.35;
    } else {
      ctx.globalAlpha = 1.0;
    }

    ctx.moveTo(currentStroke[currentStroke.length - 1].x, currentStroke[currentStroke.length - 1].y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: currentStroke,
        color,
        width: tool === "highlight" ? 18 : 3,
        type: tool,
      };
      setStrokes((prev) => [...prev, newStroke]);
    }
    setCurrentStroke([]);
  };

  const handleClear = () => {
    setStrokes([]);
    setSavedStatus(false);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
    setSavedStatus(false);
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="border border-white/10 rounded-2xl bg-slate-950/65 overflow-hidden shadow-2xl flex flex-col h-full" id="document-annotator-layer">
      {/* Header Panel */}
      <div className="bg-black/60 border-b border-white/10 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-500/15 border border-teal-500/20 rounded-lg text-teal-400">
            <Highlighter size={15} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block leading-none">Dokumenten-Analyse</span>
            <span className="text-xs font-black text-white">{patientName} — MRI & D-Arzt Befund</span>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2">
          {/* Colors selector */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 gap-1">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTool(t.type);
                  setColor(t.color);
                }}
                className={`p-1.5 rounded-lg transition-all relative ${
                  color === t.color && tool === t.type
                    ? "bg-white/10 text-white border-white/20 scale-105"
                    : "text-slate-400 hover:text-white"
                }`}
                title={t.label}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white/10" 
                  style={{ backgroundColor: t.color }}
                />
                {color === t.color && tool === t.type && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-400" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/15 text-slate-300 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Schritt zurück"
          >
            <Undo size={14} />
          </button>

          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="p-2 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 hover:border-red-500/40 text-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Alle Zeichnungen löschen"
          >
            <Trash2 size={14} />
          </button>

          <button
            onClick={handleSave}
            className={`px-3 py-1.5 rounded-xl font-bold font-sans text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
              savedStatus 
                ? "bg-emerald-600 text-white" 
                : "bg-teal-500 hover:bg-teal-600 text-slate-950 font-black shadow-[0_0_12px_rgba(20,184,166,0.2)]"
            }`}
          >
            {savedStatus ? (
              <>
                <Check size={12} />
                <span>Gespeichert</span>
              </>
            ) : (
              <>
                <Check size={12} />
                <span>Befund sichern</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning/Guideline Bar */}
      <div className="bg-teal-500/5 border-b border-teal-500/10 px-4 py-2 flex items-center gap-2 text-[10px] text-teal-400 font-mono">
        <Sparkles size={11} className="animate-pulse shrink-0" />
        <span>HIGHLIGHT-MODUS: Zeichnen Sie direkt auf das Dokument, um Kausalitäts-Beweise revisionssicher einzufrieren.</span>
      </div>

      {/* Document Workspace with Canvas Layer */}
      <div className="flex-1 relative bg-slate-900 overflow-auto min-h-[350px] p-4 flex justify-center">
        {/* Paper sheet representation */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 p-8 min-h-[500px] select-none font-sans leading-relaxed"
          style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          {/* Stamp / Logo watermark */}
          <div className="absolute top-6 right-8 border border-slate-300 text-slate-400 p-2 text-[9px] font-mono rounded tracking-widest uppercase text-center rotate-6 pointer-events-none">
            U.D.O. MEDICAL REPORT<br />
            ID: {caseId}
          </div>

          <div className="pointer-events-none">
            <h2 className="text-sm font-black text-slate-950 font-sans tracking-tight border-b border-slate-200 pb-2 mb-4 uppercase">
              📋 DIENSTLICHE MEDIZINISCHE BEGUTACHTUNG
            </h2>

            <table className="w-full text-[10px] text-slate-600 mb-6 border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1 font-bold">PROBAND:</td>
                  <td className="py-1">{patientName}</td>
                  <td className="py-1 font-bold">AKTEN-ID:</td>
                  <td className="py-1 font-mono">{caseId}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 font-bold">VERSICHERUNG:</td>
                  <td className="py-1">Techniker Krankenkasse</td>
                  <td className="py-1 font-bold">UNFALLTAG:</td>
                  <td className="py-1 font-mono">12.03.2025</td>
                </tr>
              </tbody>
            </table>

            {/* Injected clinical text with custom layout */}
            <div className="space-y-4 text-xs font-semibold text-slate-800">
              <div>
                <span className="font-bold text-slate-950 uppercase text-[10px] block border-l-2 border-slate-900 pl-1.5 mb-1">
                  1. Unfallereignis & Hebedynamik
                </span>
                <p className="text-slate-600 font-medium">
                  Der Patient Thomas Müller kam beim vertikalen Heben einer 35 kg schweren Stahlgusskiste ins Straucheln. In der Folge kam es zu einer plötzlichen Hyperextension und Scherkraftbelastung der Lendenwirbelsäule mit sofort einschießendem, stechendem Schmerzzustand.
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-950 uppercase text-[10px] block border-l-2 border-slate-900 pl-1.5 mb-1">
                  2. Klinischer Befundstatus
                </span>
                <p className="text-slate-600 font-medium">
                  Das Schmerzsyndrom strahlt radikulär nach L5 links aus. Im neurologischen Status zeigt sich das Lasègue-Zeichen links bei 45 Grad stark positiv. Der Achillessehnenreflex (ASR) ist abgeschwächt, der Patellarsehnenreflex (PSR) ist mittellehaft erhalten. Es besteht eine diskrete Hypästhesie des linken Fußrückens im Dermatom L5.
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-950 uppercase text-[10px] block border-l-2 border-slate-900 pl-1.5 mb-1">
                  3. Radiologische Befunde (MRT LWS)
                </span>
                <p className="text-slate-600 font-medium font-mono text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed">
                  Befund vom 28.03.2025: Deutlicher, breiter mediolateraler Bandscheibenvorfall im Segment L4/L5 links. Es liegt eine konsekutive, hochgradige mechanische Kompression der abgangsnahen Nervenwurzel L5 links vor. Diskrete Facettengelenksarthrose L4 bis S1.
                </p>
              </div>
            </div>
          </div>

          {/* Overlay canvas for physical drawing */}
          <canvas
            ref={canvasRef}
            width={600}
            height={480}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
