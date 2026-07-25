import { 
  Mic, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  BookOpen, 
  Key,
  FolderOpen,
  Star,
  FileEdit,
  Video,
  Activity,
  Calendar,
  PhoneCall,
  Bot,
  Sparkles,
  LucideIcon
} from "lucide-react";

export type NavItemId = 
  | "udo"
  | "consult" 
  | "documents" 
  | "favorites" 
  | "notes" 
  | "gutachten" 
  | "dashboard" 
  | "compliance" 
  | "whitepaper" 
  | "admin"
  | "video_analyse"
  | "eeg"
  | "calendar"
  | "triage"
  | "chatbot"
  | "upgrades";

export interface NavItemConfig {
  id: NavItemId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  category: "communication" | "documents" | "medical" | "knowledge" | "favorites" | "automation";
  badge?: string;
  accentColor: string; // Tailwind color name for glow/border
  description: string;
  requiresAdminPasscode?: boolean;
}

export const NAV_ITEMS: NavItemConfig[] = [
  // UDO Module
  {
    id: "udo",
    label: "U.D.O. Neural Module",
    shortLabel: "UDO Core",
    icon: Sparkles,
    category: "automation",
    badge: "v4.0",
    accentColor: "cyan",
    description: "Universal Diagnostic Orchestrator & Multi-Agent Matrix",
  },
  // Kommunikation
  {
    id: "consult",
    label: "Consultation Portal",
    shortLabel: "Consult",
    icon: Mic,
    category: "communication",
    accentColor: "teal",
    description: "Unified Voice & Chat AI Consultation Portal",
  },
  {
    id: "chatbot",
    label: "Cologne Chatbot & Triage",
    shortLabel: "Chatbot",
    icon: Bot,
    category: "communication",
    accentColor: "teal",
    description: "Multi-Lingual Clinical AI Assistant",
  },
  {
    id: "triage",
    label: "Köln Telefon-Triage",
    shortLabel: "Triage",
    icon: PhoneCall,
    category: "communication",
    accentColor: "cyan",
    description: "Automated Patient Phone Intake & Dispatch",
  },

  // Dokumente
  {
    id: "documents",
    label: "Dokumenten Board",
    shortLabel: "Dokumente",
    icon: FolderOpen,
    category: "documents",
    accentColor: "cyan",
    description: "AWMF Leitlinien, Befunde & Patientenakten Bibliothek",
  },

  // Medizin & Diagnostik
  {
    id: "gutachten",
    label: "S2k Gutachten Portal",
    shortLabel: "Gutachten",
    icon: FileText,
    category: "medical",
    accentColor: "emerald",
    description: "Clinical MdE Calculator & AWMF Report Generator",
  },
  {
    id: "video_analyse",
    label: "Video Diagnostic Suite",
    shortLabel: "Video AI",
    icon: Video,
    category: "medical",
    accentColor: "emerald",
    description: "Kinematic Tracking & Gait Diagnostic Pipeline",
  },
  {
    id: "eeg",
    label: "EEG Neural Workspace",
    shortLabel: "EEG",
    icon: Activity,
    category: "medical",
    accentColor: "emerald",
    description: "Cortical Frequency Analysis & Spike Detection",
  },

  // Wissen & Notizen
  {
    id: "notes",
    label: "Klinische Notizen",
    shortLabel: "Notizen",
    icon: FileEdit,
    category: "knowledge",
    accentColor: "violet",
    description: "Schnellnotizen & Differenzialdiagnose Scratchpad",
  },
  {
    id: "whitepaper",
    label: "System Whitepaper",
    shortLabel: "Whitepaper",
    icon: BookOpen,
    category: "knowledge",
    accentColor: "violet",
    description: "UDO AI Architecture & Consensus Specifications",
  },

  // Favoriten
  {
    id: "favorites",
    label: "Favoriten & Pins",
    shortLabel: "Favoriten",
    icon: Star,
    category: "favorites",
    accentColor: "amber",
    description: "Gepinntes AWMF Regelwerk, ICD-10 Codes & Schnellvorlagen",
  },

  // Automation & Management
  {
    id: "dashboard",
    label: "Executive Board",
    shortLabel: "Dashboard",
    icon: BarChart3,
    category: "automation",
    accentColor: "indigo",
    description: "Executive ROI, Throughput & Financial Metrics",
  },
  {
    id: "calendar",
    label: "Kalender & Termine",
    shortLabel: "Kalender",
    icon: Calendar,
    category: "automation",
    accentColor: "indigo",
    description: "Clinical Schedule & Patient Appointment Manager",
  },
  {
    id: "upgrades",
    label: "Praxis Upgrades",
    shortLabel: "Upgrades",
    icon: Sparkles,
    category: "automation",
    accentColor: "amber",
    description: "AI Workflows & Enterprise System Modules",
  },
  {
    id: "compliance",
    label: "Compliance & GDPR",
    shortLabel: "Compliance",
    icon: ShieldCheck,
    category: "automation",
    accentColor: "cyan",
    description: "Art. 15/17 Data Rights, Consent & HIPAA Log",
  },
  {
    id: "admin",
    label: "Admin & API Keys",
    shortLabel: "Admin",
    icon: Key,
    category: "automation",
    accentColor: "amber",
    description: "Model Vault & Multi-Provider API Key Registry",
    requiresAdminPasscode: true,
  },
];

export function getNavItemConfig(id: NavItemId | null | undefined): NavItemConfig | undefined {
  if (!id) return undefined;
  return NAV_ITEMS.find((item) => item.id === id);
}

export const NAV_ITEMS_FLAT = NAV_ITEMS;

export const NAV_CATEGORIES = [
  {
    id: "diagnostik",
    title: "Medizin & Diagnostik",
    icon: "🩺",
    items: [
      { id: "consult", label: "Consultation Portal", icon: Mic },
      { id: "gutachten", label: "S2k Gutachten Portal", icon: FileText },
      { id: "eeg", label: "EEG Neural Workspace", icon: Activity },
      { id: "video_analyse", label: "Video Diagnostic Suite", icon: Video },
    ],
  },
  {
    id: "forensik",
    title: "Dokumente & Recht",
    icon: "📜",
    items: [
      { id: "documents", label: "Dokumenten Board", icon: FolderOpen },
      { id: "notes", label: "Klinische Notizen", icon: FileEdit },
      { id: "whitepaper", label: "System Whitepaper", icon: BookOpen },
    ],
  },
  {
    id: "praxis",
    title: "Praxis & Management",
    icon: "⚙️",
    items: [
      { id: "dashboard", label: "Executive Board", icon: BarChart3 },
      { id: "calendar", label: "Kalender & Termine", icon: Calendar },
      { id: "admin", label: "Admin & API Keys", icon: Key },
    ],
  },
];

