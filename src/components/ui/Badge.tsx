import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald' | 'slate' | 'indigo';
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  className,
  icon
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(0,212,170,0.15)]',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.15)]',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    slate: 'bg-slate-800/60 border-slate-700/50 text-slate-300',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
  };

  const dotColors = {
    cyan: 'bg-cyan-400 shadow-[0_0_6px_rgba(0,212,170,0.8)]',
    violet: 'bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.8)]',
    rose: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
    emerald: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
    slate: 'bg-slate-400',
    indigo: 'bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[variant].split(' ')[0]
            )}
          />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])} />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="uppercase">{children}</span>
    </span>
  );
};
