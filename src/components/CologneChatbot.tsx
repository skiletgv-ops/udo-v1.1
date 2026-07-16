import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, ShieldCheck, HelpCircle, Bot, Mic, MicOff, Volume2, VolumeX, Check } from "lucide-react";
import { useGlobalSystem } from "./GlobalSystemContext";
import { useWakeWordListener } from "../hooks/useWakeWordListener";

interface Message {
  id: string;
  sender: "user" | "doctor";
  text: string;
  timestamp: string;
}

interface CologneChatbotProps {
  onRobotStateChange: (state: any) => void;
  onDrBubbleTrigger?: (text: string) => void;
}

const PRESET_CHIPS = [
  "How can you help me with this project?",
  "What are the core clinical guidelines for L4/L5?",
  "Summarize Thomas Muller's medical status",
  "How do I calculate reduction in earning capacity?"
];

export default function CologneChatbot({ onRobotStateChange, onDrBubbleTrigger }: CologneChatbotProps) {
  const { chatMessages: messages, setChatMessages: setMessages } = useGlobalSystem();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Set up Speech Synthesis Voice Speak helper (representing Nova Voice)
  const speakResponse = (text: string) => {
    if (isVoiceMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Remove symbols from text
      const cleanText = text.replace(/[*_#`~]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      
      const voices = window.speechSynthesis.getVoices();
      // Look for a high-quality female/neutral English voice for "Nova"
      let selectedVoice = voices.find(v => 
        v.lang.startsWith("en-US") && 
        (v.name.toLowerCase().includes("natural") || 
         v.name.toLowerCase().includes("google") || 
         v.name.toLowerCase().includes("nova") ||
         v.name.toLowerCase().includes("zira") ||
         v.name.toLowerCase().includes("samantha"))
      );
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith("en"));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 1.05;
      utterance.pitch = 1.02;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed:", e);
    }
  };

  // Speak welcome message if not already spoken
  useEffect(() => {
    // Only speak once on initial mount if messages contain the default greeting
    if (messages.length === 1 && messages[0].id === "init-1") {
      const welcomeTimer = setTimeout(() => {
        speakResponse(messages[0].text);
      }, 1500);
      return () => clearTimeout(welcomeTimer);
    }
  }, []);

  // Set up Wake Word Listener looking for "UDO"
  const {
    listeningState,
    requestPermission,
    startListening,
    stopListening,
    isSupported
  } = useWakeWordListener({
    lang: "en-US",
    onWakeWordDetected: () => {
      onRobotStateChange("HAPPY");
      const wakeReply = "Yes, colleague? I am listening. How can I help you today?";
      speakResponse(wakeReply);
      
      // Post notice message to chat
      const sysMsg: Message = {
        id: `msg-wake-${Date.now()}`,
        sender: "doctor",
        text: "[Voice Activated] " + wakeReply,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, sysMsg]);
    },
    onCommandDetected: (commandText) => {
      handleSendMessage(commandText);
    },
    onError: (err) => {
      console.warn("[Live Chat Voice Error]:", err);
    }
  });

  // Automatically start voice wake word listener on mount if permissions granted
  useEffect(() => {
    requestPermission().then((allowed) => {
      if (allowed && isSupported) {
        startListening();
      }
    });
    return () => {
      stopListening();
    };
  }, [requestPermission, startListening, stopListening, isSupported]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);
    onRobotStateChange("THINKING");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();

      const replyText = data.response || data.content || "I apologize, colleague. A transmission error occurred. Could you please try again?";

      const doctorMsg: Message = {
        id: `msg-doc-${Date.now()}`,
        sender: "doctor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, doctorMsg]);
      onRobotStateChange("SPEAKING");
      speakResponse(replyText);

      if (onDrBubbleTrigger) {
        onDrBubbleTrigger(replyText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      onRobotStateChange("SURPRISED");
      
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: "doctor",
        text: "I experienced a server disruption. Could we try that question again, dear colleague?",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
      speakResponse(errorMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[580px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl relative" id="cologne-doctor-chat-module">
      
      {/* Header Info Panel */}
      <div className="bg-white/5 px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-black text-teal-300 text-xs shadow-inner uppercase">
              UDO
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
              listeningState === "passive_listening" ? "bg-green-500 animate-pulse" :
              listeningState === "active_listening" ? "bg-red-500 animate-ping" : "bg-slate-500"
            }`} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white font-sans uppercase tracking-wider flex items-center gap-1.5">
              <span>U.D.O. Live Gemini Chat</span>
              <span className="text-[9px] font-mono font-black text-teal-400 bg-teal-950/40 border border-teal-500/30 px-1.5 py-0.5 rounded uppercase tracking-widest">
                Nova Voice
              </span>
            </h3>
            <p className="text-[9px] text-teal-400 font-mono tracking-widest font-semibold uppercase">
              {listeningState === "passive_listening" ? "● Listening for 'UDO'" :
               listeningState === "active_listening" ? "● Speaking active..." : "● Voice dialogue ready"}
            </p>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-2">
          {/* Mute output voice */}
          <button
            onClick={() => {
              setIsVoiceMuted(!isVoiceMuted);
              if (!isVoiceMuted && typeof window !== "undefined") {
                window.speechSynthesis.cancel();
              }
            }}
            className={`p-2 rounded-xl border transition-all ${
              isVoiceMuted 
                ? "bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-950/40" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title={isVoiceMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isVoiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Toggle passive voice wake word listening */}
          <button
            onClick={() => {
              if (listeningState === "idle") {
                startListening();
              } else {
                stopListening();
              }
            }}
            className={`p-2 rounded-xl border transition-all ${
              listeningState !== "idle"
                ? "bg-teal-950/20 border-teal-500/40 text-teal-300 animate-pulse"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title={listeningState !== "idle" ? "Stop Microphone" : "Start Microphone"}
          >
            {listeningState !== "idle" ? <Mic size={14} /> : <MicOff size={14} />}
          </button>

          <div className="flex items-center gap-1 bg-teal-950/20 border border-teal-500/25 rounded-full px-2.5 py-1 text-[9px] font-mono text-teal-300">
            <ShieldCheck size={11} className="text-teal-400 shrink-0" />
            <span>GDPR-Secure</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#05070a]/40"
      >
        {messages.map((m) => {
          const isDoc = m.sender === "doctor";
          return (
            <div 
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isDoc ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"
              }`}
            >
              {isDoc && (
                <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-300 shrink-0 mt-1 uppercase">
                  UDO
                </div>
              )}
              
              <div className="space-y-1">
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                    isDoc 
                      ? "bg-white/5 text-slate-100 border border-white/5 rounded-tl-none" 
                      : "bg-teal-600 text-white font-medium rounded-tr-none shadow-sm shadow-teal-600/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[8px] font-mono text-slate-500 block px-1">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5 mr-auto text-left max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-300 shrink-0 mt-1 animate-pulse">
              UDO
            </div>
            <div className="p-3.5 bg-white/5 rounded-2xl rounded-tl-none text-xs text-slate-400 border border-white/5 shadow-md flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              U.D.O. is compiling expert advice...
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips bar */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex flex-wrap gap-1.5">
        {PRESET_CHIPS.map((chip) => (
          <button
            key={chip}
            disabled={isLoading}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] text-teal-300 border border-white/5 hover:border-teal-500/30 transition-all font-mono"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input controls form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="px-4 py-3 bg-[#05070a]/65 border-t border-white/10 flex gap-2 items-center"
      >
        <input
          type="text"
          disabled={isLoading}
          placeholder="Ask U.D.O. anything about the project or medical guidelines..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 leading-normal"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={`p-2.5 rounded-xl transition-all ${
            isLoading || !inputMessage.trim()
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
          }`}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
