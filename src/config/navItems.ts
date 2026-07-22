import { 
  Mic, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  BookOpen, 
  Key,
  LucideIcon
} from "lucide-react";

export type NavItemId = "consult" | "gutachten" | "dashboard" | "compliance" | "whitepaper" | "admin";

export interface NavItemConfig {
  id: NavItemId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badge?: string;
  accentColor: string; // Tailwind color name for glow/border (e.g., "teal", "violet", "amber")
  description: string;
  requiresAdminPasscode?: boolean;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "consult",
    label: "Consult Portal",
    shortLabel: "Consult",
    icon: Mic,
    accentColor: "teal",
    description: "Unified Voice & Chat AI Consultation Portal",
  },
  {
    id: "gutachten",
    label: "S2k Gutachten",
    shortLabel: "Gutachten",
    icon: FileText,
    accentColor: "emerald",
    description: "Clinical MdE Calculator & AWMF Report Generator",
  },
  {
    id: "dashboard",
    label: "Executive Board",
    shortLabel: "Dashboard",
    icon: BarChart3,
    accentColor: "indigo",
    description: "Executive ROI, Throughput & Financial Metrics",
  },
  {
    id: "compliance",
    label: "Compliance & GDPR",
    shortLabel: "Compliance",
    icon: ShieldCheck,
    accentColor: "cyan",
    description: "Art. 15/17 Data Rights, Consent & HIPAA Log",
  },
  {
    id: "whitepaper",
    label: "System Whitepaper",
    shortLabel: "Whitepaper",
    icon: BookOpen,
    accentColor: "violet",
    description: "UDO AI Architecture & Consensus Specifications",
  },
  {
    id: "admin",
    label: "Admin & API Keys",
    shortLabel: "Admin",
    icon: Key,
    accentColor: "amber",
    description: "Model Vault & Multi-Provider API Key Registry",
    requiresAdminPasscode: true,
  },
];
