import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { usePrescriptionContext } from '../context/PrescriptionContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePrescriptionContext();

  return (
    <div className="fixed top-16 right-4 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-start justify-between gap-3 ${
              toast.type === 'success'
                ? 'bg-[#0f241a]/95 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : toast.type === 'amber'
                ? 'bg-[#291f0e]/95 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : toast.type === 'rose'
                ? 'bg-[#2b1016]/95 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                : 'bg-[#0e2229]/95 border-cyan-500/50 text-cyan-200 shadow-[0_0_20px_rgba(0,212,170,0.3)]'
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'amber' && (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'rose' && (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              )}

              <div className="text-xs font-sans font-medium leading-snug">
                <div className="font-mono text-[10px] uppercase font-extrabold tracking-wider opacity-75 mb-0.5">
                  UDO S2k System Notification
                </div>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
