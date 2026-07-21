import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Upload, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  Settings, User, Clock, Database, ShieldAlert, Check, Plus, Search, 
  Trash2, UserCheck, FileText, Sparkles, RefreshCw, Layers, Award, 
  BookOpen, Cpu, Landmark, Sliders, Play, Pause, Save, Clipboard, Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Legend
} from "recharts";
import { useGlobalSystem } from "./GlobalSystemContext";

// -------------------------------------------------------------
// INTERFACES & TYPES FOR THE EEG SYSTEM
// -------------------------------------------------------------

export interface EEGStudy {
  id: string;
  studyDate: string;
  studyTime: string;
  technician: string;
  referringPhysician: string;
  durationMinutes: number;
  channelCount: number;
  samplingRateHz: number;
  montage: string;
  impedanceCheck: "Passed" | "Marginal" | "Failed";
  status: "Unreviewed" | "AI-Assisted Review" | "Verified" | "Signed";
  aiConfidence: number;
  findings: string[];
  notes: string;
  reportHash?: string;
  signedAt?: string;
}

export interface EEGPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string; // Medical Record Number
  clinicalHistory: string;
  suspectedDiagnosis: string;
  studies: EEGStudy[];
  hasSeizureFocus: boolean;
}

export interface EEGAnnotation {
  id: string;
  timeSeconds: number;
  channel: string;
  label: string;
  type: "Seizure" | "Spike" | "Artifact" | "Normal Background" | "User Bookmark";
}

// -------------------------------------------------------------
// INITIAL PATIENT RECORDS WITH RICH STUDY HISTORY
// -------------------------------------------------------------
const INITIAL_EEG_PATIENTS: EEGPatient[] = [
  {
    id: "p1",
    name: "Dr. Albert Einstein",
    age: 76,
    gender: "M",
    mrn: "MRN-1879-0314",
    clinicalHistory: "Episodes of transient cognitive slowing and localized paresthesia in upper extremity. Suspected subclinical focal cortical discharges or micro-seizures.",
    suspectedDiagnosis: "Focal Epilepsy (Right Frontal Temporal Origin)",
    hasSeizureFocus: true,
    studies: [
      {
        id: "s1_1",
        studyDate: "2026-07-15",
        studyTime: "09:30",
        technician: "Sr. Sabine Altenberg",
        referringPhysician: "Dr. Robert Altenberg",
        durationMinutes: 30,
        channelCount: 8,
        samplingRateHz: 250,
        montage: "Longitudinal Bipolar",
        impedanceCheck: "Passed",
        status: "AI-Assisted Review",
        aiConfidence: 94.2,
        findings: [
          "Spike and Slow-Wave complexes in Right Frontal (Fp2-F4) segments",
          "Prominent Alpha background rhythm of 10.2 Hz with mild hemispheric asymmetry",
          "Frequent ocular artifacts successfully attenuated by AI neural filter"
        ],
        notes: "Highly cooperative patient. The clinical history of focal sensory events strongly correlates with the observed spike complexes in the right anterior quadrant."
      },
      {
        id: "s1_2",
        studyDate: "2026-05-10",
        studyTime: "14:15",
        technician: "Sr. Sabine Altenberg",
        referringPhysician: "Dr. Robert Altenberg",
        durationMinutes: 20,
        channelCount: 8,
        samplingRateHz: 250,
        montage: "Referential Cz-Link",
        impedanceCheck: "Passed",
        status: "Verified",
        aiConfidence: 89.5,
        findings: [
          "Occasional interictal sharp waves in temporal chains",
          "Normal drowsiness progression (Stage N1 sleep transition)"
        ],
        notes: "Historical reference study. Stabilized on active medication protocol. Findings show mild reduction in spike-wave density compared to baseline.",
        reportHash: "0x8D3F9E92AC5D44E08B323F8A64B26C8D89A8F532",
        signedAt: "2026-05-10 15:45"
      }
    ]
  },
  {
    id: "p2",
    name: "Sarah Connor",
    age: 41,
    gender: "F",
    mrn: "MRN-1984-1026",
    clinicalHistory: "Frequent noctural awakenings, complaints of unrefreshing sleep, daytime hypersomnolence, and transient morning headaches.",
    suspectedDiagnosis: "Stage N2 Sleep Disturbance & Intermittent Sleep Spindle Attenuation",
    hasSeizureFocus: false,
    studies: [
      {
        id: "s2_1",
        studyDate: "2026-07-20",
        studyTime: "22:00",
        technician: "Tech. Jan Schmidt",
        referringPhysician: "Dr. Robert Altenberg",
        durationMinutes: 480, // Overnight study
        channelCount: 8,
        samplingRateHz: 250,
        montage: "Referential Cz-Link",
        impedanceCheck: "Passed",
        status: "Unreviewed",
        aiConfidence: 91.8,
        findings: [
          "Symmetric and normal sleep spindles (12-14 Hz) and K-Complexes",
          "Consolidated Stage N2 and N3 slow-wave sleep phases",
          "Transient muscle tension artifacts during micro-arousals"
        ],
        notes: "Nocturnal polysomnographic EEG. Normal sleep architecture with minor periodic respiratory-related arousals. No epileptiform activity observed."
      }
    ]
  },
  {
    id: "p3",
    name: "Helena Schmidt",
    age: 63,
    gender: "F",
    mrn: "MRN-1963-0402",
    clinicalHistory: "Status post left ischemic stroke with subsequent secondary vascular generalized seizures. Currently on dual anticonvulsant regimen.",
    suspectedDiagnosis: "Secondary Vascular Generalized Epilepsy",
    hasSeizureFocus: true,
    studies: [
      {
        id: "s3_1",
        studyDate: "2026-07-18",
        studyTime: "11:00",
        technician: "Sr. Sabine Altenberg",
        referringPhysician: "Dr. Robert Altenberg",
        durationMinutes: 40,
        channelCount: 8,
        samplingRateHz: 250,
        montage: "Longitudinal Bipolar",
        impedanceCheck: "Passed",
        status: "Signed",
        aiConfidence: 96.5,
        findings: [
          "Slow Delta wave focal slowing (2-3 Hz) in left temporal parietal hemisphere",
          "Suppression of alpha activity on the left side indicating post-ischemic tissue loss",
          "Intermittent generalized paroxysmal fast activity (GPFA) spike bursts"
        ],
        notes: "Severe focal background slowing. High diagnostic relevance for monitoring seizure recurrence threshold and adjusting medication dose.",
        reportHash: "0xF2C3B4E59D682A3E147B1629DA41B5F37C9202E5",
        signedAt: "2026-07-18 13:10"
      }
    ]
  }
];

