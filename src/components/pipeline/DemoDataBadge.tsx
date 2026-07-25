import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';

interface DemoDataBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DemoDataBadge: React.FC<DemoDataBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs gap-2'
  }[size];

  return (
    <div
      className={`inline-flex items-center font-mono font-bold uppercase rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] ${sizeClasses} ${className}`}
      title="SYNTHETISCHER DEMO-DATENSATZ (isSynthetic: true) — Keinesfalls für echte Patientendaten oder ungeprüfte Exportpfade verwenden!"
    >
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="tracking-wider">DEMO DATA</span>
      <span className="opacity-60 text-[9px] font-normal hidden sm:inline">(isSynthetic: true)</span>
    </div>
  );
};
