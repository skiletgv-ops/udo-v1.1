import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Monitor,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  X,
  Sparkles,
  Terminal,
  HardDrive,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';

interface DesktopInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UdoDesktopInstallerModal({ isOpen, onClose }: DesktopInstallerModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'exe' | 'instructions' | 'specs'>('exe');

  const handleDownloadExe = () => {
    setDownloading(true);
    // Trigger download of the generated .exe setup binary
    const link = document.createElement('a');
    link.href = '/api/download/udo-installer.exe';
    link.download = 'UDO_2032_Medical_Command_Setup_v2.0.0.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-slate-900/95 border-2 border-cyan-500/60 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.35)] overflow-hidden text-slate-100 font-sans"
        >
          {/* Top Bar Header */}
          <div className="p-6 bg-slate-950/90 border-b border-cyan-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
                <Monitor size={24} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-wider text-cyan-300 uppercase font-mono">
                    UDO 2032 DESKTOP SETUP (.EXE)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold">
                    WIN x64 READY
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Native Windows Executable & Electron Holographic Command Center
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800/80 bg-slate-950/50 text-xs font-mono">
            <button
              onClick={() => setActiveTab('exe')}
              className={`flex-1 py-3 px-4 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'exe'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download size={14} />
              <span>1. DOWNLOAD EXE</span>
            </button>

            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-3 px-4 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'instructions'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal size={14} />
              <span>2. BUILD / RUN CMD</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-3 px-4 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'specs'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive size={14} />
              <span>3. SYSTEM SPECS</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {activeTab === 'exe' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-cyan-400 font-bold">UDO_2032_Medical_Command_Setup_v2.0.0.exe</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Target OS:</span>
                    <span>Windows 11 / 10 (64-Bit Workstation)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Security Signature:</span>
                    <span className="text-purple-400 font-bold">0x8a92f7c3 (ZK-Proof Certified)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Features Included:</span>
                    <span className="text-emerald-400">GDT/ALBIS Bridge + Direct3D 12 + Multi-LLM</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <button
                    onClick={handleDownloadExe}
                    disabled={downloading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_55px_rgba(6,182,212,0.8)] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {downloading ? (
                      <>
                        <Cpu className="w-5 h-5 animate-spin" />
                        <span>PREPARING EXECUTABLE SETUP...</span>
                      </>
                    ) : downloaded ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-slate-950" />
                        <span>SETUP EXE DOWNLOADED! (CLICK AGAIN TO RE-DOWNLOAD)</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>DOWNLOAD UDO_2032_SETUP.EXE</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center font-mono">
                    Direct executable installer package compiled with Electron NSIS Windows Wrapper.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-cyan-400 font-bold">Option A: Direct Executable Installation</p>
                  <p className="text-slate-300 leading-relaxed">
                    Double click the downloaded <code className="text-emerald-300 font-bold">UDO_2032_Medical_Command_Setup_v2.0.0.exe</code> file on Windows to launch the installation wizard.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-purple-400 font-bold">Option B: Build Executable from Local Source</p>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 space-y-1 text-[11px]">
                    <p className="text-slate-400"># 1. Build Windows NSIS Executable Installer:</p>
                    <p className="text-cyan-300 font-bold">npm run build:exe</p>
                    <p className="text-slate-400 pt-1"># 2. Or run native desktop Electron app directly:</p>
                    <p className="text-emerald-300 font-bold">npm run electron:start</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">MINIMUM GPU</span>
                  <p className="text-cyan-300 font-bold">Direct3D 12 / WebGL2</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">PRACTICE SYSTEM</span>
                  <p className="text-emerald-300 font-bold">ALBIS, medatixx, CGM GDT</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">OFFLINE CACHE</span>
                  <p className="text-purple-300 font-bold">IndexedDB 2GB Encrypted</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">DEEP LINKING</span>
                  <p className="text-blue-300 font-bold">udo2032:// Registered</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Code Signing • UDO Medical Intelligence Systems</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
