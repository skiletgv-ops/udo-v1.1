// Web Audio API Futuristic Background Sound & Radio Köln Synthesizer
let audioCtx: AudioContext | null = null;
let mainGainNode: GainNode | null = null;

// Ambient Drone Nodes
let droneOsc1: OscillatorNode | null = null;
let droneOsc2: OscillatorNode | null = null;
let droneLfo: OscillatorNode | null = null;
let droneFilter: BiquadFilterNode | null = null;
let droneGain: GainNode | null = null;

// Radio Köln Sequence Nodes
let sequenceInterval: any = null;
let radioGain: GainNode | null = null;
let radioOsc: OscillatorNode | null = null;
let radioNoiseGain: GainNode | null = null;

const COLOGNE_MELODY = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // A Minor Pentatonic
let melodyStep = 0;

export function initAudioContext() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  audioCtx = new AudioContextClass();
  mainGainNode = audioCtx.createGain();
  mainGainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // Gentle default volume
  mainGainNode.connect(audioCtx.destination);
}

export function startAmbientDrone() {
  try {
    initAudioContext();
    if (!audioCtx) return;
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // If already playing, don't double start
    if (droneOsc1) return;

    // Create a lowpass filter for the sweeping "waving" sound
    droneFilter = audioCtx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.Q.setValueAtTime(5, audioCtx.currentTime);

    // Warm, futuristic twin oscillators
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = "sawtooth";
    droneOsc1.frequency.setValueAtTime(82.41, audioCtx.currentTime); // E2 (Low warm bass)

    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = "triangle";
    droneOsc2.frequency.setValueAtTime(123.47, audioCtx.currentTime); // B2 (Warm fifth)

    // LFO to modulate the filter cutoff ("waving" effect)
    droneLfo = audioCtx.createOscillator();
    droneLfo.type = "sine";
    droneLfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // Extremely slow wave (12.5 seconds)

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(300, audioCtx.currentTime); // Sweep depth (300Hz range)

    // Set initial filter base frequency
    droneFilter.frequency.setValueAtTime(450, audioCtx.currentTime);

    // Connect LFO to filter frequency
    droneLfo.connect(lfoGain);
    lfoGain.connect(droneFilter.frequency);

    // Create gain for drone
    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.4, audioCtx.currentTime);

    // Connect oscillators to filter, to gain, to main output
    droneOsc1.connect(droneFilter);
    droneOsc2.connect(droneFilter);
    droneFilter.connect(droneGain);
    
    if (mainGainNode) {
      droneGain.connect(mainGainNode);
    }

    // Start oscillators
    droneOsc1.start();
    droneOsc2.start();
    droneLfo.start();
  } catch (err) {
    console.warn("Failed to start ambient drone:", err);
  }
}

export function stopAmbientDrone() {
  try {
    if (droneOsc1) {
      droneOsc1.stop();
      droneOsc1.disconnect();
      droneOsc1 = null;
    }
    if (droneOsc2) {
      droneOsc2.stop();
      droneOsc2.disconnect();
      droneOsc2 = null;
    }
    if (droneLfo) {
      droneLfo.stop();
      droneLfo.disconnect();
      droneLfo = null;
    }
    if (droneFilter) {
      droneFilter.disconnect();
      droneFilter = null;
    }
    if (droneGain) {
      droneGain.disconnect();
      droneGain = null;
    }
  } catch (err) {
    console.warn("Failed to stop ambient drone:", err);
  }
}

export function startRadioKolnSequencer() {
  try {
    initAudioContext();
    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (sequenceInterval) return;

    radioGain = audioCtx.createGain();
    radioGain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Soft background sequence
    if (mainGainNode) {
      radioGain.connect(mainGainNode);
    }

    // Start a rhythmic pattern representing Radio Köln's retro electronic broadcast
    let beatIndex = 0;
    
    sequenceInterval = setInterval(() => {
      if (!audioCtx || audioCtx.state === "suspended") return;

      const t = audioCtx.currentTime;

      // 1. Kick Drum (Sine Sweep) on beats 0 and 4
      if (beatIndex % 4 === 0) {
        const kickOsc = audioCtx.createOscillator();
        const kickGain = audioCtx.createGain();
        
        kickOsc.type = "sine";
        kickOsc.frequency.setValueAtTime(150, t);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, t + 0.3);
        
        kickGain.gain.setValueAtTime(0.8, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        
        kickOsc.connect(kickGain);
        if (radioGain) kickGain.connect(radioGain);
        
        kickOsc.start(t);
        kickOsc.stop(t + 0.32);
      }

      // 2. Electro Hi-hat (White Noise Pop) on off-beats 2 and 6
      if (beatIndex % 4 === 2) {
        // Synthesize white noise pop
        const bufferSize = audioCtx.sampleRate * 0.05; // 50ms pop
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;
        
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.setValueAtTime(8000, t);
        
        const noiseGainNode = audioCtx.createGain();
        noiseGainNode.gain.setValueAtTime(0.15, t);
        noiseGainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        
        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGainNode);
        if (radioGain) noiseGainNode.connect(radioGain);
        
        noiseNode.start(t);
        noiseNode.stop(t + 0.06);
      }

      // 3. Melodic Pentatonic Kraftwerk Synth Note on every beat
      if (beatIndex % 2 === 0) {
        const synthOsc = audioCtx.createOscillator();
        const synthGain = audioCtx.createGain();
        const synthFilter = audioCtx.createBiquadFilter();
        
        synthOsc.type = beatIndex % 8 === 0 ? "sawtooth" : "triangle";
        
        // Select frequency from melody list
        const freq = COLOGNE_MELODY[melodyStep];
        melodyStep = (melodyStep + 1) % COLOGNE_MELODY.length;
        
        synthOsc.frequency.setValueAtTime(freq, t);
        
        synthFilter.type = "lowpass";
        synthFilter.frequency.setValueAtTime(1000, t);
        synthFilter.frequency.exponentialRampToValueAtTime(300, t + 0.25);
        
        synthGain.gain.setValueAtTime(0.2, t);
        synthGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        
        synthOsc.connect(synthFilter);
        synthFilter.connect(synthGain);
        if (radioGain) synthGain.connect(radioGain);
        
        synthOsc.start(t);
        synthOsc.stop(t + 0.28);
      }

      beatIndex = (beatIndex + 1) % 8;
    }, 250); // 120 BPM (250ms per 16th note equivalent)
    
  } catch (err) {
    console.warn("Failed to start Radio Köln sequencer:", err);
  }
}

export function stopRadioKolnSequencer() {
  if (sequenceInterval) {
    clearInterval(sequenceInterval);
    sequenceInterval = null;
  }
  if (radioGain) {
    radioGain.disconnect();
    radioGain = null;
  }
}

export function setMasterVolume(volume: number) {
  if (mainGainNode && audioCtx) {
    mainGainNode.gain.setValueAtTime(volume * 0.08, audioCtx.currentTime);
  }
}
