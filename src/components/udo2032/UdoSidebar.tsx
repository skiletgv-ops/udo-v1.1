import React, { useState } from 'react';
import {
  Activity,
  Brain,
  Cpu,
  DollarSign,
  Shield,
  Briefcase,
  User,
  Code2,
  Sparkles,
  Plane,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Flame,
  Radio
} from 'lucide-react';

export interface UdoSidebarProps {
  activeSubRoute: string;
  onNavigate: (path: string) => void;
  onNavigatePortal: () => void;
}

export function UdoSidebar({ activeSubRoute, onNavigate, onNavigatePortal }: UdoSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: '/dashboard', label: 'Central Command', icon: Activity, badge: '30 ACTIVE' },
    { id: '/dashboard/bio', label: 'Bio-Health & Gutachten', icon: Brain, badge: 'PHASE 1' },
    { id: '/dashboard/finance', label: 'Finance & Legal Engine', icon: DollarSign, badge: 'PHASE 2' },
    { id: '/dashboard/enterprise', label: 'Enterprise & Translator', icon: Briefcase, badge: 'PHASE 3' },
    { id: '/dashboard/personal', label: 'Life-OS & Security Vault', icon: User, badge: 'PHASE 4' },
    { id: '/dashboard/dev', label: 'Dev-UDO & Creative 3D', icon: Code2, badge: 'PHASE 5' },
    { id: '/dashboard/mobility', label: 'Mobility, Infra & Crisis', icon: Plane, badge: 'PHASE 6' },
    { id: '/dashboard/settings', label: 'AI Key Vault & Settings', icon: Settings, badge: 'SYSTEM' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-slate-950/95 backdrop-blur-2xl border-r border-cyan-500/20 text-slate-200 transition-all duration-300 flex flex-col justify-between select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black font-mono shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                UDO
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  UDO 2032 CORE
                </h1>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  30 SERVICES ONLINE
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black font-mono text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              U2
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubRoute === item.id || (item.id !== '/dashboard' && activeSubRoute.startsWith(item.id));

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/90 to-slate-900 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border hover:border-slate-800'
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />

                {!collapsed && (
                  <div className="flex items-center justify-between w-full overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onNavigatePortal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-900/50 hover:border-cyan-400/80 text-cyan-400 hover:text-cyan-200 font-mono text-xs transition-all cursor-pointer"
        >
          <Globe size={14} />
          {!collapsed && <span>Portal Landing</span>}
        </button>

        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span>LATENCY:</span>
              <span className="text-emerald-400 font-bold">14ms</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>CONFIDENCE:</span>
              <span className="text-cyan-400 font-bold">98.4%</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>LOCAL LLM:</span>
              <span className="text-purple-400">Ollama / phi3</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
