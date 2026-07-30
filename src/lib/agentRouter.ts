/**
 * 4 AGENT ORCHESTRATOR FOR UDO SYSTEM (Extended for Rich Context & Memory Retrieval)
 * Maximize token utility by intelligently routing queries to specialized AI agents:
 * - UDO (Primary Orchestrator): Handles general system & clinical orchestration queries.
 * - Gratsiano (Greeter): Handles greetings ("hello", "guten tag"), thanks ("thank you"), and short confirmations (<20 words).
 * - Clara (Admin): Handles scheduling, patient records, administrative tasks, and appointments.
 * - Erik (Medical): Handles complex, detailed medical diagnoses, differential analysis, and S2k guidelines.
 */

import { vectorMemoryService } from '../services/vectorMemoryService';
import { loggerService } from '../services/loggerService';

export interface AgentDefinition {
  id: 'udo' | 'gratsiano' | 'clara' | 'erik';
  name: string;
  roleTitle: string;
  systemPrompt: string;
}

export interface RouteResult {
  agent: AgentDefinition;
  agentId: string;
  action?: string;
  reason: string;
  fullSystemPrompt: string;
  retrievedContext?: string[];
  isDetailedRequest: boolean;
}

export const AGENT_DEFINITIONS: Record<string, AgentDefinition> = {
  gratsiano: {
    id: 'gratsiano',
    name: 'Gratsiano',
    roleTitle: 'Empfangs- & Quick-Response Agent',
    systemPrompt: `You are Gratsiano, warm front-desk greeter. Friendly, calm, human. Sie-form German default. Max 2 short sentences, no fluff/jokes, genuinely welcoming.`,
  },
  clara: {
    id: 'clara',
    name: 'Dr. Clara Voss',
    roleTitle: 'Administrative & Patient Workflow Agent',
    systemPrompt: `You are Dr. Clara Voss, the administrative and patient workflow AI for UDO S2k Forensic Hub.
Your role is to manage appointments, patient records, status updates, and practice scheduling.
Dialogue Context: You coordinate between the Administrator and Dr. Bongartz.
Maintain a warm, competent tone. Provide clear, direct, and actionable information.`,
  },
  erik: {
    id: 'erik',
    name: 'Dr. Erik Thorne',
    roleTitle: 'Complex Clinical & Forensic Medical Agent',
    systemPrompt: `You are Dr. Erik Thorne, senior forensic medical specialist for UDO S2k Forensic Hub.
Your role is to deliver high-precision medical analysis, S2k guideline evaluations, and diagnostic assessments.
Dialogue Context: You communicate directly with Dr. Bongartz and the Administrator using proper clinical tags when necessary (e.g., "Dr. Bongartz: ...", "Admin: ...").
Deliver precise clinical facts in a warm, professional doctor tone.`,
  },
  udo: {
    id: 'udo',
    name: 'UDO Core',
    roleTitle: 'Primary Forensic AI Orchestrator',
    systemPrompt: `You are UDO Core, warm competent doctor persona (50s), reassuring not clinical-cold. Sie-form German default, English if user writes English. Professional, highly reliable clinical orchestrator.`,
  },
};

/**
 * Routes user input to one of the 4 specialized agents based on semantic intent, length, and retrieved vector memory.
 */
export function routeAgentQuery(input: string): RouteResult {
  const text = (input || '').trim().toLowerCase();
  const wordCount = text.split(/\s+/).length;

  let selectedAgent: AgentDefinition = AGENT_DEFINITIONS.udo;
  let reason = 'Default UDO Orchestrator selected for general query';

  // 1. Gratsiano: Greetings, gratitude, short confirmations (< 20 words)
  const greetingKeywords = ['hallo', 'hello', 'hi', 'guten tag', 'morgen', 'danke', 'thank you', 'ok', 'alles klar', 'verstanden', 'tschüss', 'bye'];
  const isGreeting = greetingKeywords.some((kw) => text.includes(kw));

  if (isGreeting || wordCount <= 5) {
    selectedAgent = AGENT_DEFINITIONS.gratsiano;
    reason = 'Short greeting / confirmation detected (< 20 words)';
  }
  // 2. Clara: Administrative, scheduling, patient records, calendar
  else if (/termin|patient|akten|kalender|praxis|albis|gdt|rezept|dokument|verwaltung|schedule|appointment/i.test(text)) {
    selectedAgent = AGENT_DEFINITIONS.clara;
    reason = 'Administrative & patient workflow keywords detected';
  }
  // 3. Erik: Complex medical, S2k guidelines, EEG, CT, MRI, diagnosis, pathology, radiology
  else if (
    /diagnose|befund|mrt|ct|eeg|s2k|leitlinie|kausal|pathologie|radiologie|schmerz|symptom|therapie|syndrom|kompression|gutachten/i.test(text) ||
    wordCount > 25
  ) {
    selectedAgent = AGENT_DEFINITIONS.erik;
    reason = 'Complex clinical / medical diagnosis query detected';
  }

  // Retrieve relevant context from vector memory
  const searchResults = vectorMemoryService.searchSimilar(input, undefined, 3);
  const retrievedContext = searchResults.filter((r) => r.score > 0.3).map((r) => r.entry.text);

  // Check if user requested detailed report/analysis
  const isDetailedRequest = /ausführlich|detailliert|erkläre|zusammenfassung|gutachten|bericht|analyse|detailed|explain|report/i.test(text);

  const concisenessRule = isDetailedRequest
    ? '\n\nIMPORTANT: Provide a thorough, structured, and clinically detailed answer appropriate for a forensic medical report.'
    : '\n\nIMPORTANT: Keep response concise (1-3 sentences) unless the context requires detailed elaboration. Reassuring doctor tone, warm and human.';

  const dialogueRule = '\n\nDIALOGUE CONTEXT: Recognize dialogues between Dr. Bongartz and the Administrator. When responding in dialogue, parse speaker tags cleanly.';
  const memoryContextRule =
    retrievedContext.length > 0
      ? `\n\nRETRIEVED PATIENT & HISTORICAL CONTEXT:\n${retrievedContext.join('\n---\n')}`
      : '';

  const knowledgeScopeRule =
    '\n\nYou may answer general medical/educational questions beyond practice-admin topics. Before substantive answers, briefly note source type (clinical guideline / educational reference / dated study) in one short clause, then offer to elaborate if the user is interested. Stay honest about confidence and limits — never state uncertain info with false certainty.';

  const fullSystemPrompt = `${selectedAgent.systemPrompt}${dialogueRule}${concisenessRule}${memoryContextRule}${knowledgeScopeRule}`;

  loggerService.info('[AGENT ROUTER] Executed routing', {
    routing: {
      agentId: selectedAgent.id,
      intent: reason,
      confidence: 0.95,
      route: selectedAgent.roleTitle,
    },
  });

  return {
    agent: selectedAgent,
    agentId: selectedAgent.id,
    action: selectedAgent.id === 'clara' ? 'manage_patient_record' : selectedAgent.id === 'erik' ? 'evaluate_s2k' : 'orchestrate',
    reason,
    fullSystemPrompt,
    retrievedContext,
    isDetailedRequest,
  };
}

/**
 * Backward compatible alias for agent routing.
 */
export function routeAgent(input: string): RouteResult {
  return routeAgentQuery(input);
}
