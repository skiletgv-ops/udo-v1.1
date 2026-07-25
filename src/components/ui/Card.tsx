import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald' | 'none';
  hoverGlow?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  hoverGlow = true,
  className,
  ...props
}) => {
  const glowStyles = {
    cyan: 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,212,170,0.2)]',
    violet: 'border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    rose: 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]',
    amber: 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    emerald: 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    none: 'border-white/10'
  };

  const hoverStyles = hoverGlow
    ? 'hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(0,212,170,0.15)] transition-all duration-300'
    : '';

  return (
    <div
      className={cn(
        'bg-[#111217]/85 backdrop-blur-xl border rounded-2xl p-5 text-slate-100',
        glowStyles[glow],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
