import React, { useState, useEffect } from 'react';
import {
  FolderSync,
  FileCheck,
  FileWarning,
  RefreshCw,
  Zap,
  ShieldCheck,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Database,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { generateSampleAlbisGdtIn } from '../lib/gdt/gdtParser';

interface AlbisSyncLog {
  id: string;
  type: 'inbound' | 'outbound';
  timestamp: string;
  patientId: string;
  caseId?: string;
  patientName: string;
  fileName: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  isSynthetic: boolean;
  parseErrors?: string[];
  rawGdtSample?: string;
}

interface AlbisBridgeStatus {
  exchangeFolderPath: string;
  watcherActive: boolean;
  lastSyncTimestamp: string | null;
  totalInboundCount: number;
  totalOutboundCount: number;
  syntheticModeActive: boolean;
  parseErrorCount: number;
  recentLogs: AlbisSyncLog[];
}

export const AlbisGdtBridgePanel: React.FC = () => {
  const [status, setStatus] = useState<AlbisBridgeStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingTrigger, setTestingTrigger] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Inspector Playground State
  const [rawGdtInput, setRawGdtInput] = useState<string>(
    generateSampleAlbisGdtIn('SYN-90412', 'Mustermann', 'Erika')
  );
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);
  const [parsingPlayground, setParsingPlayground] = useState(false);

  // Config State
  const [exchangePathInput, setExchangePathInput] = useState<string>('C:\\ALBIS\\GDT\\UDO_EXCHANGE\\');
  const [pathUpdating, setPathUpdating] = useState(false);

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState<AlbisSyncLog | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations/albis/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.exchangeFolderPath) {
          setExchangePathInput(data.exchangeFolderPath);
        }
      }
    } catch (err) {
      console.error('Fehler beim Laden des ALBIS Bridge Status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-parse initial sample
    handleParsePreview(rawGdtInput);
  }, []);

  const handleParsePreview = async (textToParse: string) => {
    try {
      setParsingPlayground(true);
      const res = await fetch('/api/integrations/albis/parse-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawGdtText: textToParse }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsedPreview(data);
      }
    } catch (err) {
      console.error('Parse Preview Fehler:', err);
    } finally {
      setParsingPlayground(false);
    }
  };

  const handleRunSyntheticTest = async () => {
    try {
      setTestingTrigger(true);
      const res = await fetch('/api/integrations/albis/test-trigger', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
        await fetchStatus();
      }
    } catch (err) {
      console.error('Synthetic Test Error:', err);
    } finally {
      setTestingTrigger(false);
    }
  };

  const handleSavePath = async () => {
    try {
      setPathUpdating(true);
      const res = await fetch('/api/integrations/albis/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: exchangePathInput }),
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error updating exchange path:', err);
    } finally {
      setPathUpdating(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header & Status Banner */}
      <div className="bg-[#111217]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#B87333]/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#B87333]/20 to-cyan-500/20 border border-[#B87333]/40 text-[#E8A87C]">
              <FolderSync className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">CGM ALBIS GDT 2.1 File-Exchange Bridge</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#B87333]/20 text-[#E8A87C] border border-[#B87333]/40">
                  Praxisverwaltung Bridge
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> isSynthetic: true (Test-Modus)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dateibasierte GDT 2.1 Schnittstelle zwischen CGM ALBIS (lokal) & U.D.O. S2k Gutachten Platform (Qualitätsring Medizinische Software e.V.)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-slate-300 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              Aktualisieren
            </button>

            <button
              onClick={handleRunSyntheticTest}
              disabled={testingTrigger}
              className="cupra-button flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
            >
              <Zap className={`w-4 h-4 text-amber-400 ${testingTrigger ? 'animate-bounce' : ''}`} />
              Synthetischen Testlauf starten
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Inbound (Satzart 6302)</div>
              <div className="text-lg font-bold font-mono text-white">{status?.totalInboundCount ?? 1} Anforderung(en)</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Outbound (Satzart 6310)</div>
              <div className="text-lg font-bold font-mono text-white">{status?.totalOutboundCount ?? 1} Ergebnis(se)</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileWarning className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Parse-Warnungen</div>
              <div className="text-lg font-bold font-mono text-white">{status?.parseErrorCount ?? 0} Abweichung(en)</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#B87333]/10 border border-[#B87333]/20 text-[#E8A87C]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Exchange Ordner Status</div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Aktiv überwacht
              </div>
            </div>
          </div>
        </div>

        {/* Local Folder Path Configuration */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 w-full sm:w-auto">
            <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Lokaler Export-Ordner (ALBIS):</span>
            <input
              type="text"
              value={exchangePathInput}
              onChange={(e) => setExchangePathInput(e.target.value)}
              className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono w-72 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleSavePath}
              disabled={pathUpdating}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all"
            >
              {pathUpdating ? 'Speichere...' : 'Speichern'}
            </button>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Empfohlener ALBIS Standardpfad: <code className="text-amber-300 font-mono">C:\ALBIS\GDT\UDO_EXCHANGE\</code>
          </div>
        </div>
      </div>

      {/* Synthetic Test Simulation Output Notification */}
      {testResult && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-emerald-300">Synthetischer GDT 2.1 Testlauf erfolgreich ausgeführt!</div>
            <p className="text-slate-300">
              ALBIS GDT-IN eingelesen (Satzart 6302) &rarr; UDO Fallakte <span className="font-mono text-cyan-300">#{testResult.inbound?.caseId}</span> angelegt &rarr; GDT-OUT (Satzart 6310) exportiert nach <span className="font-mono text-amber-300">UDO2ARZT.GDT</span>.
            </p>
            <div className="mt-2 text-[11px] font-mono text-slate-400 bg-black/50 p-2.5 rounded-lg border border-emerald-500/20 whitespace-pre-wrap">
              {testResult.sampleGdtIn}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left = Inspector & Playground, Right = Rules & Outbound Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Live GDT Inspector & Parser Playground */}
        <div className="bg-[#111217]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">GDT 2.1 Live Inspector & Parser Playground</h3>
            </div>
            <button
              onClick={() => {
                const sample = generateSampleAlbisGdtIn('SYN-90412', 'Müller', 'Hans');
                setRawGdtInput(sample);
                handleParsePreview(sample);
              }}
              className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 underline"
            >
              Muster laden (Satzart 6302)
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Fügen Sie hier echten oder synthetischen ALBIS GDT-Text ein, um das Feldmapping (3000, 3101, 3102, 3103, 3110, 6200) und Längenpräfixe in Echtzeit zu prüfen.
          </p>

          <div className="relative">
            <textarea
              value={rawGdtInput}
              onChange={(e) => {
                setRawGdtInput(e.target.value);
                handleParsePreview(e.target.value);
              }}
              rows={8}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/60 leading-relaxed custom-scrollbar"
              placeholder="Fügen Sie GDT-Text im Format [3-stellige Länge][4-stellige FK][Inhalt] ein..."
            />
          </div>

          {/* Parsed Output Tree */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-white/10 pb-2">
              <span>Extrahiertes GDT-Datensatz-Objekt</span>
              {parsedPreview?.success && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GDT 2.1 Valide
                </span>
              )}
            </div>

            {parsedPreview?.success && parsedPreview.record ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-slate-400 text-[10px] block uppercase">8000 (Satzart)</span>
                  <span className="text-amber-300 font-bold">{parsedPreview.record.satzart} (Anforderung)</span>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-slate-400 text-[10px] block uppercase">3000 (Patientennummer)</span>
                  <span className="text-cyan-300 font-bold">{parsedPreview.record.patientId}</span>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-slate-400 text-[10px] block uppercase">3101 / 3102 (Name)</span>
                  <span className="text-white font-bold">
                    {parsedPreview.record.lastName}, {parsedPreview.record.firstName}
                  </span>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-slate-400 text-[10px] block uppercase">3103 (Geburtsdatum)</span>
                  <span className="text-emerald-300 font-bold">{parsedPreview.record.birthDateFormatted}</span>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-slate-400 text-[10px] block uppercase">3110 (Geschlecht)</span>
                  <span className="text-slate-200">
                    {parsedPreview.record.gender === '1'
                      ? '1 (männlich)'
                      : parsedPreview.record.gender === '2'
                      ? '2 (weiblich)'
                      : '3 (divers)'}
                  </span>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <span className="text-slate-400 text-[10px] block uppercase">6200 (Untersuchungsdatum)</span>
                  <span className="text-slate-200">{parsedPreview.record.examDateFormatted}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-400 py-2">
                {parsedPreview?.error || 'Kein valider GDT-Text erkannt.'}
              </div>
            )}

            {parsedPreview?.record?.parseErrors?.length > 0 && (
              <div className="mt-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded text-[11px] text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Errechnete Abweichungen im Header:
                </div>
                {parsedPreview.record.parseErrors.map((err: string, i: number) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Outbound GDT Specification & Security Shield */}
        <div className="bg-[#111217]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#E8A87C]" />
              <h3 className="text-base font-bold text-white">Outbound GDT-OUT (Satzart 6310) & Privacy Shield</h3>
            </div>

            <div className="p-4 bg-[#B87333]/10 border border-[#B87333]/30 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-[#E8A87C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Datenschutz-Garantie (HARD CONSTRAINT #5)
              </div>
              <p className="text-slate-300 leading-relaxed">
                Der GDT-OUT Export übermittelt ausschließlich Status-Pointer (z. B.{' '}
                <code className="text-amber-300 bg-black/40 px-1.5 py-0.5 rounded font-mono">
                  6221: "Gutachten erstellt, siehe UDO-Fallakte #BG-2026-9901-A"
                </code>
                ). Es werden <strong>keine medizinischen Diagnosen, Befundtexte oder PHI-Auszüge</strong> in die lokale ALBIS-Karteikarte zurückgeschrieben.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Generiertes GDT-OUT Beispiel (UDO2ARZT.GDT):
              </div>
              <div className="p-3 bg-black/70 border border-white/15 rounded-xl font-mono text-xs text-emerald-400 leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar">
                {`01380006310\r\n013810000185\r\n0138315ALBIS\r\n0118316UDO\r\n013921802.10\r\n0173000SYN-90412\r\n0153101Müller\r\n0133102Hans\r\n016622025072026\r\n0218402UDO Gutachten\r\n0656221Gutachten erstellt, siehe UDO-Fallakte #BG-2026-9901-A\r\n`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                <div className="font-bold text-cyan-300 mb-1">Codierung & Zeilenumbruch</div>
                <div>Standard: IBM437 / CP850 mit Windows CRLF (\r\n). Auto-Fallback auf UTF-8.</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                <div className="font-bold text-[#E8A87C] mb-1">QMS Längenberechnung</div>
                <div>Präfix = 3 Längenbytes + 4 FK-Bytes + N Inhaltsbytes + 2 CRLF-Bytes.</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>ALBIS re-importiert die Datei <code className="text-white font-mono">UDO2ARZT.GDT</code> automatisch nach dem Speichern im Exportordner.</span>
          </div>
        </div>
      </div>

      {/* Live Exchange Logs Table */}
      <div className="bg-[#111217]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#E8A87C]" />
            <h3 className="text-base font-bold text-white">GDT 2.1 Dateiaustausch-Protokoll (Audit Log)</h3>
          </div>
          <span className="text-xs text-slate-400">
            Zeigt alle eingehenden Anforderungen (6302) und ausgehenden Rückmeldungen (6310)
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Zeitstempel</th>
                <th className="py-2.5 px-3">Richtung</th>
                <th className="py-2.5 px-3">Patientennummer (3000)</th>
                <th className="py-2.5 px-3">UDO Fallakte</th>
                <th className="py-2.5 px-3">Patientenname</th>
                <th className="py-2.5 px-3">Dateiname</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {status?.recentLogs && status.recentLogs.length > 0 ? (
                status.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-slate-300">
                      {new Date(log.timestamp).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      {log.type === 'inbound' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          GDT-IN (6302)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          GDT-OUT (6310)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-300">{log.patientId}</td>
                    <td className="py-3 px-3 text-cyan-300">{log.caseId || '—'}</td>
                    <td className="py-3 px-3 text-white font-sans font-medium">{log.patientName}</td>
                    <td className="py-3 px-3 text-slate-400">{log.fileName}</td>
                    <td className="py-3 px-3">
                      {log.status === 'success' ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-sans font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OK
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 font-sans font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warnung
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-sans font-medium text-slate-200 transition-all"
                      >
                        Ansehen
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500 font-sans">
                    Noch keine GDT-Austausche protokolliert. Starten Sie einen synthetischen Testlauf.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing raw GDT file contents from log */}
      {selectedLog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#111217] border border-white/20 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  GDT Protokoll-Details: {selectedLog.fileName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div><strong>Patientennummer:</strong> {selectedLog.patientId}</div>
                <div><strong>UDO Fallakte:</strong> {selectedLog.caseId}</div>
                <div><strong>Satzart:</strong> {selectedLog.type === 'inbound' ? '6302 (Anforderung)' : '6310 (Ergebnis)'}</div>
                <div><strong>Testpatient:</strong> {selectedLog.isSynthetic ? 'Ja (isSynthetic)' : 'Nein'}</div>
              </div>

              <div className="mt-3">
                <div className="font-bold text-slate-300 mb-1">Meldung:</div>
                <div className="p-2.5 bg-white/5 rounded border border-white/10 text-slate-200">
                  {selectedLog.message}
                </div>
              </div>

              {selectedLog.rawGdtSample && (
                <div className="mt-3">
                  <div className="font-bold text-slate-300 mb-1">Rohdatei-Auszug (GDT 2.1):</div>
                  <pre className="p-3 bg-black/80 border border-white/10 rounded-xl font-mono text-xs text-cyan-300 whitespace-pre-wrap overflow-x-auto max-h-60 custom-scrollbar">
                    {selectedLog.rawGdtSample}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
