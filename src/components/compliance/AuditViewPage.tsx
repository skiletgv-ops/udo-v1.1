import React, { useState, useEffect } from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import {
  ShieldCheck,
  Download,
  Filter,
  Search,
  Lock,
  ListFilter,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const AuditViewPage: React.FC = () => {
  const { auditLogs, refreshAuditLogs } = useUdoStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  useEffect(() => {
    refreshAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module.toLowerCase() === moduleFilter.toLowerCase();
    return matchesSearch && matchesModule;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Module,Action,PatientID,UserID,IPAddress,Details\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.module}","${l.action}","${l.patientId}","${l.userId}","${l.ipAddress || ''}","${l.details || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDO_GDPR_Audit_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" />
            <span>Unveränderbares GDPR / DSGVO Revisions-Protokoll (Audit Trail)</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Lückenlose Erfassung aller Zugriffe, Datenänderungen & Löschprüfungen
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.3)]"
        >
          <FileSpreadsheet size={16} />
          <span>CSV Export für Behandlungsprüfer</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xl">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Aktion, Patient ID oder Benutzer suchen..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="relative">
          <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">Alle Module</option>
            <option value="devices">Devices</option>
            <option value="gutachten">Gutachten</option>
            <option value="intake">Intake</option>
            <option value="billing">Billing</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-white/10 font-mono text-[10px] text-slate-400 uppercase">
                <th className="p-3.5">Zeitstempel</th>
                <th className="p-3.5">Modul</th>
                <th className="p-3.5">Aktion</th>
                <th className="p-3.5">Patient ID</th>
                <th className="p-3.5">Benutzer</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Keine Revisions-Einträge gefunden.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('de-DE')}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-white text-[11px]">{log.action}</td>
                    <td className="p-3.5 text-violet-300 font-bold">{log.patientId}</td>
                    <td className="p-3.5 text-slate-300 text-[11px]">{log.userId}</td>
                    <td className="p-3.5 text-slate-400 text-[11px] max-w-xs truncate">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditViewPage;
