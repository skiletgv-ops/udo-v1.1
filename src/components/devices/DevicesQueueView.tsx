import React, { useState, useEffect } from 'react';
import { useUdoStore } from '../../store/useUdoStore';
import ClinicalDisclaimer from '../ClinicalDisclaimer';
import { DeviceSession } from '../../types/device';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Paperclip,
  ChevronRight,
  FileText,
  Activity,
  ArrowUpDown,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';

interface DevicesQueueViewProps {
  onSelectSession?: (session: DeviceSession) => void;
}

export const DevicesQueueView: React.FC<DevicesQueueViewProps> = ({ onSelectSession }) => {
  const { deviceSessions, fetchDeviceSessions, logAuditAction } = useUdoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortByStatus, setSortByStatus] = useState<boolean>(false);

  useEffect(() => {
    fetchDeviceSessions();
    logAuditAction('VIEW_DEVICE_QUEUE', 'ALL', 'DEVICES', 'Opened Medical Device Integration Queue');
  }, []);

  const filteredSessions = deviceSessions.filter((s) => {
    const matchesSearch =
      (s.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.deviceModel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (!sortByStatus) return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    const order = { pending: 1, reviewed: 2, attached: 3 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  const getStatusBadge = (status: DeviceSession['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock size={12} className="animate-pulse" /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <CheckCircle2 size={12} /> Reviewed
          </span>
        );
      case 'attached':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Paperclip size={12} /> Attached to Gutachten
          </span>
        );
      default:
        return null;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType === 'pdf') return <FileText size={14} className="text-rose-400" />;
    if (fileType === 'csv') return <FileSpreadsheet size={14} className="text-emerald-400" />;
    return <Activity size={14} className="text-cyan-400" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 font-sans pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Cpu size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Medizinische Geräte-Integration & Import-Queue
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                UDO Device Adapter Gateway • Non-Diagnostic Raw Data Processing Queue
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Kölner Praxis-LAN Gateway Active</span>
          </span>
        </div>
      </div>

      {/* CLINICAL DISCLAIMER */}
      <ClinicalDisclaimer />

      {/* FILTER & SEARCH BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xl">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Patientenname, ID oder Gerät-Modell suchen..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
            >
              <option value="all">Alle Status</option>
              <option value="pending">Pending (Ausstehend)</option>
              <option value="reviewed">Reviewed (Überprüft)</option>
              <option value="attached">Attached (Im Gutachten)</option>
            </select>
          </div>

          <button
            onClick={() => setSortByStatus(!sortByStatus)}
            className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              sortByStatus
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Nach Status sortieren"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="p-4">Patient</th>
                <th className="p-4">Gerät / Typ</th>
                <th className="p-4">Zeitstempel</th>
                <th className="p-4">Format</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {sortedSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    Keine Gerätedaten-Sitzungen gefunden.
                  </td>
                </tr>
              ) : (
                sortedSessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => onSelectSession && onSelectSession(session)}
                    className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {session.patientName || session.patientId}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{session.patientId}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-mono text-xs">{session.deviceModel}</div>
                      {session.isSynthetic && (
                        <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-bold">
                          • Synthetic Device Data
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-xs">
                      {new Date(session.timestamp).toLocaleString('de-DE')}
                    </td>
                    <td className="p-4 font-mono">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-[10px] text-slate-300 uppercase">
                        {getFileTypeIcon(session.fileType)}
                        <span>{session.fileType}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(session.status)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectSession) onSelectSession(session);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-200 transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-mono"
                      >
                        <span>Details</span>
                        <ChevronRight size={14} />
                      </button>
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

export default DevicesQueueView;