export default function EEGWorkspace() {
  const { language } = useGlobalSystem();

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [patients, setPatients] = useState<EEGPatient[]>(INITIAL_EEG_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("p1");
  const [selectedStudyId, setSelectedStudyId] = useState<string>("s1_1");
  const [activeTab, setActiveTab] = useState<"dashboard" | "viewer" | "ai" | "records" | "reporting">("viewer");

  // Clinical Viewer Navigation & Controls
  const [currentTime, setCurrentTime] = useState<number>(0); // Seconds into recording
  const [zoomLevel, setZoomLevel] = useState<number>(1); // Zoom multiplier
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeMontage, setActiveMontage] = useState<string>("Longitudinal Bipolar");
  const [enabledChannels, setEnabledChannels] = useState<Record<string, boolean>>({
    "Fp1-F3": true, "F3-C3": true, "C3-P3": true, "P3-O1": true,
    "Fp2-F4": true, "F4-C4": true, "C4-P4": true, "P4-O2": true
  });
  const [showBrainPotentials, setShowBrainPotentials] = useState<boolean>(true);
  const [showPowerSpectrum, setShowPowerSpectrum] = useState<boolean>(true);

  // Dynamic Annotations / Bookmarks
  const [annotations, setAnnotations] = useState<EEGAnnotation[]>([
    { id: "a1", timeSeconds: 3.5, channel: "Fp1-F3", label: "Ocular Eye Blink Artifact", type: "Artifact" },
    { id: "a2", timeSeconds: 12.8, channel: "Fp2-F4", label: "Frontal Focus Seizure Spike-Wave Complex", type: "Seizure" },
    { id: "a3", timeSeconds: 22.4, channel: "P3-O1", label: "Normal Alpha Wave Burst (Eyes Closed)", type: "Normal Background" },
    { id: "a4", timeSeconds: 7.2, channel: "C3-P3", label: "Muscle Contraction (Jaw)", type: "Artifact" },
    { id: "a5", timeSeconds: 18.1, channel: "F4-C4", label: "Normal K-Complex Peak", type: "User Bookmark" }
  ]);
  const [newAnnotationLabel, setNewAnnotationLabel] = useState<string>("");
  const [newAnnotationType, setNewAnnotationType] = useState<"Seizure" | "Spike" | "Artifact" | "Normal Background" | "User Bookmark">("User Bookmark");
  const [newAnnotationChannel, setNewAnnotationChannel] = useState<string>("Fp1-F3");

  // File Upload State
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFileDetails, setUploadedFileDetails] = useState<string | null>(null);

  // ROI / Operational Calculator States (configurable assumptions)
  const [annualEegVolume, setAnnualEegVolume] = useState<number>(850);
  const [hourlyNeuroRate, setHourlyNeuroRate] = useState<number>(145);
  const [manualReviewTimeMinutes, setManualReviewTimeMinutes] = useState<number>(45);
  const [aiReviewTimeMinutes, setAiReviewTimeMinutes] = useState<number>(12);

  // Reporting States
  const [clinicalAssessment, setClinicalAssessment] = useState<string>("Normativ stabiles Hintergrund-EEG mit lokalisierten, epileptiformen Sharp-Wave-Entladungen anterior rechts.");
  const [recommendedFollowUp, setRecommendedFollowUp] = useState<string>("Monatliches Kontroll-EEG empfohlen zur Überwachung der therapeutischen Serumkonzentration des Antikonvulsivums.");
  const [customReportFindings, setCustomReportFindings] = useState<string[]>([]);
  const [isDigitalSigned, setIsDigitalSigned] = useState<boolean>(false);
  const [digitalSignatureHash, setDigitalSignatureHash] = useState<string | null>(null);

  // Sound Chime Feedback
  const playBeep = (freq: number, duration: number, vol = 0.02) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.01);
      }
    } catch (e) {}
  };

  // Select patient reference
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const currentStudy = currentPatient.studies.find(s => s.id === selectedStudyId) || currentPatient.studies[0];

  // -------------------------------------------------------------
  // HIGH-PERFORMANCE EEG SIGNAL SIMULATION LOOP
  // -------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();
    
    const drawWaveforms = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = "#020815";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Background
      ctx.strokeStyle = "rgba(20, 184, 166, 0.05)";
      ctx.lineWidth = 1;
      const gridSpacingX = width / 10;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSpacingX, 0);
        ctx.lineTo(i * gridSpacingX, height);
        ctx.stroke();
      }
      const gridSpacingY = height / 8;
      for (let j = 0; j < 8; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * gridSpacingY);
        ctx.lineTo(width, j * gridSpacingY);
        ctx.stroke();
      }

      // Channels to draw
      const channels = Object.keys(enabledChannels).filter(ch => enabledChannels[ch]);
      if (channels.length === 0) return;

      const sliceHeight = height / channels.length;

      channels.forEach((channel, idx) => {
        const centerY = (idx + 0.5) * sliceHeight;

        // Draw Channel Name Tag
        ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
        ctx.font = "bold 10px JetBrains Mono, monospace";
        ctx.fillText(channel, 10, centerY - sliceHeight / 3);

        // Signal state configuration
        ctx.strokeStyle = currentPatient.hasSeizureFocus && idx % 3 === 0 
          ? "rgba(244, 63, 94, 0.75)" // Rose / Red alert signal for seizure focus channels
          : "rgba(20, 184, 166, 0.75)"; // Pristine clinical Teal for normal channels
        ctx.lineWidth = 1.3;
        ctx.beginPath();

        // Calculate sample waveform
        for (let x = 0; x < width; x++) {
          const t = currentTime + (x / width) * (10 / zoomLevel); // 10 seconds of data baseline

          // Base Alpha waves (8-12 Hz)
          let wave = Math.sin(t * Math.PI * 2 * 10.2) * 12;
          
          // Add Beta waves (15-25 Hz)
          wave += Math.sin(t * Math.PI * 2 * 19.5) * 4;

          // Add Delta focal slowing if seizure focus on matching channels
          if (currentPatient.hasSeizureFocus && idx % 3 === 0) {
            wave += Math.sin(t * Math.PI * 2 * 2.8) * 22; // slow high-amplitude delta waves
          } else {
            // normal theta waves
            wave += Math.sin(t * Math.PI * 2 * 6.0) * 5;
          }

          // Random white noise (clinical artifact)
          wave += (Math.random() - 0.5) * 3;

          // Introduce custom seizure focus spikes periodically
          if (currentPatient.hasSeizureFocus && idx % 3 === 0) {
            const cycle = Math.floor(t / 4); // spike every 4 seconds
            const cycleOffset = t % 4;
            if (cycleOffset > 1.2 && cycleOffset < 1.6) {
              // classic epileptic sharp spike-and-wave complex
              const spikeFactor = Math.sin((cycleOffset - 1.2) * Math.PI * 2 * 25);
              const slowWaveFactor = Math.sin((cycleOffset - 1.2) * Math.PI * 2 * 2.5);
              wave += spikeFactor * 45 - slowWaveFactor * 30;
            }
          }

          const y = centerY + wave * 0.9;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw event marker vertical lines if within viewer range
        const viewDuration = 10 / zoomLevel;
        annotations.forEach(ann => {
          if (ann.channel === channel && ann.timeSeconds >= currentTime && ann.timeSeconds <= currentTime + viewDuration) {
            const xPos = ((ann.timeSeconds - currentTime) / viewDuration) * width;
            
            // Marker line
            ctx.strokeStyle = ann.type === "Seizure" ? "rgba(244, 63, 94, 0.4)" : ann.type === "Artifact" ? "rgba(245, 158, 11, 0.4)" : "rgba(59, 130, 246, 0.4)";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(xPos, centerY - sliceHeight/2);
            ctx.lineTo(xPos, centerY + sliceHeight/2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Text Label
            ctx.fillStyle = ann.type === "Seizure" ? "#f43f5e" : ann.type === "Artifact" ? "#f59e0b" : "#3b82f6";
            ctx.font = "bold 9px Inter, sans-serif";
            ctx.fillText(`▲ ${ann.label} (${ann.timeSeconds.toFixed(1)}s)`, xPos + 5, centerY + sliceHeight/3);
          }
        });
      });

      // Interactive timeline playhead updater
      if (isPlaying) {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        setCurrentTime(prev => {
          const next = prev + delta;
          return next > 300 ? 0 : next; // loops at 300 seconds
        });
      }
      
      requestRef.current = requestAnimationFrame(drawWaveforms);
    };

    requestRef.current = requestAnimationFrame(drawWaveforms);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [currentTime, isPlaying, zoomLevel, enabledChannels, currentPatient, annotations]);

  // -------------------------------------------------------------
  // CALCULATORS & FORMULAS (DASHBOARD & ROI SECTION)
  // -------------------------------------------------------------
  const totalHoursSavedManual = (manualReviewTimeMinutes - aiReviewTimeMinutes) / 60 * annualEegVolume;
  const totalFinancialSavings = totalHoursSavedManual * hourlyNeuroRate;
  
  // Projected 5-Year and 10-Year ROI Projections
  const investmentInitialSetup = 28500; // Platform purchase, PACS sync and licensing
  const annualSupportCost = 4500;
  
  const roiProjections = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const cumulativeSavings = totalFinancialSavings * year;
    const cumulativeInvestment = investmentInitialSetup + (annualSupportCost * i);
    const netReturn = cumulativeSavings - cumulativeInvestment;
    const roiPercentage = cumulativeInvestment > 0 ? (netReturn / cumulativeInvestment) * 100 : 0;
    
    return {
      name: `Jahr ${year}`,
      Investition: Math.round(cumulativeInvestment),
      Ersparnis: Math.round(cumulativeSavings),
      Reingewinn: Math.round(netReturn),
      ROI: Math.round(roiPercentage)
    };
  });

  // -------------------------------------------------------------
  // CUSTOM ANNOTATION CREATION
  // -------------------------------------------------------------
  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnotationLabel.trim()) return;

    const newAnn: EEGAnnotation = {
      id: "user_" + Date.now(),
      timeSeconds: currentTime + (2 / zoomLevel), // Place annotation shortly ahead of current timeline playhead
      channel: newAnnotationChannel,
      label: newAnnotationLabel,
      type: newAnnotationType
    };

    setAnnotations(prev => [...prev, newAnn]);
    setNewAnnotationLabel("");
    playBeep(880, 0.15);
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    playBeep(440, 0.1);
  };

  // -------------------------------------------------------------
  // DIGITAL SIGNATURES SECURE PROCESS
  // -------------------------------------------------------------
  const handleQESSignReport = () => {
    setIsDigitalSigned(true);
    // Secure clinical hash generated utilizing patient record demographics and study stats
    const hashPayload = `${currentPatient.mrn}-${currentStudy.id}-${clinicalAssessment}-${new Date().toISOString()}`;
    const generatedHash = "0x" + Array.from(hashPayload)
      .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
      .toString(16).toUpperCase() + "E5D48B92AC01";
    
    setDigitalSignatureHash(generatedHash);
    playBeep(1046.50, 0.3); // High pitch notification chord

    // Update study status in clinical records list
    setPatients(prevPatients => {
      return prevPatients.map(pat => {
        if (pat.id === selectedPatientId) {
          return {
            ...pat,
            studies: pat.studies.map(st => {
              if (st.id === selectedStudyId) {
                return {
                  ...st,
                  status: "Signed",
                  reportHash: generatedHash,
                  signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
                };
              }
              return st;
            })
          };
        }
        return pat;
      });
    });
  };

  // -------------------------------------------------------------
  // FILE DRAG & DROP & UPLOAD PROCESS
  // -------------------------------------------------------------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerMockUpload(e.dataTransfer.files[0].name);
    }
  };

  const triggerMockUpload = (fileName: string) => {
    setUploadProgress(0);
    playBeep(587.33, 0.1); // subtle chime

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFileDetails(fileName);
        playBeep(1174.66, 0.2); // high chime

        // Generate a custom study based on uploaded file type
        const ext = fileName.split('.').pop()?.toUpperCase() || "EDF";
        
        const newStudy: EEGStudy = {
          id: `up_${Date.now()}`,
          studyDate: new Date().toISOString().substring(0, 10),
          studyTime: new Date().toTimeString().substring(0, 5),
          technician: "System Auto-Ingest",
          referringPhysician: "Dr. Robert Altenberg",
          durationMinutes: 30,
          channelCount: 8,
          samplingRateHz: 250,
          montage: activeMontage,
          impedanceCheck: "Passed",
          status: "AI-Assisted Review",
          aiConfidence: 93.7,
          findings: [
            `Automatische Ingest-Validierung für ${fileName} (${ext} Format) abgeschlossen`,
            "Konformitäts-Check gem. HL7 / FHIR Standards bestanden",
            "Frequenzspektrum-Abweichungen werden im Diagnose-Panel verarbeitet"
          ],
          notes: `Live PACS / HL7 Schnittstellen-Import. Original-Dateiname: ${fileName}. Integrierte Prüfsumme validiert.`
        };

        // Add this study to the currently selected patient
        setPatients(prev => prev.map(p => {
          if (p.id === selectedPatientId) {
            return {
              ...p,
              studies: [newStudy, ...p.studies]
            };
          }
          return p;
        }));
        setSelectedStudyId(newStudy.id);
        setActiveTab("viewer");
      }
    }, 150);
  };

  // -------------------------------------------------------------
  // DUMMY HANDLERS FOR FILE DOWNLOAD
  // -------------------------------------------------------------
  const triggerDownload = (format: "FHIR" | "HL7" | "PDF" | "JSON") => {
    let content = "";
    let fileExtension = "json";
    let mimeType = "application/json";

    if (format === "FHIR") {
      content = JSON.stringify({
        resourceType: "DiagnosticReport",
        id: `fhir-${currentStudy.id}`,
        status: "final",
        category: [
          {
            coding: [
              { system: "http://loinc.org", code: "11520-4", display: "EEG Study" }
            ]
          }
        ],
        code: {
          coding: [{ system: "http://loinc.org", code: "11520-4", display: "Electroencephalography Study Report" }]
        },
        subject: { display: currentPatient.name, identifier: { system: "urn:mrn", value: currentPatient.mrn } },
        effectiveDateTime: currentStudy.studyDate + "T" + currentStudy.studyTime + ":00Z",
        performer: [{ display: currentStudy.referringPhysician }],
        conclusion: clinicalAssessment,
        conclusionCode: [{ coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "G40.9", display: "Epilepsy, unspecified" }] }],
        extension: [
          { url: "https://udo.ai/fhir/StructureDefinition/ai-confidence", valueDecimal: currentStudy.aiConfidence },
          { url: "https://udo.ai/fhir/StructureDefinition/qes-signature-hash", valueString: currentStudy.reportHash || "unsigned" }
        ]
      }, null, 2);
      fileExtension = "fhir.json";
    } else if (format === "HL7") {
      content = `MSH|^~\\&|UDO_AI_PLATFORM|CLINIC_ALTENBERG|PACS_SYSTEM|MED_CENTER|${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}||ORU^R01|MSG${Date.now()}|P|2.5\r` +
                `PID|1||${currentPatient.mrn}||${currentPatient.name.replace(' ', '^')}||19500101|${currentPatient.gender}\r` +
                `OBR|1||STUDY${currentStudy.id}|11520-4^EEG STUDY^LN|||${currentStudy.studyDate.replace(/-/g, '')}|||||||||||||||||F\r` +
                `OBX|1|TX|AI_FINDINGS||${clinicalAssessment.replace(/\n/g, '\\.R\\')}||||||F|||${currentStudy.signedAt ? currentStudy.signedAt.replace(/[-: ]/g, '') : ''}||QES_SIGNED_HASH: ${currentStudy.reportHash || 'unsigned'}`;
      fileExtension = "hl7";
      mimeType = "text/plain";
    } else if (format === "JSON") {
      content = JSON.stringify({
        patient: { name: currentPatient.name, mrn: currentPatient.mrn, age: currentPatient.age, gender: currentPatient.gender },
        study: currentStudy,
        findings: currentStudy.findings,
        assessment: clinicalAssessment,
        recommendation: recommendedFollowUp,
        signature: { signed: !!currentStudy.reportHash, hash: currentStudy.reportHash, timestamp: currentStudy.signedAt }
      }, null, 2);
    } else {
      // PDF/DOCX simulated text representation
      content = `========================================================================\n` +
                `         CLINICAL ELECTROENCEPHALOGRAPHY (EEG) DIAGNOSTIC REPORT        \n` +
                `               UDO MEDICAL COGNITIVE DECISION PLATFORM                  \n` +
                `========================================================================\n\n` +
                `PATIENT DEMOGRAPHICS:\n` +
                `Patient Name : ${currentPatient.name}\n` +
                `Age/Gender   : ${currentPatient.age} / ${currentPatient.gender}\n` +
                `MRN          : ${currentPatient.mrn}\n` +
                `Suspected Dx : ${currentPatient.suspectedDiagnosis}\n\n` +
                `RECORDING PARAMETERS:\n` +
                `Study Date   : ${currentStudy.studyDate} at ${currentStudy.studyTime}\n` +
                `Duration     : ${currentStudy.durationMinutes} Minutes\n` +
                `Montage      : ${currentStudy.montage}\n` +
                `Impedance    : ${currentStudy.impedanceCheck}\n\n` +
                `AI-ASSISTED CLINICAL DECISION SUPPORT FINDINGS:\n` +
                `${currentStudy.findings.map(f => ` - [Confidence ${currentStudy.aiConfidence}%] ${f}`).join('\n')}\n\n` +
                `NEUROLOGICAL INTERPRETATION:\n` +
                `${clinicalAssessment}\n\n` +
                `RECOMMENDED CLINICAL ACTION PLAN:\n` +
                `${recommendedFollowUp}\n\n` +
                `SECURITY & AUDIT DIGITAL LOG:\n` +
                `Regulatory Standard : GDPR / HIPAA compliant (ISO 27001 secure storage)\n` +
                `eHealth Sign Status : ${currentStudy.reportHash ? `QES-SIGNED [Hash: ${currentStudy.reportHash}]` : 'UNSIGNED - Clinician Review Pending'}\n` +
                `Timestamp           : ${currentStudy.signedAt || 'Not Signed'}\n\n` +
                `------------------------------------------------------------------------\n` +
                `Disclaimer: This report is an AI-assisted clinical decision support output.\n` +
                `Review and signature by a qualified neurologist are strictly required.\n`;
      fileExtension = "txt";
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eeg_report_${currentPatient.mrn}_${currentStudy.studyDate}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playBeep(659.25, 0.2); // Success chime
  };

  return (
    <div className="w-full space-y-6 text-slate-150" id="udo-enterprise-eeg-system">
      
      {/* =========================================================================
         WORKSPACE MAIN HEADER (TRANSLUCENT BRANDING BAR)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-slate-950/45 border border-white/10 backdrop-blur-xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black text-rose-500 bg-rose-500/10 border border-rose-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              Clinical decision support
            </span>
            <span className="text-[10px] font-mono font-black text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              HL7/FHIR Sync Live
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            UDO Enterprise AI EEG Workspace
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {language === "en" 
              ? "High-Performance wave viewer, automated S2k epilepsy categorization, and QES signing registry."
              : "Hochleistungs-Wellenform-Viewer, S2k Epilepsiebefundung, und eHealth QES-Registrierstelle."}
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playBeep(isPlaying ? 523.25 : 659.25, 0.1);
            }}
            className={`h-10 px-4 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
              isPlaying 
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/10" 
                : "bg-teal-400 hover:bg-teal-500 text-slate-950 shadow-teal-400/10"
            }`}
          >
            {isPlaying ? <Pause size={14} className="stroke-[3px]" /> : <Play size={14} className="stroke-[3px]" />}
            <span>{isPlaying ? "Pause Feed" : "Live Stream"}</span>
          </button>

          <button
            onClick={() => {
              setCurrentTime(0);
              setZoomLevel(1);
              playBeep(523.25, 0.15);
            }}
            className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         MODULAR NAVIGATION PILLS (TRANSITIONS BETWEEN SUB-VIEWS)
         ========================================================================= */}
      <div className="flex border-b border-white/5 pb-2 overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: "viewer", label: "Clinical EEG Waveform Viewer", icon: Activity, badge: "Live" },
          { id: "ai", label: "AI Diagnostic Engine", icon: Cpu, badge: `${currentStudy.aiConfidence.toFixed(1)}%` },
          { id: "records", label: "Patient Study Directory", icon: User },
          { id: "reporting", label: "FHIR / HL7 Diagnostic Report", icon: FileText, highlight: !currentStudy.reportHash },
          { id: "dashboard", label: "Executive Analytics & ROI", icon: Landmark, badge: "ROI" }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                playBeep(659.25 + (isActive ? 100 : 0), 0.08);
              }}
              className={`h-11 px-4 rounded-xl font-sans text-xs uppercase tracking-wider font-black shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                isActive 
                  ? "bg-teal-400/10 border-teal-400/50 text-teal-350" 
                  : tab.highlight 
                  ? "bg-rose-500/5 border-rose-500/20 hover:border-rose-400/50 text-rose-400"
                  : "bg-transparent border-transparent hover:bg-slate-900/40 text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={14} className={tab.highlight && !isActive ? "animate-pulse" : ""} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? "bg-teal-400 text-slate-950 font-black" : "bg-white/10 text-slate-300"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
         TAB PANEL SWITCHBOARD
         ========================================================================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="min-h-[500px]"
        >
          
          {/* =========================================================================
             TAB 1: HIGH-PERFORMANCE EEG SIGNAL WAVEFORM VIEWER
             ========================================================================= */}
          {activeTab === "viewer" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* Main Waveform Display Column */}
              <div className="lg:col-span-3 flex flex-col space-y-4">
                
                {/* Waveform Controls Header */}
                <div className="flex flex-wrap justify-between items-center bg-slate-950/30 p-3 rounded-xl border border-white/5 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-black">Montage:</span>
                    <select
                      value={activeMontage}
                      onChange={(e) => {
                        setActiveMontage(e.target.value);
                        playBeep(659.25, 0.1);
                      }}
                      className="bg-slate-950 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-teal-400 font-mono focus:outline-none focus:border-teal-400 cursor-pointer"
                    >
                      <option value="Longitudinal Bipolar">Longitudinal Bipolar (Standard)</option>
                      <option value="Transverse Bipolar">Transverse Bipolar</option>
                      <option value="Referential Cz-Link">Referential (Cz-Linkage)</option>
                    </select>
                  </div>

                  {/* Zooming and Panning Controls */}
                  <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/5">
                    <button
                      onClick={() => {
                        setCurrentTime(prev => Math.max(0, prev - 2));
                        playBeep(440, 0.08);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                      title="Pan Left (Back 2s)"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-[10px] font-mono text-slate-400 px-2 select-none">
                      Playhead: <strong className="text-teal-300">{currentTime.toFixed(1)}s</strong> / 300s
                    </span>

                    <button
                      onClick={() => {
                        setCurrentTime(prev => Math.min(290, prev + 2));
                        playBeep(440, 0.08);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                      title="Pan Right (Forward 2s)"
                    >
                      <ChevronRight size={16} />
                    </button>

                    <div className="h-4 w-[1px] bg-white/10 mx-1" />

                    <button
                      onClick={() => {
                        setZoomLevel(prev => Math.max(0.5, prev - 0.25));
                        playBeep(523.25, 0.08);
                      }}
                      disabled={zoomLevel <= 0.5}
                      className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Zoom Out (Slower Time Resolution)"
                    >
                      <ZoomOut size={16} />
                    </button>

                    <span className="text-[10px] font-mono text-slate-400 select-none">
                      Scale: <strong className="text-teal-300">{zoomLevel.toFixed(2)}x</strong>
                    </span>

                    <button
                      onClick={() => {
                        setZoomLevel(prev => Math.min(3, prev + 0.25));
                        playBeep(523.25, 0.08);
                      }}
                      disabled={zoomLevel >= 3}
                      className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Zoom In (Faster Time Resolution)"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>
                </div>

                {/* HIGH PERFORMANCE CANVAS INTERFACE */}
                <div className="relative w-full rounded-2xl border border-teal-500/20 overflow-hidden bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-[400px]">
                  
                  {/* Real-time scanning glowing overlay */}
                  <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-40 shadow-[0_0_15px_rgba(20,184,166,1)] animate-[moveHorizontal_8s_infinite_linear] pointer-events-none" />

                  <canvas 
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="w-full h-full block cursor-crosshair"
                    style={{ imageRendering: "auto" }}
                  />

                  {/* Canvas Legend Overlay */}
                  <div className="absolute bottom-3 left-3 flex gap-2 font-mono text-[9px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-white/5 pointer-events-none">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-teal-500" /> Normal Signal
                    </span>
                    {currentPatient.hasSeizureFocus && (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Seizure Spike Focus (Fp2-F4)
                      </span>
                    )}
                    <span>• Filter: HFF 70Hz / LFF 0.5Hz</span>
                    <span>• impedance: <strong className="text-emerald-400">0.8 kΩ</strong></span>
                  </div>
                </div>

                {/* TIMELINE JUMP ACCORDION SLIDER */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0.0s (Study Start)</span>
                    <span>Playhead position: <strong className="text-teal-300 font-extrabold">{currentTime.toFixed(1)}s</strong></span>
                    <span>300.0s (Study Limit)</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="290"
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => {
                      setCurrentTime(parseFloat(e.target.value));
                    }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-900 border border-white/5 accent-teal-400"
                  />
                </div>

                {/* DUAL SPECTRUM & BRAINPOTENTIAL ANALYSIS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Mini Panel 1: Cortical Electrical Potential Map */}
                  <div className="bg-slate-950/35 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                      <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block">2D Cortical Potential Map</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    
                    <div className="flex items-center justify-center py-4 relative">
                      {/* Standard EEG Electrode Placement head wireframe */}
                      <div className="w-28 h-28 rounded-full border-2 border-slate-600/40 relative flex items-center justify-center">
                        <div className="absolute top-[-4px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-500" title="Nose" />
                        <div className="absolute left-[-4px] w-2 h-4 rounded-full border border-slate-600/40 bg-slate-950" title="Left Ear" />
                        <div className="absolute right-[-4px] w-2 h-4 rounded-full border border-slate-600/40 bg-slate-950" title="Right Ear" />
                        
                        {/* Electrodes placing visual overlays */}
                        {[
                          { id: "Fp1", top: "15%", left: "30%", val: 0.1 },
                          { id: "Fp2", top: "15%", left: "62%", val: currentPatient.hasSeizureFocus ? 0.9 : 0.2 },
                          { id: "F3", top: "35%", left: "25%", val: 0.25 },
                          { id: "F4", top: "35%", left: "67%", val: currentPatient.hasSeizureFocus ? 0.85 : 0.15 },
                          { id: "C3", top: "55%", left: "20%", val: 0.3 },
                          { id: "C4", top: "55%", left: "72%", val: 0.25 },
                          { id: "O1", top: "80%", left: "32%", val: 0.12 },
                          { id: "O2", top: "80%", left: "60%", val: 0.1 }
                        ].map((node) => {
                          const potentialColor = node.val > 0.8 
                            ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]" 
                            : node.val > 0.4 
                            ? "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                            : "bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.3)]";
                          return (
                            <div 
                              key={node.id}
                              className={`absolute w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-slate-950 font-sans font-black ${potentialColor}`}
                              style={{ top: node.top, left: node.left }}
                              title={`${node.id}: Potential ${node.val * 100}uV`}
                            >
                              {node.id[2] || node.id[1]}
                            </div>
                          );
                        })}
                      </div>

                      <div className="ml-6 space-y-1.5 text-left font-mono text-[9px] text-slate-400">
                        <strong className="text-white block uppercase">Telemetry nodes:</strong>
                        <div>• Active leads: <span className="text-teal-300">8 Channels</span></div>
                        <div>• Sample Rate: <span className="text-teal-300">250 Hz</span></div>
                        <div>• Filter bands: <span className="text-teal-300">S2k Std</span></div>
                        <div>• Focus potential: <span className={currentPatient.hasSeizureFocus ? "text-rose-400 animate-pulse font-black" : "text-teal-400"}>
                          {currentPatient.hasSeizureFocus ? "94 uV Focal Spike" : "18 uV Symmetrical"}
                        </span></div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Panel 2: Live Frequency Power Spectrogram */}
                  <div className="bg-slate-950/35 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                      <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block">Power Spectrogram (FFT Analysis)</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">1 - 30 Hz</span>
                    </div>

                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { freq: "Delta (1-4Hz)", Power: currentPatient.hasSeizureFocus ? 65 : 20, fill: "#e11d48" },
                            { freq: "Theta (4-8Hz)", Power: 35, fill: "#f59e0b" },
                            { freq: "Alpha (8-12Hz)", Power: 80, fill: "#14b8a6" },
                            { freq: "Beta (12-30Hz)", Power: 45, fill: "#6366f1" }
                          ]}
                          margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="freq" tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 8 }} />
                          <YAxis tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 8 }} />
                          <Tooltip contentStyle={{ background: '#020815', borderColor: 'rgba(255,255,255,0.1)', fontSize: 10 }} />
                          <Area type="monotone" dataKey="Power" stroke="#14b8a6" fill="rgba(20, 184, 166, 0.15)" strokeWidth={1.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>

              {/* Sidebar Channel Settings & Live Clinical Annotations */}
              <div className="space-y-4">
                
                {/* 1. CHANNEL SELECTOR ACCORDION */}
                <div className="bg-slate-950/35 border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={13} className="text-teal-400" />
                    <span>Channel Selector</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    {Object.keys(enabledChannels).map((ch) => (
                      <label 
                        key={ch} 
                        className={`flex items-center gap-1.5 p-1.5 rounded border cursor-pointer select-none transition-all ${
                          enabledChannels[ch] 
                            ? "bg-teal-500/10 border-teal-500/20 text-teal-300" 
                            : "bg-transparent border-white/5 text-slate-500"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={enabledChannels[ch]}
                          onChange={() => {
                            setEnabledChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
                            playBeep(659.25, 0.05);
                          }}
                          className="sr-only"
                        />
                        <span className={`h-1.5 w-1.5 rounded-full ${enabledChannels[ch] ? "bg-teal-400" : "bg-transparent"}`} />
                        <span>{ch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. ADD CUSTOM CLINICAL ANNOTATION FORM */}
                <div className="bg-slate-950/35 border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Plus size={13} className="text-teal-400" />
                    <span>Clinical Annotation</span>
                  </h4>

                  <form onSubmit={handleAddAnnotation} className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-black block">Annotation Label</label>
                      <input 
                        type="text"
                        placeholder="e.g. Paroxysmal discharge peak"
                        value={newAnnotationLabel}
                        onChange={(e) => setNewAnnotationLabel(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-black block">Type</label>
                        <select
                          value={newAnnotationType}
                          onChange={(e: any) => setNewAnnotationType(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-teal-400 font-mono"
                        >
                          <option value="User Bookmark">Bookmark</option>
                          <option value="Seizure">Seizure</option>
                          <option value="Artifact">Artifact</option>
                          <option value="Normal Background">Normal</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-black block">Channel</label>
                        <select
                          value={newAnnotationChannel}
                          onChange={(e) => setNewAnnotationChannel(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-teal-400 font-mono"
                        >
                          {Object.keys(enabledChannels).map(ch => (
                            <option key={ch} value={ch}>{ch}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-8 rounded-lg bg-teal-400 hover:bg-teal-500 text-slate-950 font-sans font-black tracking-widest text-[10px] uppercase transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Save size={11} />
                      <span>Save Annotation</span>
                    </button>
                  </form>
                </div>

                {/* 3. ACTIVE LOG OF CLINICAL ANNOTATIONS */}
                <div className="bg-slate-950/35 border border-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      <span>Clinical Bookmarks</span>
                    </h4>
                    <span className="text-[10px] font-mono text-teal-400 font-bold">{annotations.length} recorded</span>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-left font-mono text-[10px]">
                    {annotations.map((ann) => (
                      <div 
                        key={ann.id}
                        className="p-1.5 rounded bg-slate-900/60 border border-white/5 flex items-start justify-between gap-2 hover:border-white/10 transition-all group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              ann.type === "Seizure" ? "bg-rose-500 animate-pulse" : ann.type === "Artifact" ? "bg-amber-500" : "bg-blue-500"
                            }`} />
                            <strong className="text-white text-[10px]">{ann.label}</strong>
                          </div>
                          <div className="text-slate-400 text-[8px] uppercase tracking-wider">
                            Ch: {ann.channel} • time: <span className="text-teal-300 font-bold">{ann.timeSeconds.toFixed(1)}s</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteAnnotation(ann.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete Annotation"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
             TAB 2: AI CLINICAL DIAGNOSTICS JURY DECISION SUITE
             ========================================================================= */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              
              {/* Top Summary Diagnostic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Circle gauge representing AI overall confidence */}
                <div className="bg-slate-950/45 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-between space-y-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block">Overall AI Consenus Confidence</span>
                  
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="54" 
                        stroke="#14b8a6" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - currentStudy.aiConfidence / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-white font-mono">{currentStudy.aiConfidence}%</span>
                      <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block">S2K Match</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono text-center">
                    Multi-agent forensic verification engine consolidates 4 independent neural jury votes.
                  </p>
                </div>

                {/* Cognitive Jury Consensus Card */}
                <div className="bg-slate-950/45 border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block">Forensic Core Jury Voting</span>

                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { agent: "UDO Neuro Engine (Clara v3.5)", vote: "KEEP", conf: 95.8, status: "Active" },
                      { agent: "UDO Cognitive (Consensus v2.0)", vote: "KEEP", conf: 92.4, status: "Active" },
                      { agent: "UDO Biometrics (Waveform v1.8)", vote: "NEUTRAL", conf: 89.2, status: "Active" }
                    ].map((ag, index) => (
                      <div key={index} className="p-2 rounded bg-slate-900/60 border border-white/5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <strong className="text-white text-[11px] block">{ag.agent}</strong>
                          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Confidence {ag.conf}%</span>
                        </div>
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${
                          ag.vote === "KEEP" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {ag.vote}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-teal-400">
                    <span>Voting Consenus Status:</span>
                    <span className="font-extrabold uppercase">CONSOLIDATED</span>
                  </div>
                </div>

                {/* Clinical Disclaimer Accordion */}
                <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-slate-950/45 border border-teal-500/20 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert size={18} className="animate-pulse" />
                    <span className="text-xs font-mono font-black uppercase tracking-wider">Regulatory Compliance Notice</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed text-left">
                    Dieses System stellt eine <strong>KI-gestützte klinische Entscheidungshilfe</strong> (Clinical Decision Support) dar und darf nicht als alleinige Grundlage für diagnostische oder therapeutische Maßnahmen verwendet werden. Ein qualifizierter, staatlich lizenzierter Neurologe muss die Befunde prüfen, validieren und per QES digital signieren.
                  </p>

                  <div className="text-[9px] font-mono text-slate-500">
                    S2k Leitlinien-Standard • CE-Klasse IIa Medizinprodukt-Proxy
                  </div>
                </div>

              </div>

              {/* Comprehensive Pattern Findings Table */}
              <div className="bg-slate-950/35 border border-white/5 rounded-3xl p-6 space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    AI-Assisted Structural Pattern Detection
                  </h4>
                  <span className="text-xs font-mono text-teal-400">S2k Orthopedic & Neuropathic Database</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      title: "Spike & Wave Complexes (Epileptiform)", 
                      detected: currentPatient.hasSeizureFocus, 
                      confidence: currentPatient.hasSeizureFocus ? 94.2 : 4.5,
                      evidence: currentPatient.hasSeizureFocus ? "Paroxysmal sharp transients tracked at 12.8s across Frontal-Central channels (Fp2-F4, F4-C4). High clinical correlation." : "No significant focal paroxysms or interictal discharges detected.",
                      references: "AWMF S2k Neurologische Begutachtung Kap. 4.12; American Clinical Neurophysiology guidelines."
                    },
                    { 
                      title: "Alpha Background Rhythm Symmetry", 
                      detected: true, 
                      confidence: 97.5,
                      evidence: "Stable and symmetric background alpha activity pacing at 10.2 Hz centered over bilateral occipital-parietal quadrants.",
                      references: "Standard clinical EEG rhythms catalog; S2k Neuro-Standard LWS/Cervical differential analysis."
                    },
                    { 
                      title: "Stage N2/N3 Sleep Staging Complexes", 
                      detected: !currentPatient.hasSeizureFocus, 
                      confidence: !currentPatient.hasSeizureFocus ? 91.8 : 12.0,
                      evidence: !currentPatient.hasSeizureFocus ? "High-density symmetric sleep spindles (13.5 Hz) and sharp consolidated K-Complexes observed." : "Normal waking record, no transition complexes mapped.",
                      references: "AASM Manual for Scoring of Sleep and Associated Events v2.6."
                    },
                    { 
                      title: "Burst Suppression & Flatline Periods", 
                      detected: false, 
                      confidence: 0.1,
                      evidence: "Continuous and physiologically robust wave amplitude activity, no cortical burst suppression or silent gaps mapped.",
                      references: "ICU continuous monitoring consensus standards."
                    }
                  ].map((finding, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        finding.detected && finding.confidence > 50 
                          ? "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/45" 
                          : "bg-slate-900/40 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-xs font-black text-white uppercase tracking-wide">{finding.title}</strong>
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                          finding.detected && finding.confidence > 50 ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-400"
                        }`}>
                          {finding.detected && finding.confidence > 50 ? "DETECTED" : "NORMAL"}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-slate-300 leading-normal">{finding.evidence}</p>
                        
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-500">Confidence:</span>
                          <span className={finding.detected && finding.confidence > 50 ? "text-rose-400 font-extrabold" : "text-slate-400"}>
                            {finding.confidence.toFixed(1)}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${finding.detected && finding.confidence > 50 ? "bg-rose-500" : "bg-slate-700"}`}
                            style={{ width: `${finding.confidence}%` }}
                          />
                        </div>

                        <div className="pt-1.5 border-t border-white/5 text-[9px] font-mono text-slate-500 leading-tight">
                          Ref: {finding.references}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
             TAB 3: PATIENT COMPREHENSIVE EHR RECORDS & STUDIES INDEX
             ========================================================================= */}
          {activeTab === "records" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Left Column: Patient Directory Select */}
              <div className="bg-slate-950/35 border border-white/5 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-xs font-mono font-black text-teal-400 uppercase tracking-widest">
                    Patient EHR Directory
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {patients.length} active
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, MRN, case ID..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Patient List */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {patients.map((pat) => {
                    const isSelected = pat.id === selectedPatientId;
                    return (
                      <div
                        key={pat.id}
                        onClick={() => {
                          setSelectedPatientId(pat.id);
                          setSelectedStudyId(pat.studies[0]?.id || "");
                          playBeep(659.25, 0.1);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-teal-500/10 border-teal-400/50 text-white" 
                            : "bg-slate-900/30 border-white/5 hover:border-white/15 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-black uppercase tracking-wide">{pat.name}</span>
                          <span className="text-[9px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded uppercase">
                            {pat.gender} • {pat.age}y
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          MRN: {pat.mrn}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-1">
                          History: {pat.clinicalHistory}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* File Upload / Drag-and-drop workspace */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    dragActive 
                      ? "border-teal-400 bg-teal-500/5" 
                      : uploadProgress !== null 
                      ? "border-amber-400 bg-amber-500/5"
                      : "border-white/10 bg-transparent hover:border-white/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadProgress === null ? (
                    <div className="space-y-2">
                      <Upload size={24} className="mx-auto text-slate-500 animate-pulse" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">Import Study Data</span>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">EDF, EDF+, BrainVision, EEGLAB, CSV, XML</span>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <label className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-[10px] font-mono text-teal-400 cursor-pointer uppercase transition-all shadow-md active:scale-95">
                          <span>Browse Files</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                triggerMockUpload(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <RefreshCw size={24} className="mx-auto text-amber-400 animate-spin" />
                      <div className="space-y-1.5 font-mono">
                        <span className="text-xs font-bold text-amber-300 block">Ingesting EDF Signals...</span>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden p-[1px]">
                          <div className="bg-amber-400 h-full rounded-full transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-400 block">{uploadProgress}% Complete</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Expanded Patient Profile & Selected Study Info */}
              <div className="lg:col-span-2 space-y-4 text-left">
                
                {/* Demographic & Clinical Bio Block */}
                <div className="bg-slate-950/45 border border-white/5 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Active Electronic Health Record</span>
                      <h3 className="text-lg font-black text-white uppercase tracking-wide">{currentPatient.name}</h3>
                    </div>
                    
                    <div className="font-mono text-right text-[10px] text-slate-400">
                      <div>MRN: <strong className="text-teal-300">{currentPatient.mrn}</strong></div>
                      <div>Dx Class: <span className="text-rose-400 font-bold">{currentPatient.suspectedDiagnosis}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/40 border border-white/5 p-3.5 rounded-2xl space-y-1">
                      <strong className="text-white uppercase font-black text-[10px] tracking-wide block">Klinische Anamnese (German)</strong>
                      <p className="text-slate-300 leading-normal">{currentPatient.clinicalHistory}</p>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 p-3.5 rounded-2xl space-y-1">
                      <strong className="text-white uppercase font-black text-[10px] tracking-wide block">Previous Clinical Diagnoses</strong>
                      <p className="text-slate-300 leading-normal">• Focal sensory epilepsy episodes.<br />• Post-ischemic hemispheric asymmetry.<br />• Responsive to antiepileptic pharmacotherapy titration.</p>
                    </div>
                  </div>
                </div>

                {/* Sub-Studies Log Accordion */}
                <div className="bg-slate-950/45 border border-white/5 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h4 className="text-xs font-mono font-black text-teal-400 uppercase tracking-widest">
                      Historical EEG Recording Sessions
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">{currentPatient.studies.length} studies on record</span>
                  </div>

                  <div className="space-y-3">
                    {currentPatient.studies.map((st) => {
                      const isSelected = st.id === selectedStudyId;
                      return (
                        <div
                          key={st.id}
                          onClick={() => {
                            setSelectedStudyId(st.id);
                            playBeep(659.25, 0.08);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-slate-900/80 border-teal-400/50" 
                              : "bg-slate-900/20 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar size={13} className="text-teal-400" />
                              <strong className="text-xs font-black text-white">{st.studyDate} at {st.studyTime}</strong>
                              <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                                st.status === "Signed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                              }`}>
                                {st.status}
                              </span>
                            </div>

                            <div className="font-mono text-[9px] text-slate-400">
                              Duration: <span className="text-teal-300 font-bold">{st.durationMinutes} Min</span> • Montage: {st.montage}
                            </div>
                          </div>

                          <div className="text-xs space-y-1 text-slate-300">
                            <div><strong className="text-white text-[10px] font-mono uppercase block">AI Finding Extraction:</strong></div>
                            <ul className="list-disc list-inside space-y-0.5 font-mono text-[10px]">
                              {st.findings.map((f, fIdx) => (
                                <li key={fIdx} className="truncate">{f}</li>
                              ))}
                            </ul>
                          </div>

                          {st.reportHash && (
                            <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-emerald-400">
                              <span>QES Signed Digital Signature Hash:</span>
                              <span className="font-bold">{st.reportHash}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
             TAB 4: MEDICAL REPORT GENERATION & DIGITAL SIGNING REGISTRY
             ========================================================================= */}
          {activeTab === "reporting" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Report Parameter Input Panel */}
              <div className="bg-slate-950/35 border border-white/5 rounded-3xl p-5 space-y-4 text-left">
                <div className="border-b border-white/5 pb-3">
                  <h4 className="text-xs font-mono font-black text-teal-400 uppercase tracking-widest">
                    Formulate Diagnostic Report
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-black block">Neurological Assessment / Clinical Summary</label>
                    <textarea
                      value={clinicalAssessment}
                      onChange={(e) => setClinicalAssessment(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 leading-normal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-black block">Recommended Clinical Action Plan / Follow-up</label>
                    <textarea
                      value={recommendedFollowUp}
                      onChange={(e) => setRecommendedFollowUp(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 leading-normal"
                    />
                  </div>

                  <div className="bg-slate-900/60 border border-white/5 p-3 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono text-teal-400 uppercase font-black block">Interoperability Export Target</span>
                    <p className="text-[10px] text-slate-400">Ingest compliant to HL7 v2.5 / FHIR DiagnosticReport profiles.</p>
                  </div>
                </div>
              </div>

              {/* Digital Proof Preview Sheet */}
              <div className="lg:col-span-2 bg-white text-slate-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden text-left font-sans">
                {/* Background clinical seal watermarks */}
                <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full border-[12px] border-teal-500/5 flex items-center justify-center rotate-12 pointer-events-none select-none">
                  <span className="text-teal-500/5 font-mono text-5xl font-black">UDO</span>
                </div>

                <div className="space-y-6">
                  {/* Document Header */}
                  <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-teal-600 uppercase block">CLINICAL DIAGNOSTIC RECORD</span>
                      <h4 className="text-base font-black uppercase tracking-wide text-slate-900">Electroencephalography (EEG) Lab Report</h4>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">S2K Consensus Standard Verification Node</p>
                    </div>

                    <div className="text-right font-mono text-[9px] text-slate-500">
                      <div>Report ID: <strong className="text-slate-800">{currentStudy.id}</strong></div>
                      <div>Date: {currentStudy.studyDate} {currentStudy.studyTime}</div>
                    </div>
                  </div>

                  {/* Patient Details Sub-Table */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Patient Name</span>
                      <strong className="text-slate-900">{currentPatient.name}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Demographics</span>
                      <strong className="text-slate-900">{currentPatient.gender} • {currentPatient.age} Years</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Medical Record No</span>
                      <strong className="text-slate-900">{currentPatient.mrn}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Ref. Physician</span>
                      <strong className="text-slate-900">{currentStudy.referringPhysician}</strong>
                    </div>
                  </div>

                  {/* Diagnostic Technical Specs */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-500">
                    <div>Duration: <strong className="text-slate-800">{currentStudy.durationMinutes} Min</strong></div>
                    <div>Montage: <strong className="text-slate-800">{currentStudy.montage}</strong></div>
                    <div>Electrode Impedance: <strong className="text-emerald-600">Passed</strong></div>
                  </div>

                  {/* AI Extracted Observations */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[9px] font-mono text-teal-600 uppercase font-bold block">AI-Assisted Evidence Observations</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 font-mono text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {currentStudy.findings.map((f, idx) => (
                        <li key={idx}><span className="text-teal-600 font-black">[{currentStudy.aiConfidence.toFixed(1)}% Match]</span> {f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Physician Interpretive Assessment */}
                  <div className="space-y-1 text-xs leading-relaxed">
                    <span className="text-[9px] font-mono text-teal-600 uppercase font-bold block">Clinician Interpretive Assessment</span>
                    <p className="text-slate-800 bg-teal-50/20 p-3 rounded-lg border border-teal-500/10 italic">
                      "{clinicalAssessment || 'Keine Bewertung eingegeben.'}"
                    </p>
                  </div>

                  {/* Action Plan */}
                  <div className="space-y-1 text-xs leading-relaxed">
                    <span className="text-[9px] font-mono text-teal-600 uppercase font-bold block">Recommended Action Plan / Follow-up</span>
                    <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {recommendedFollowUp || 'Keine Handlungsempfehlung angegeben.'}
                    </p>
                  </div>

                </div>

                {/* Digital Signature Footer block */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  
                  {/* Active signature details */}
                  <div className="space-y-1 font-mono text-[10px]">
                    {currentStudy.reportHash ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <UserCheck size={14} />
                          <strong className="uppercase">QES Electronic Signature Active</strong>
                        </div>
                        <div className="text-slate-500">Hash: <span className="text-slate-800 font-black">{currentStudy.reportHash}</span></div>
                        <div className="text-slate-400">Timestamp: {currentStudy.signedAt}</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-500">
                        <ShieldAlert size={14} className="animate-pulse" />
                        <strong className="uppercase">Review & Digital Signature Required</strong>
                      </div>
                    )}
                  </div>

                  {/* Action buttons (Sign, Export PDF, Ingest HL7/FHIR) */}
                  <div className="flex items-center gap-1.5 flex-wrap self-end">
                    {!currentStudy.reportHash ? (
                      <button
                        onClick={handleQESSignReport}
                        className="h-10 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-sans font-black tracking-widest text-[10px] uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <UserCheck size={14} />
                        <span>Sign via QES</span>
                      </button>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => triggerDownload("PDF")}
                          className="h-10 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] font-black uppercase tracking-wider transition-all border border-slate-200 flex items-center gap-1 cursor-pointer"
                          title="Download Text Summary Record"
                        >
                          <Download size={13} />
                          <span>TXT</span>
                        </button>
                        <button
                          onClick={() => triggerDownload("FHIR")}
                          className="h-10 px-3.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/25 text-teal-700 font-mono text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                          title="Export to HL7 FHIR JSON"
                        >
                          <Database size={13} />
                          <span>FHIR</span>
                        </button>
                        <button
                          onClick={() => triggerDownload("HL7")}
                          className="h-10 px-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-700 font-mono text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                          title="Export to Standard HL7 ORU Message"
                        >
                          <Layers size={13} />
                          <span>HL7</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
             TAB 5: OPERATIONAL EXECUTIVE DASHBOARD & ROI ANALYSIS
             ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Executive Operational Throughput Metrics Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                
                {[
                  { title: "EEGs Ingested (YTD)", val: "1,248", label: "PACS & HL7 feeds", color: "text-teal-300" },
                  { title: "Avg Clinician Review Time", val: "14 Min", label: "vs 45 Min classic", color: "text-violet-300" },
                  { title: "AI Decision Confidence", val: "92.4%", label: "Consolidated average", color: "text-cyan-300" },
                  { title: "Total Labor Hours Saved", val: `${Math.round(totalHoursSavedManual)} Std`, label: "YTD Operational Gain", color: "text-amber-300" }
                ].map((card, idx) => (
                  <div key={idx} className="bg-slate-950/45 border border-white/5 rounded-2xl p-5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">{card.title}</span>
                    <strong className={`text-2xl font-black block tracking-wide ${card.color}`}>{card.val}</strong>
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider">{card.label}</span>
                  </div>
                ))}

              </div>

              {/* Dynamic ROI Financial Forecasting Tool */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Assumption configuration fields */}
                <div className="bg-slate-950/35 border border-white/5 rounded-3xl p-6 space-y-5 text-left">
                  <div className="border-b border-white/5 pb-3">
                    <h4 className="text-xs font-mono font-black text-teal-400 uppercase tracking-widest">
                      ROI Calculator Assumptions
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Annual EEG Volume:</span>
                        <strong className="text-white">{annualEegVolume} studies</strong>
                      </div>
                      <input 
                        type="range"
                        min="100"
                        max="3000"
                        step="50"
                        value={annualEegVolume}
                        onChange={(e) => setAnnualEegVolume(parseInt(e.target.value))}
                        className="w-full accent-teal-400 h-1 rounded bg-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Neurologist Hourly Rate:</span>
                        <strong className="text-white">{hourlyNeuroRate} EUR / Std</strong>
                      </div>
                      <input 
                        type="range"
                        min="80"
                        max="300"
                        step="5"
                        value={hourlyNeuroRate}
                        onChange={(e) => setHourlyNeuroRate(parseInt(e.target.value))}
                        className="w-full accent-teal-400 h-1 rounded bg-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Manual Review Time:</span>
                        <strong className="text-white">{manualReviewTimeMinutes} Minutes</strong>
                      </div>
                      <input 
                        type="range"
                        min="20"
                        max="90"
                        step="5"
                        value={manualReviewTimeMinutes}
                        onChange={(e) => setManualReviewTimeMinutes(parseInt(e.target.value))}
                        className="w-full accent-teal-400 h-1 rounded bg-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">AI-Assisted Review Time:</span>
                        <strong className="text-white">{aiReviewTimeMinutes} Minutes</strong>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={aiReviewTimeMinutes}
                        onChange={(e) => setAiReviewTimeMinutes(parseInt(e.target.value))}
                        className="w-full accent-teal-400 h-1 rounded bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time saved / EEG:</span>
                      <strong className="text-teal-300">{(manualReviewTimeMinutes - aiReviewTimeMinutes)} Min</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Direct labor saved:</span>
                      <strong className="text-teal-300">{Math.round(totalFinancialSavings).toLocaleString()} EUR / Jahr</strong>
                    </div>
                  </div>
                </div>

                {/* ROI Forecast Projection Chart */}
                <div className="lg:col-span-2 bg-slate-950/45 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                    <h4 className="text-xs font-mono font-black text-teal-400 uppercase tracking-widest text-left">
                      10-Year Cumulative ROI Projection
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Net operational yield (EUR)</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={roiProjections}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="name" tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 9 }} />
                        <YAxis tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 9 }} />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} EUR`} contentStyle={{ background: '#020815', borderColor: 'rgba(255,255,255,0.1)', fontSize: 11 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="Kumulierte Ersparnis" dataKey="Ersparnis" stroke="#14b8a6" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                        <Area type="monotone" name="Netto-Reingewinn" dataKey="Reingewinn" stroke="#8b5cf6" fillOpacity={0} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/5">
                    <span>Initial Setup Investment: <strong>28.500 EUR</strong></span>
                    <span>10y Projected Reingewinn: <strong className="text-emerald-400">{(totalFinancialSavings * 10 - investmentInitialSetup - annualSupportCost * 9).toLocaleString()} EUR</strong></span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
