import React from 'react';
import { Cpu, HardDrive } from 'lucide-react';

interface DeviceIconProps {
  className?: string;
  size?: number;
}

export const DeviceIcon: React.FC<DeviceIconProps> = ({ className = 'w-4 h-4 text-cyan-400', size = 16 }) => {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <Cpu size={size} className={className} />
      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
    </div>
  );
};

export default DeviceIcon;
