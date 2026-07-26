import React from 'react';
import { useVoiceChat } from '../../hooks/useVoiceChat';
import './VoiceChat.css';

interface VoiceChatButtonProps {
  geminiApiKey?: string;
  onNewMessage?: (msg: { role: string; text: string; sender?: 'user' | 'doctor'; id?: string; timestamp?: string }) => void;
  disabled?: boolean;
  language?: string;
  replicateToken?: string;
  className?: string;
}

/**
 * Voice chat button component powered by Kimi-Audio (ASR + TTS) + Gemini
 * Place this inside your existing chat input area or toolbar
 */
export default function VoiceChatButton({
  geminiApiKey,
  onNewMessage,
  disabled,
  language = 'de',
  replicateToken,
  className = ''
}: VoiceChatButtonProps) {
  const {
    startListening,
    stopListening,
    cancelVoice,
    isListening,
    isSpeaking,
    isProcessing
  } = useVoiceChat(geminiApiKey, onNewMessage, { language, replicateToken });

  const isActive = isListening || isSpeaking || isProcessing;

  return (
    <div className={`voice-chat-controls ${className}`}>
      {/* Main voice button */}
      <button
        type="button"
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onMouseLeave={isListening ? stopListening : undefined}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        disabled={disabled || isSpeaking || isProcessing}
        className={`voice-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''} ${isProcessing ? 'processing' : ''}`}
        aria-label={isListening ? 'Listening...' : 'Hold to talk (Kimi-Audio)'}
        title={
          isListening
            ? 'Release to Send'
            : isSpeaking
            ? 'Kimi Voice Output Active'
            : isProcessing
            ? 'Processing Voice Pipeline'
            : 'Hold to talk with Kimi-Audio Voice'
        }
      >
        {isListening && <span className="pulse-ring" />}
        {isListening ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="2" />
              <rect x="14" y="4" width="4" height="16" rx="2" />
            </svg>
            <span>Listening...</span>
          </>
        ) : isSpeaking ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <span>Speaking...</span>
          </>
        ) : isProcessing ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="spin">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Thinking...</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
            <span>Hold to Talk</span>
          </>
        )}
      </button>

      {/* Cancel button (only show when active) */}
      {isActive && (
        <button
          type="button"
          onClick={cancelVoice}
          className="voice-cancel-btn"
          aria-label="Cancel voice"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
