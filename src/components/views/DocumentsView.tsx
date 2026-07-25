import React from 'react';
import { FolderOpen, FileText, Search, CheckCircle2, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DEMO_DOCUMENTS } from '../../lib/agents';

export const DocumentsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <Badge variant="cyan">OCR & Layout Engine</Badge>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Dokumenten OCR & Quellennachweise
          </h1>
        </div>
        <Badge variant="emerald">5 Akten Indexiert</Badge>
      </div>

      <div className="space-y-3">
        {DEMO_DOCUMENTS.map((doc) => (
          <Card key={doc.id} className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs uppercase">
                {doc.category}
              </div>
              <div>
                <span className="font-bold text-white block text-sm">{doc.name}</span>
                <span className="text-xs text-slate-400 font-mono">
                  {doc.size} • Uploaded {doc.uploadDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="emerald" icon={<CheckCircle2 className="w-3 h-3" />}>
                S2k Parsed
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
