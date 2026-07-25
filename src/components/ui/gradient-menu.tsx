import React from 'react';
import { IoHomeOutline, IoVideocamOutline, IoCameraOutline, IoShareSocialOutline, IoHeartOutline } from 'react-icons/io5';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  onClick?: () => void;
  active?: boolean;
}

const defaultMenuItems: MenuItem[] = [
  { title: 'Home', icon: <IoHomeOutline />, gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { title: 'Video', icon: <IoVideocamOutline />, gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { title: 'Photo', icon: <IoCameraOutline />, gradientFrom: '#FF9966', gradientTo: '#FF5E62' },
  { title: 'Share', icon: <IoShareSocialOutline />, gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
  { title: 'Tym', icon: <IoHeartOutline />, gradientFrom: '#ffa9c6', gradientTo: '#f434e2' }
];

interface GradientMenuProps {
  items?: MenuItem[];
  className?: string;
}

export default function GradientMenu({ items = defaultMenuItems, className = "" }: GradientMenuProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <ul className="flex gap-4 sm:gap-6 flex-wrap justify-center">
        {items.map(({ title, icon, gradientFrom, gradientTo, onClick, active }, idx) => (
          <li
            key={idx}
            onClick={onClick}
            style={{ 
              '--gradient-from': gradientFrom, 
              '--gradient-to': gradientTo 
            } as React.CSSProperties}
            className={`relative w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] bg-slate-900 border border-white/10 shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[150px] sm:hover:w-[170px] hover:shadow-none group cursor-pointer ${
              active ? 'w-[150px] sm:w-[170px]' : ''
            }`}
          >
            {/* Gradient background on hover / active */}
            <span className={`absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-500 ${
              active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}></span>
            
            {/* Blur glow */}
            <span className={`absolute top-[10px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[15px] -z-10 transition-all duration-500 ${
              active ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'
            }`}></span>

            {/* Icon */}
            <span className={`relative z-10 transition-all duration-500 delay-0 ${
              active ? 'scale-0' : 'group-hover:scale-0'
            }`}>
              <span className="text-xl sm:text-2xl text-slate-200 group-hover:text-white">{icon}</span>
            </span>

            {/* Title */}
            <span className={`absolute text-white font-bold uppercase tracking-wide text-xs sm:text-sm transition-all duration-500 delay-150 ${
              active ? 'scale-100' : 'scale-0 group-hover:scale-100'
            }`}>
              {title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
