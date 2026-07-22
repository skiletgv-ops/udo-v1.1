import React, { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { NAV_ITEMS, NavItemId, NavItemConfig } from "../config/navItems";
import { useDeviceCapability } from "../hooks/useDeviceCapability";

// Lazy-loaded panel contents for mobile performance optimization
const UnifiedConsultationPortal = lazy(() => import("./UnifiedConsultationPortal"));
const GutachtenPanel = lazy(() => import("./GutachtenPanel"));
const ExecutiveDashboard = lazy(() => import("./ExecutiveDashboard"));
const CompliancePanel = lazy(() => import("./CompliancePanel"));
const SystemWhitepaper = lazy(() => import("./SystemWhitepaper"));
const ApiKeysAdmin = lazy(() => import("./ApiKeysAdmin"));

interface NavigationShellProps {
  language?: "en" | "de";
  activeItemId: NavItemId | null;
  onSelectItem: (id: NavItemId | null) => void;
  onRobotStateChange?: (state: any) => void;
  onDrBubbleTrigger?: (text: string) => void;
  children?: React.ReactNode;
}

export default function NavigationShell({
  language = "de",
  activeItemId,
  onSelectItem,
  onRobotStateChange,
  onDrBubbleTrigger,
  children,
}: NavigationShellProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { isMobile, isLowPowerDevice } = useDeviceCapability();

  const handleItemClick = (id: NavItemId) => {
    if (activeItemId === id) {
      onSelectItem(null); // Toggle off if already active
    } else {
      onSelectItem(id); // Switch to new panel
    }
  };

  const activeConfig = NAV_ITEMS.find((item) => item.id === activeItemId);

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row overflow-hidden pointer-events-none">
      
      {/* =========================================================================
          1. DESKTOP SIDEBAR (Slim, Collapsible, Left Edge)
          ========================================================================= */}
      <aside
        onMouseEnter={() => !isMobile && setIsSidebarExpanded(true)}
        onMouseLeave={() => !isMobile && setIsSidebarExpanded(false)}
        className={`hidden md:flex flex-col justify-between items-center py-6 px-3 bg-slate-950/90 border-r border-white/10 backdrop-blur-2xl z-40 transition-all duration-300 pointer-events-auto shrink-0 ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Top Header & UDO Brand Icon */}
        <div className="flex flex-col items-center w-full space-y-6">
          <button
            onClick={() => onSelectItem(null)}
            className="flex items-center gap-3 w-full px-2 py-1 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer"
            title="UDO Home Dashboard"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-teal-500/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:scale-105 transition-transform">
              <img
                src="/udo_main_icon.jpg"
                alt="UDO Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // Fallback icon if image fails to load
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            {isSidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-left overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-sm font-black text-white uppercase tracking-wider font-mono leading-none">
                  U.D.O. SYSTEM
                </h1>
                <span className="text-[9px] text-teal-400 font-mono tracking-widest block mt-0.5 font-bold">
                  COGNITIVE AI CORE
                </span>
              </motion.div>
            )}
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Desktop Navigation Items */}
          <nav className="flex flex-col gap-2.5 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeItemId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`group relative flex items-center gap-3.5 px-3 py-3 rounded-2xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer w-full text-left overflow-hidden ${
                    isActive
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-[0_0_25px_rgba(20,184,166,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                  title={item.label}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-teal-400 rounded-r-full shadow-[0_0_10px_rgba(45,212,191,1)]"
                    />
                  )}

                  <div className="shrink-0 relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900/80 border border-white/10 group-hover:border-teal-500/40 group-hover:scale-105 transition-all">
                    <Icon size={18} className={isActive ? "text-teal-400" : "text-slate-300 group-hover:text-teal-400"} />
                  </div>

                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="whitespace-nowrap uppercase tracking-wider text-xs"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Expansion Toggle Pin */}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="w-full py-2 flex items-center justify-center text-slate-500 hover:text-teal-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>

      {/* =========================================================================
          2. CENTRAL DYNAMIC PANEL AREA (Materialize Animation, Max 1 Panel)
          ========================================================================= */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden p-3 md:p-6 pb-24 md:pb-6 pointer-events-none">
        <AnimatePresence mode="wait">
          {activeItemId && activeConfig ? (
            <motion.div
              key={activeItemId}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
              className={`flex-1 relative flex flex-col w-full max-w-7xl mx-auto h-full rounded-[28px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.85)] p-4 md:p-6 overflow-hidden pointer-events-auto ${
                isLowPowerDevice ? "bg-slate-950/95" : "bg-slate-950/90 backdrop-blur-2xl"
              }`}
            >
              {/* Scanline Sweep FX on Panel Open */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent z-50 pointer-events-none shadow-[0_0_15px_rgba(45,212,191,1)]"
              />

              {/* Panel Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 shrink-0 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <activeConfig.icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-base md:text-xl font-black text-white uppercase tracking-wide font-mono">
                      {activeConfig.label}
                    </h2>
                    <p className="text-[10px] md:text-xs text-slate-400 font-mono">
                      {activeConfig.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectItem(null)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold uppercase"
                  title="Close Panel"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Schließen</span>
                </button>
              </div>

              {/* Suspense Lazy Content Wrapper */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center h-64 space-y-3">
                      <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
                        Modul wird geladen...
                      </span>
                    </div>
                  }
                >
                  {activeItemId === "consult" && (
                    <UnifiedConsultationPortal
                      language={language}
                      onRobotStateChange={onRobotStateChange}
                      onDrBubbleTrigger={onDrBubbleTrigger}
                    />
                  )}

                  {activeItemId === "gutachten" && (
                    <GutachtenPanel
                      onRobotStateChange={onRobotStateChange}
                    />
                  )}

                  {activeItemId === "dashboard" && (
                    <ExecutiveDashboard />
                  )}

                  {activeItemId === "compliance" && (
                    <CompliancePanel />
                  )}

                  {activeItemId === "whitepaper" && (
                    <SystemWhitepaper />
                  )}

                  {activeItemId === "admin" && (
                    <ApiKeysAdmin />
                  )}
                </Suspense>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing-children"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 w-full h-full overflow-y-auto pointer-events-auto"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =========================================================================
          3. MOBILE BOTTOM DOCK BAR (Fixed, Thumb-Reachable, Height ~64px)
          ========================================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 border-t border-white/10 backdrop-blur-2xl z-50 flex items-center justify-around px-2 pointer-events-auto shadow-[0_-10px_30px_rgba(0,0,0,0.9)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItemId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all cursor-pointer relative ${
                isActive ? "text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {/* Active glow pip */}
              {isActive && (
                <motion.div
                  layoutId="activeDockPip"
                  className="absolute top-0 w-8 h-1 bg-teal-400 rounded-b-full shadow-[0_0_12px_rgba(45,212,191,1)]"
                />
              )}

              <Icon size={20} className={isActive ? "scale-110 text-teal-400 transition-transform" : "scale-100"} />
              <span className="text-[9px] font-mono tracking-tighter mt-1 uppercase font-bold truncate max-w-[56px]">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
