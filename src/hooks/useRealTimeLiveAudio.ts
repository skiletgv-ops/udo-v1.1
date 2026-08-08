import { useState, useEffect, useRef, useCallback } from 'react';

export interface LiveAudioState {
  isConnected: boolean;
  isStreaming: boolean;
  latencyMs: number;
  lastTranscript: string;
  isEmergencyAlert: boolean;
  emergencyPayload?: {
    icd10: string;
    title: string;
    actionMessage: string;
    bypassedLLM: boolean;
  };
}

export function useRealTimeLiveAudio() {
  const [state, setState] = useState<LiveAudioState>({
    isConnected: false,
    isStreaming: false,
    latencyMs: 0,
    lastTranscript: '',
    isEmergencyAlert: false
  });

  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/live-audio`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connection_ready') {
            setState((prev) => ({ ...prev, isConnected: true }));
          } else if (data.type === 'emergency_alert') {
            setState((prev) => ({
              ...prev,
              isEmergencyAlert: true,
              emergencyPayload: {
                icd10: data.icd10,
                title: data.title,
                actionMessage: data.actionMessage,
                bypassedLLM: data.bypassedLLM
              },
              latencyMs: data.latencyMs || 1
            }));
          } else if (data.type === 'audio_stream_start') {
            setState((prev) => ({ ...prev, isStreaming: true }));
          } else if (data.type === 'transcript_chunk') {
            setState((prev) => ({ ...prev, lastTranscript: data.text }));
          } else if (data.type === 'audio_stream_end') {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
              latencyMs: data.latencyMs || 350
            }));
          }
        } catch (e) {
          console.error('[WS PARSE ERROR]', e);
        }
      };

      ws.onclose = () => {
        setState((prev) => ({ ...prev, isConnected: false, isStreaming: false }));
      };

      ws.onerror = (err) => {
        console.warn('[WS ERROR]', err);
        setState((prev) => ({ ...prev, isConnected: false }));
      };
    } catch (e) {
      console.warn('Could not initialize Live Audio WebSocket:', e);
    }
  }, []);

  const sendLivePrompt = useCallback((promptText: string, lang: 'de' | 'en' = 'de') => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
    }
    setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'prompt', text: promptText, lang }));
      }
    }, 100);
  }, [connect]);

  const resetEmergency = useCallback(() => {
    setState((prev) => ({ ...prev, isEmergencyAlert: false, emergencyPayload: undefined }));
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    ...state,
    connect,
    sendLivePrompt,
    resetEmergency
  };
}
