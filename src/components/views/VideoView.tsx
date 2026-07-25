import React from 'react';
import { Video, Play, Pause } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const VideoView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <Badge variant="cyan">Motion Analysis</Badge>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Video Diagnostics & Gangbild-Analyse
          </h1>
        </div>
        <Badge variant="cyan">60 FPS Tracked</Badge>
      </div>

      <Card glow="cyan" className="p-6 space-y-4">
        <div className="h-72 bg-black/80 rounded-2xl border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
          <div className="text-center space-y-2">
            <Video className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
            <span className="text-xs font-mono text-slate-300 block">
              Ganganalyse & L4/L5 Schonhaltung Video-Track
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
