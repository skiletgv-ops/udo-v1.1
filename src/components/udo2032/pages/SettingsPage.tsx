import React, { useState } from 'react';
import { Settings, Key, CheckCircle2, ShieldCheck, Save, Eye, EyeOff, Monitor, Download } from 'lucide-react';
import { UdoDesktopInstallerModal } from '../UdoDesktopInstallerModal';

export function SettingsPage() {
  const [passcode, setPasscode] = useState('ADMIN');
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  const [showKeys, setShowKeys] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showInstallerModal, setShowInstallerModal] = useState(false);

  const handleSaveKeys = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/save-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passcode,
          keys: {
            geminiKey,
            claudeKey,
            deepseekKey,
            openaiKey
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedStatus('UDO 2032 AI Key Vault updated successfully!');
      } else {
        setSavedStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setSavedStatus(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans select-none text-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Settings size={16} />
            <span>SYSTEM CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono text-white">
            AI Key Vault & Model Routing Settings
          </h1>
        </div>

        <button
          onClick={() => setShowKeys(!showKeys)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
        >
          {showKeys ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{showKeys ? 'Hide Keys' : 'Show Keys'}</span>
        </button>
      </div>

      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">ADMIN PASSCODE</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">GEMINI_API_KEY</label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">CLAUDE_API_KEY (ANTHROPIC)</label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              placeholder="sk-ant-api..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">DEEPSEEK_API_KEY</label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={deepseekKey}
              onChange={(e) => setDeepseekKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">OPENAI_API_KEY</label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleSaveKeys}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Keys...' : 'Save Keys to In-Memory Vault'}</span>
          </button>

          {savedStatus && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{savedStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Standalone Desktop App Installer (.exe) Section */}
      <div className="bg-slate-950/80 border border-cyan-500/30 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
            <Monitor size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold font-mono text-cyan-300">
              UDO 2032 Windows (.exe) Installer Suite
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Native Electron Desktop Client • Deep Link Protocol (udo2032://) • Direct3D 12 Hardware Acceleration
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInstallerModal(true)}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <Download size={16} />
          <span>DOWNLOAD WINDOWS SETUP (.EXE)</span>
        </button>
      </div>

      <UdoDesktopInstallerModal
        isOpen={showInstallerModal}
        onClose={() => setShowInstallerModal(false)}
      />
    </div>
  );
}
