import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface ClinicalDisclaimerProps {
  className?: string;
  customText?: string;
  sessionKey?: string;
}

export const ClinicalDisclaimer: React.FC<ClinicalDisclaimerProps> = ({
  className = '',
  customText,
  sessionKey = 'udo_clinical_disclaimer_dismissed'
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem(sessionKey);
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [sessionKey]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionKey, 'true');
    }
  };

  if (isDismissed) return null;

  return (
    <div
      className={`relative w-full rounded-xl bg-violet-500/10 border border-violet-500/30 backdrop-blur-md p-3.5 px-4 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center justify-between gap-3 text-xs font-mono my-3 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-300 shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.3)] animate-pulse">
          <ShieldAlert size={16} />
        </div>
        <div className="leading-tight">
          <span className="font-extrabold uppercase tracking-wider text-violet-300 mr-2">
            Clinical Notice / Rechtlicher Hinweis:
          </span>
          <span className="text-violet-200/90 font-sans">
            {customText ||
              'For documentation support only. Not a diagnostic device. Interpretation by treating physician required.'}
          </span>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="p-1 rounded-lg hover:bg-violet-500/20 text-violet-400 hover:text-violet-200 transition-colors shrink-0 cursor-pointer"
        title="Hinweis für diese Sitzung ausblenden"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ClinicalDisclaimer;
