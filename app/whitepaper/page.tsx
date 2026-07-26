'use client';

import React from 'react';
import SystemWhitepaper from '../../src/components/SystemWhitepaper';
import { GlobalSystemProvider } from '../../src/components/GlobalSystemContext';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';

export default function WhitepaperPublicRoute() {
  return (
    <GlobalSystemProvider>
      <div className="min-h-screen bg-[#020813] text-slate-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-50 border-b border-violet-500/20 bg-[#020813] px-4 py-3 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a 
                href="/" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 hover:scale-105 active:scale-95 text-violet-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Zurück zum Portal</span>
              </a>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                <BookOpen size={14} className="text-violet-400" />
                <span>U.D.O. v2.0 S2k Clinical Whitepaper</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              <ShieldCheck size={14} />
              <span>S2k Med-Legal Verified</span>
            </div>
          </div>
        </header>

        {/* Page Content with Smooth Scale Zoom Entrance Animation */}
        <motion.main 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10"
        >
          <SystemWhitepaper />
        </motion.main>
      </div>
    </GlobalSystemProvider>
  );
}
