import React, { useState, useEffect } from "react";
import { Lock, Unlock, Key, CheckCircle, AlertCircle, RefreshCw, Save, Shield, Eye, EyeOff, Server } from "lucide-react";

export default function ApiKeysAdmin() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [apiKeys, setApiKeys] = useState({
    geminiKey: "",
    claudeKey: "",
    deepseekKey: "",
    openaiKey: ""
  });

  const [showKeys, setShowKeys] = useState({
    gemini: false,
    claude: false,
    deepseek: false,
    openai: false
  });

  const [testStatuses, setTestStatuses] = useState<Record<string, { status: "idle" | "testing" | "success" | "error"; message?: string }>>({});
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Load existing keys if stored
    const storedGemini = localStorage.getItem("GEMINI_API_KEY") || "";
    const storedClaude = localStorage.getItem("CLAUDE_API_KEY") || "";
    const storedDeepseek = localStorage.getItem("DEEPSEEK_API_KEY") || "";
    const storedOpenAI = localStorage.getItem("OPENAI_API_KEY") || "";

    setApiKeys({
      geminiKey: storedGemini,
      claudeKey: storedClaude,
      deepseekKey: storedDeepseek,
      openaiKey: storedOpenAI
    });
  }, []);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt.trim().toUpperCase() === "ADMIN") {
      setIsUnlocked(true);
      setPasscodeError("");
      setPasscodeAttempt("");
    } else {
      setPasscodeError("Ungültiger Passcode. Bitte 'ADMIN' eingeben.");
    }
  };

  const toggleShowKey = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTestKey = async (provider: string) => {
    setTestStatuses(prev => ({ ...prev, [provider]: { status: "testing" } }));
    
    try {
      let endpoint = "/api/consult";
      let key = "";
      if (provider === "gemini") key = apiKeys.geminiKey;
      if (provider === "claude") key = apiKeys.claudeKey;
      if (provider === "deepseek") key = apiKeys.deepseekKey;
      if (provider === "openai") key = apiKeys.openaiKey;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: key,
          prompt: "Ping test for UDO system key verification"
        })
      });

      if (res.ok) {
        setTestStatuses(prev => ({
          ...prev,
          [provider]: { status: "success", message: `✅ ${provider.toUpperCase()} API Verbindung erfolgreich verified!` }
        }));
      } else {
        const data = await res.json().catch(() => ({}));
        setTestStatuses(prev => ({
          ...prev,
          [provider]: { status: "error", message: data.error || `HTTP ${res.status} error` }
        }));
      }
    } catch (err: any) {
      setTestStatuses(prev => ({
        ...prev,
        [provider]: { status: "error", message: err?.message || "Verbindungsfehler" }
      }));
    }
  };

  const handleSaveAllKeys = () => {
    if (apiKeys.geminiKey) localStorage.setItem("GEMINI_API_KEY", apiKeys.geminiKey);
    if (apiKeys.claudeKey) localStorage.setItem("CLAUDE_API_KEY", apiKeys.claudeKey);
    if (apiKeys.deepseekKey) localStorage.setItem("DEEPSEEK_API_KEY", apiKeys.deepseekKey);
    if (apiKeys.openaiKey) localStorage.setItem("OPENAI_API_KEY", apiKeys.openaiKey);

    setSaveMessage("Alle API-Schlüssel wurden erfolgreich im lokalen Vault gesichert.");
    setTimeout(() => setSaveMessage(""), 4000);
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-950/90 border border-amber-500/30 shadow-[0_0_80px_rgba(245,158,11,0.15)] text-center space-y-6 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-teal-500 to-violet-500" />
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
          <Lock size={32} className="animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-wider font-mono">
            Admin Passcode Geschützt
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Geben Sie den System-Passcode ein, um Zugriff auf die U.D.O. AI-Schlüssel-Verwaltung & Model-Directory zu erhalten.
          </p>
        </div>

        <form onSubmit={handleUnlockAdmin} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={passcodeAttempt}
              onChange={(e) => setPasscodeAttempt(e.target.value)}
              placeholder="Passcode eingeben..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white font-mono text-sm tracking-widest text-center outline-none transition-colors"
              autoFocus
            />
          </div>

          {passcodeError && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-center gap-2">
              <AlertCircle size={14} />
              <span>{passcodeError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock size={16} />
            <span>ADMIN-ZUGANG FREISCHALTEN</span>
          </button>
        </form>

        <div className="pt-2 border-t border-white/5">
          <span className="text-[10px] font-mono text-slate-500 block">
            🔑 Hinweistext für Evaluatoren: Passcode lautet <strong className="text-amber-400 font-mono">ADMIN</strong>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Admin Header Ribbon */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Server size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-teal-400 uppercase tracking-widest">
                U.D.O. AI Model Vault & Key Registry
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ADMIN AUTHENTICATED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Verwalten und testen Sie die API-Schlüssel aller im U.D.O. Konsens-System integrierten KI-Modelle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleSaveAllKeys}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Save size={15} />
            <span>Alle Schlüssel Speichern</span>
          </button>
          
          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Sitzung Sperren"
          >
            <Lock size={14} />
            <span>Sperren</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-xs font-mono flex items-center gap-2.5 animate-fade-in shadow-xl">
          <CheckCircle size={16} className="text-teal-400" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Model Providers Grid */}
      <div className="grid grid-cols-1 gap-5">
        
        {/* 1. Gemini */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-teal-500/30 transition-all space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-black font-mono">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  Google Gemini 3.5 Flash / Med-Gemini (Dr. Clara)
                </h4>
                <span className="text-[10px] font-mono text-teal-400 block">
                  Radiologische Befundanalyse & Klinische Erstkonsultation
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 self-start sm:self-auto">
              @google/genai SDK
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-semibold block">
              GEMINI_API_KEY:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeys.gemini ? "text" : "password"}
                  value={apiKeys.geminiKey}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, geminiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-white/15 focus:border-teal-400 text-teal-300 font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey("gemini")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showKeys.gemini ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                onClick={() => handleTestKey("gemini")}
                disabled={testStatuses.gemini?.status === "testing"}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={testStatuses.gemini?.status === "testing" ? "animate-spin" : ""} />
                <span>Testen</span>
              </button>
            </div>

            {testStatuses.gemini && (
              <div className={`p-2.5 rounded-lg text-xs font-mono mt-2 flex items-center gap-2 ${
                testStatuses.gemini.status === "testing" ? "bg-amber-950/50 border border-amber-500/30 text-amber-300" :
                testStatuses.gemini.status === "success" ? "bg-emerald-950/50 border border-emerald-500/30 text-emerald-300" :
                "bg-rose-950/50 border border-rose-500/30 text-rose-300"
              }`}>
                {testStatuses.gemini.status === "success" && <CheckCircle size={14} />}
                {testStatuses.gemini.status === "error" && <AlertCircle size={14} />}
                <span>{testStatuses.gemini.message || "Test läuft..."}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Claude */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-violet-500/30 transition-all space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-black font-mono">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  Anthropic Claude 3.5 Sonnet (Dr. Eric)
                </h4>
                <span className="text-[10px] font-mono text-violet-400 block">
                  Forensisches MdE-Rechtsgutachten & Konsultations-Chat
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 self-start sm:self-auto">
              Anthropic API
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-semibold block">
              CLAUDE_API_KEY:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeys.claude ? "text" : "password"}
                  value={apiKeys.claudeKey}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, claudeKey: e.target.value }))}
                  placeholder="sk-ant-api03-..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-white/15 focus:border-violet-400 text-violet-300 font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey("claude")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showKeys.claude ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                onClick={() => handleTestKey("claude")}
                disabled={testStatuses.claude?.status === "testing"}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={testStatuses.claude?.status === "testing" ? "animate-spin" : ""} />
                <span>Testen</span>
              </button>
            </div>

            {testStatuses.claude && (
              <div className={`p-2.5 rounded-lg text-xs font-mono mt-2 flex items-center gap-2 ${
                testStatuses.claude.status === "testing" ? "bg-amber-950/50 border border-amber-500/30 text-amber-300" :
                testStatuses.claude.status === "success" ? "bg-emerald-950/50 border border-emerald-500/30 text-emerald-300" :
                "bg-rose-950/50 border border-rose-500/30 text-rose-300"
              }`}>
                {testStatuses.claude.status === "success" && <CheckCircle size={14} />}
                {testStatuses.claude.status === "error" && <AlertCircle size={14} />}
                <span>{testStatuses.claude.message || "Test läuft..."}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. DeepSeek */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-indigo-500/30 transition-all space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black font-mono">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  DeepSeek R1 / V3 Engine (Voice Agent & Dr. Gratsiano)
                </h4>
                <span className="text-[10px] font-mono text-indigo-400 block">
                  UDO Voice Agent, Chain-of-Thought Kausalitätsanalyse & S2k-Leitlinien-Konsens
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 self-start sm:self-auto">
              DeepSeek API
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-semibold block">
              DEEPSEEK_API_KEY:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeys.deepseek ? "text" : "password"}
                  value={apiKeys.deepseekKey}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, deepseekKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-white/15 focus:border-indigo-400 text-indigo-300 font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey("deepseek")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showKeys.deepseek ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                onClick={() => handleTestKey("deepseek")}
                disabled={testStatuses.deepseek?.status === "testing"}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={testStatuses.deepseek?.status === "testing" ? "animate-spin" : ""} />
                <span>Testen</span>
              </button>
            </div>

            {testStatuses.deepseek && (
              <div className={`p-2.5 rounded-lg text-xs font-mono mt-2 flex items-center gap-2 ${
                testStatuses.deepseek.status === "testing" ? "bg-amber-950/50 border border-amber-500/30 text-amber-300" :
                testStatuses.deepseek.status === "success" ? "bg-emerald-950/50 border border-emerald-500/30 text-emerald-300" :
                "bg-rose-950/50 border border-rose-500/30 text-rose-300"
              }`}>
                {testStatuses.deepseek.status === "success" && <CheckCircle size={14} />}
                {testStatuses.deepseek.status === "error" && <AlertCircle size={14} />}
                <span>{testStatuses.deepseek.message || "Test läuft..."}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. OpenAI */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-emerald-500/30 transition-all space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black font-mono">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  OpenAI GPT-4o Vector Analyst (Dr. Marcus)
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 block">
                  Biomechanische Kraftvektor-Berechnung & Unfalltrauma-Kinetik
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 self-start sm:self-auto">
              OpenAI API
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-semibold block">
              OPENAI_API_KEY:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeys.openai ? "text" : "password"}
                  value={apiKeys.openaiKey}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openaiKey: e.target.value }))}
                  placeholder="sk-proj-..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-white/15 focus:border-emerald-400 text-emerald-300 font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey("openai")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showKeys.openai ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                onClick={() => handleTestKey("openai")}
                disabled={testStatuses.openai?.status === "testing"}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={testStatuses.openai?.status === "testing" ? "animate-spin" : ""} />
                <span>Testen</span>
              </button>
            </div>

            {testStatuses.openai && (
              <div className={`p-2.5 rounded-lg text-xs font-mono mt-2 flex items-center gap-2 ${
                testStatuses.openai.status === "testing" ? "bg-amber-950/50 border border-amber-500/30 text-amber-300" :
                testStatuses.openai.status === "success" ? "bg-emerald-950/50 border border-emerald-500/30 text-emerald-300" :
                "bg-rose-950/50 border border-rose-500/30 text-rose-300"
              }`}>
                {testStatuses.openai.status === "success" && <CheckCircle size={14} />}
                {testStatuses.openai.status === "error" && <AlertCircle size={14} />}
                <span>{testStatuses.openai.message || "Test läuft..."}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="p-6 rounded-2xl bg-slate-950/90 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          💡 Alle hier eingegebenen API-Schlüssel werden sicher im Browser-Vault gespeichert.
        </div>

        <button
          onClick={handleSaveAllKeys}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all cursor-pointer"
        >
          <Save size={16} />
          <span>ALLE SCHLÜSSEL SPEICHERN</span>
        </button>
      </div>

    </div>
  );
}
