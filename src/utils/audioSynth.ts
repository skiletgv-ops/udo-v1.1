// Web Audio API Futurist Background Sound & Radio Köln Synthesizer - Cleaned up / Disabled
let audioCtx: AudioContext | null = null;
let mainGainNode: GainNode | null = null;

export function initAudioContext() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  audioCtx = new AudioContextClass();
  mainGainNode = audioCtx.createGain();
  mainGainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // Gentle default volume
  mainGainNode.connect(audioCtx.destination);
}

// Fully removed futuristic ambient loop
export function startAmbientDrone() {
  // No-op: Ambient drone fully removed as requested
}

export function stopAmbientDrone() {
  // No-op: Ambient drone fully removed as requested
}

// Fully removed Radio Köln retro electronic sequencer
export function startRadioKolnSequencer() {
  // No-op: Sequencer fully removed as requested
}

export function stopRadioKolnSequencer() {
  // No-op: Sequencer fully removed as requested
}

export function setMasterVolume(volume: number) {
  if (mainGainNode && audioCtx) {
    mainGainNode.gain.setValueAtTime(volume * 0.08, audioCtx.currentTime);
  }
}
