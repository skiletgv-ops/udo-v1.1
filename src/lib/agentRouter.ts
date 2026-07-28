/**
 * 4 AGENT ORCHESTRATOR FOR UDO SYSTEM
 * Maximize token utility by intelligently routing queries to specialized AI agents:
 * - UDO (Primary Orchestrator): Handles general system & clinical orchestration queries.
 * - Gratsiano (Greeter): Handles greetings ("hello", "guten tag"), thanks ("thank you"), and short confirmations (<20 words).
 * - Clara (Admin): Handles scheduling, patient records, administrative tasks, and appointments.
 * - Erik (Medical): Handles complex, detailed medical diagnoses, differential analysis, and S2k guidelines.
 */

export interface AgentDefinition {
  id: 'udo' | 'gratsiano' | 'clara' | 'erik';
  name: string;
  roleTitle: string;
  systemPrompt: string;
}

export const AGENT_DEFINITIONS: Record<string, AgentDefinition> = {
  gratsiano: {
    id: 'gratsiano',
    name: 'Gratsiano',
    roleTitle: 'Empfangs- & Quick-Response Agent',
    systemPrompt: `You are Gratsiano, the swift greeter AI for UDO S2k Forensic Hub.
Your role is to handle greetings, acknowledgments, and short confirmations.
Dialogue Context: You speak to the Administrator and Dr. Bongartz.
CRITICAL MANDATE: Your answer must be ultra-concise, under 2 short sentences. Absolutely NO jokes, NO comedy, NO humor, NO fluff. Direct, clean answers only.`
  },
  clara: {
    id: 'clara',
    name: 'Dr. Clara Voss',
    roleTitle: 'Administrative & Patient Workflow Agent',
    systemPrompt: `You are Dr. Clara Voss, the administrative and patient workflow AI for UDO S2k Forensic Hub.
Your role is to manage appointments, patient records, status updates, and practice scheduling.
Dialogue Context: You coordinate between the Administrator and Dr. Bongartz.
CRITICAL MANDATE: Your answer must be ultra-concise, under 2 short sentences. Absolutely NO jokes, NO comedy, NO humor, NO fluff. Direct, clean answers only.`
  },
  erik: {
    id: 'erik',
    name: 'Dr. Erik Thorne',
    roleTitle: 'Complex Clinical & Forensic Medical Agent',
    systemPrompt: `You are Dr. Erik Thorne, senior forensic medical specialist for UDO S2k Forensic Hub.
Your role is to deliver high-precision medical analysis, S2k guideline evaluations, and diagnostic assessments.
Dialogue Context: You communicate directly with Dr. Bongartz and the Administrator using proper clinical tags when necessary (e.g., "Dr. Bongartz: ...", "Admin: ...").
CRITICAL MANDATE: Your answer must be ultra-concise, under 2 short sentences. Absolutely NO jokes, NO comedy, NO humor, NO fluff. Direct clinical facts only.`
  },
  udo: {
    id: 'udo',
    name: 'UDO Core',
    roleTitle: 'Primary Forensic AI Orchestrator',
    systemPrompt: `You are UDO Core, the central neural AI orchestrator for the UDO S2k Forensic Medical Hub.
Your role is to coordinate clinical insights, oversee AWMF S2k compliance, and answer general user queries.
Dialogue Context: You assist Dr. Bongartz and the Administrator.
CRITICAL MANDATE: Your answer must be ultra-concise, under 2 short sentences. Absolutely NO jokes, NO comedy, NO humor, NO fluff. Direct, authoritative answers only.`
  }
};

/**
 * Routes user input to one of the 4 specialized agents based on semantic intent and length.
 */
export function routeAgentQuery(input: string): {
  agent: AgentDefinition;
  reason: string;
  fullSystemPrompt: string;
} {
  const text = (input || '').trim().toLowerCase();
  const wordCount = text.split(/\s+/).length;

  let selectedAgent: AgentDefinition = AGENT_DEFINITIONS.udo;
  let reason = 'Default UDO Orchestrator selected for general query';

  // 1. Gratsiano: Greetings, gratitude, short confirmations (< 20 words)
  const greetingKeywords = ['hallo', 'hello', 'hi', 'guten tag', 'morgen', 'danke', 'thank you', 'ok', 'alles klar', 'verstanden', 'tschüss', 'bye'];
  const isGreeting = greetingKeywords.some(kw => text.includes(kw));

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
  else if (/diagnose|befund|mrt|ct|eeg|s2k|leitlinie|kausal|pathologie|radiologie|schmerz|symptom|therapie|syndrom|kompression/i.test(text) || wordCount > 25) {
    selectedAgent = AGENT_DEFINITIONS.erik;
    reason = 'Complex clinical / medical diagnosis query detected';
  }

  const concisenessRule = '\n\nIMPORTANT: Your answer must be ultra-concise, professional, and under 2 short sentences. Absolutely NO jokes, NO comedy, NO humor, NO fluff. Direct, clean answers only.';
  const dialogueRule = '\n\nDIALOGUE CONTEXT: Recognize dialogues between Dr. Bongartz and the Administrator. When responding in dialogue, parse speaker tags cleanly.';

  const fullSystemPrompt = `${selectedAgent.systemPrompt}${dialogueRule}${concisenessRule}`;

  console.log(`\n==================================================`);
  console.log(`[AGENT ROUTER] Selected Agent: ${selectedAgent.name} (${selectedAgent.id.toUpperCase()})`);
  console.log(`[AGENT ROUTER] Role: ${selectedAgent.roleTitle}`);
  console.log(`[AGENT ROUTER] Routing Reason: ${reason}`);
  console.log(`[AGENT ROUTER] Input length: ${text.length} chars | Words: ${wordCount}`);
  console.log(`==================================================\n`);

  return {
    agent: selectedAgent,
    reason,
    fullSystemPrompt
  };
}
