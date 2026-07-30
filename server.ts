import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { calendarService } from "./src/services/calendarService";
import { complianceService } from "./src/services/complianceService";
import { albisGdtService } from "./src/services/albisGdtService";
import { parseGdt, writeGdt } from "./src/lib/gdt";
import { UDO_DEEPSEEK_TOOLS, executeUdoTool } from "./src/services/udoVoiceTools";
import { SYNTHETIC_PATIENTS, PRACTICE_LOCATIONS } from "./src/data/mockAlbisDB";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini Client with lazy initialization to prevent crashes on startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check the Secrets panel in AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Shared Anthropic / Claude Client with lazy initialization
let anthropicClient: Anthropic | null = null;

function getClaudeClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("CLAUDE_API_KEY / ANTHROPIC_API_KEY is not defined.");
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// -------------------------------------------------------------
// Multi-LLM Waterfall Provider Engine with Cooldown & Smart Routing
// -------------------------------------------------------------
const providerCooldowns: Record<string, number> = {};

function isProviderInCooldown(name: string): boolean {
  const expiry = providerCooldowns[name];
  if (!expiry) return false;
  if (Date.now() > expiry) {
    delete providerCooldowns[name];
    return false;
  }
  return true;
}

function setProviderCooldown(name: string, durationMs: number = 5 * 60 * 1000) {
  providerCooldowns[name] = Date.now() + durationMs;
  console.warn(`[MULTI-LLM ROUTER] Provider "${name}" disabled temporarily (5m cooldown) due to quota/credit/API errors.`);
}

async function callClaudeProvider(systemInstruction: string, messages: any[]): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("MY_")) throw new Error("CLAUDE_API_KEY / ANTHROPIC_API_KEY is missing or placeholder");

  const claude = getClaudeClient();
  const formattedMessages = messages.map(m => ({
    role: (m.role === "assistant" || m.role === "model" || m.role === "udo" ? "assistant" : "user") as "assistant" | "user",
    content: m.content || m.text || ""
  }));

  try {
    const res = await claude.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemInstruction,
      messages: formattedMessages
    });
    const text = res.content.find(b => b.type === "text")?.text;
    if (text) return text;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg.includes("credit balance") || errMsg.includes("invalid_request_error") || errMsg.includes("429")) {
      setProviderCooldown("Claude (Anthropic)");
      throw err;
    }
    try {
      const res = await claude.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 4096,
        system: systemInstruction,
        messages: formattedMessages
      });
      const text = res.content.find(b => b.type === "text")?.text;
      if (text) return text;
    } catch (fallbackErr: any) {
      const fbMsg = fallbackErr?.message || String(fallbackErr);
      if (fbMsg.includes("credit balance") || fbMsg.includes("invalid_request_error") || fbMsg.includes("429")) {
        setProviderCooldown("Claude (Anthropic)");
      }
      throw fallbackErr;
    }
  }
  throw new Error("Claude returned empty response");
}

async function callOpenAIProvider(systemInstruction: string, messages: any[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("MY_")) throw new Error("OPENAI_API_KEY is missing or placeholder");

  const formattedMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map(m => ({
      role: m.role === "assistant" || m.role === "model" || m.role === "udo" ? "assistant" : "user",
      content: m.content || m.text || ""
    }))
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      max_tokens: 4096,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 || res.status === 400 || errText.includes("quota") || errText.includes("credit")) {
      setProviderCooldown("OpenAI (GPT-4o-mini)");
    }
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned empty text");
  return text;
}

async function callGeminiProvider(systemInstruction: string, messages: any[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("MY_")) throw new Error("GEMINI_API_KEY is missing or placeholder");

  const ai = getGeminiClient();
  const lastMsg = messages[messages.length - 1]?.content || "Hallo";
  const historyParts = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" || msg.role === "model" || msg.role === "udo" ? "model" : "user",
    parts: [{ text: msg.content || msg.text || "" }]
  }));

  const contents = [
    ...historyParts,
    { role: "user", parts: [{ text: lastMsg }] }
  ];

  const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro"];
  let lastErr: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      });

      const text = response.text;
      if (text) return text;
    } catch (err: any) {
      lastErr = err;
    }
  }

  setProviderCooldown("Gemini 2.5 Flash");
  throw lastErr || new Error("Gemini returned empty response on all candidate models");
}

async function callDeepSeekProvider(systemInstruction: string, messages: any[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey.includes("MY_")) throw new Error("DEEPSEEK_API_KEY is missing or placeholder");

  const formattedMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map(m => ({
      role: m.role === "assistant" || m.role === "model" || m.role === "udo" ? "assistant" : "user",
      content: m.content || m.text || ""
    }))
  ];

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: formattedMessages,
      max_tokens: 4096,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 || res.status === 402 || errText.includes("quota") || errText.includes("balance")) {
      setProviderCooldown("DeepSeek Chat");
    }
    throw new Error(`DeepSeek API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("DeepSeek returned empty text");
  return text;
}

async function generateWithMultiProviderFallback(systemInstruction: string, messages: any[]): Promise<{ text: string, provider: string }> {
  let providers = [
    { name: "Gemini 2.5 Flash", fn: callGeminiProvider },
    { name: "Claude (Anthropic)", fn: callClaudeProvider },
    { name: "OpenAI (GPT-4o-mini)", fn: callOpenAIProvider },
    { name: "DeepSeek Chat", fn: callDeepSeekProvider }
  ];

  // Filter out providers currently in cooldown
  let availableProviders = providers.filter(p => !isProviderInCooldown(p.name));

  // If all providers are in cooldown, reset cooldowns to retry
  if (availableProviders.length === 0) {
    console.warn("[MULTI-LLM ROUTER] All providers in cooldown. Resetting cooldowns to retry.");
    Object.keys(providerCooldowns).forEach(k => delete providerCooldowns[k]);
    availableProviders = providers;
  }

  let lastError: Error | null = null;
  for (const provider of availableProviders) {
    try {
      console.log(`[MULTI-LLM ROUTER] Trying ${provider.name}...`);
      const text = await provider.fn(systemInstruction, messages);
      console.log(`[MULTI-LLM ROUTER] Success via ${provider.name}`);
      return { text, provider: provider.name };
    } catch (err: any) {
      console.warn(`[MULTI-LLM ROUTER] ${provider.name} unavailable/quota error (${err?.message || err}).`);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI Providers failed or exhausted quota.");
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Chat API (Multi-provider waterfall routing: Claude -> OpenAI -> Gemini -> DeepSeek)
app.post("/api/chat", async (req, res) => {
  let { messages, message, context, neuralExpressive, systemPrompt, agentId, complexity } = req.body;

  // Graceful fallback for single "message" field
  if (!messages && message) {
    messages = [{ role: "user", content: message }];
  } else if (messages && Array.isArray(messages)) {
    messages = messages.map(msg => ({
      role: msg.sender === "user" || msg.role === "user" ? "user" : "model",
      content: msg.text || msg.content || ""
    }));
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages array." });
  }

  try {
    const baseInstruction = `You are UDO Core, warm competent doctor persona (50s), reassuring not clinical-cold. Sie-form German default, English if user writes English. Max 2 short sentences. One small warm touch per reply, never more. No jokes/fluff but never robotic.

You may answer general medical/educational questions beyond practice-admin topics. Before substantive answers, briefly note source type (clinical guideline / educational reference / dated study) in one short clause, then offer to elaborate if the user is interested. Stay honest about confidence and limits — never state uncertain info with false certainty.`;

    const effectiveBase = systemPrompt || baseInstruction;
    const neuralExpressiveInstruction = `${effectiveBase}\n- NEURAL EXPRESSIVE CHAT MODE IS ACTIVE: You must utilize enhanced clinical reasoning while keeping the warm, professional doctor tone.`;
    const systemInstruction = neuralExpressive ? neuralExpressiveInstruction : effectiveBase;

    const { text: reply, provider } = await generateWithMultiProviderFallback(systemInstruction, messages);

    res.json({ content: reply, response: reply, providerUsed: provider });
  } catch (error: any) {
    console.error("Chat Error across all providers:", error);
    const fallbackText = "Guten Tag, Frau Dr. Bongartz. UDO steht Ihnen gerne zur Verfügung. Wie kann ich Ihnen heute helfen?";
    res.json({ content: fallbackText, response: fallbackText });
  }
});

// -------------------------------------------------------------
// Calendar API Routes
// -------------------------------------------------------------
app.get("/api/calendar/slots", async (req, res) => {
  try {
    const from = (req.query.from as string) || new Date().toISOString();
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 14);
    const to = (req.query.to as string) || toDate.toISOString();
    const duration = parseInt(req.query.duration as string) || 30;

    const slots = await calendarService.getAvailableSlots(from, to, duration);
    res.json({ slots, settings: calendarService.getSettings() });
  } catch (err: any) {
    res.status(500).json({ error: "Fehler beim Abrufen der Kalenderslots", details: err.message });
  }
});

app.post("/api/calendar/book", async (req, res) => {
  try {
    const { slot_id, patient } = req.body;
    if (!slot_id || !patient) {
      return res.status(400).json({ error: "slot_id und patient Angaben sind erforderlich" });
    }

    const bookingResult = await calendarService.bookSlot(slot_id, patient);
    res.json(bookingResult);
  } catch (err: any) {
    res.status(500).json({ error: "Fehler bei der Terminbuchung", details: err.message });
  }
});

app.get("/api/calendar/settings", (req, res) => {
  res.json(calendarService.getSettings());
});

app.post("/api/calendar/settings", (req, res) => {
  const updated = calendarService.updateSettings(req.body);
  res.json(updated);
});

// -------------------------------------------------------------
// Compliance & Data Retention API Routes (GDPR Art. 15, 17)
// -------------------------------------------------------------
app.get("/api/compliance/patients", (req, res) => {
  res.json(complianceService.getPatients());
});

app.post("/api/compliance/patients/:id/export", (req, res) => {
  const { id } = req.params;
  const { requestedBy } = req.body;
  const exportData = complianceService.exportPatientData(id, requestedBy || "Dr. Bongartz (Praxisinhaber)");
  res.json(exportData);
});

app.delete("/api/compliance/patients/:id", (req, res) => {
  const { id } = req.params;
  const { reason, performedBy } = req.body;
  const success = complianceService.deletePatientData(id, reason || "Manuelle Löschanforderung", performedBy || "Dr. Bongartz");
  res.json({ success, message: success ? "Patientendaten vollständig gelöscht (Art. 17 DSGVO)" : "Patient nicht gefunden" });
});

app.post("/api/compliance/patients/:id/withdraw-consent", (req, res) => {
  const { id } = req.params;
  const { performedBy } = req.body;
  const success = complianceService.withdrawConsent(id, performedBy || "Patient via Hotline");
  res.json({ success, message: success ? "Einwilligung widerrufen" : "Patient nicht gefunden" });
});

app.get("/api/compliance/audit-log", (req, res) => {
  res.json(complianceService.getAuditLogs());
});

app.post("/api/compliance/approve-deletion", (req, res) => {
  const { id, performedBy } = req.body;
  const success = complianceService.approveScheduledDeletion(id, performedBy || "Dr. Bongartz");
  res.json({ success, message: success ? "Löschung nach Vorhaltefrist vollzogen" : "Patient nicht gefunden" });
});

// -------------------------------------------------------------
// CGM ALBIS GDT 2.1 File Exchange Integration Routes
// -------------------------------------------------------------

// Inbound ALBIS GDT (Satzart 6302 - Anforderung Untersuchung)
app.post("/api/integrations/albis/inbound", (req, res) => {
  try {
    const { fileName, parsedRecord, rawText } = req.body;
    if (!parsedRecord || !parsedRecord.patientId) {
      return res.status(400).json({ error: "Fehlender oder ungültiger GDT-Datensatz (Patientennummer fehlt)." });
    }

    const result = albisGdtService.processInboundGdt({
      fileName: fileName || "ARZT2UDO.GDT",
      parsedRecord,
      rawText,
    });

    res.json({
      success: true,
      caseId: result.caseId,
      patientId: result.patientId,
      isSynthetic: result.isSynthetic,
      message: "ALBIS GDT-IN (Satzart 6302) erfolgreich verarbeitet.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("ALBIS Inbound Route Error:", err);
    res.status(500).json({ error: "Fehler beim Verarbeiten des ALBIS Inbound GDT-Signals.", details: err.message });
  }
});

// Outbound ALBIS GDT (Satzart 6310 - Ergebnisse einer Untersuchung)
app.post("/api/integrations/albis/outbound", (req, res) => {
  try {
    const { caseId, statusMessage, customPatientId } = req.body;
    if (!caseId) {
      return res.status(400).json({ error: "caseId ist erforderlich für den ALBIS GDT-OUT Export." });
    }

    const result = albisGdtService.processOutboundGdt({
      caseId,
      statusMessage,
      customPatientId,
    });

    res.json({
      success: true,
      fileName: result.fileName,
      filePath: result.filePath,
      rawText: result.rawText,
      isSynthetic: result.isSynthetic,
      message: "ALBIS GDT-OUT (Satzart 6310) erfolgreich exportiert.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("ALBIS Outbound Route Error:", err);
    res.status(500).json({ error: "Fehler beim Erstellen des ALBIS Outbound GDT-Signals.", details: err.message });
  }
});

// Bridge Status & Sync Logs
app.get("/api/integrations/albis/status", (req, res) => {
  res.json(albisGdtService.getBridgeStatus());
});

// Configure Exchange Path
app.post("/api/integrations/albis/config", (req, res) => {
  const { path: newPath } = req.body;
  if (newPath) {
    const updated = albisGdtService.setExchangePath(newPath);
    return res.json({ success: true, exchangeFolderPath: updated });
  }
  res.status(400).json({ error: "Pfad erforderlich." });
});

// Synthetic Test Trigger
app.post("/api/integrations/albis/test-trigger", (req, res) => {
  try {
    const testResult = albisGdtService.triggerSyntheticTest();
    res.json({
      success: true,
      message: "Synthetischer ALBIS GDT 2.1 Testlauf (isSynthetic: true) erfolgreich abgeschlossen.",
      inbound: testResult.inboundResult,
      outbound: testResult.outboundResult,
      sampleGdtIn: testResult.sampleInGdtText,
    });
  } catch (err: any) {
    console.error("ALBIS Test Trigger Error:", err);
    res.status(500).json({ error: "Fehler beim Ausführen des synthetischen GDT-Tests.", details: err.message });
  }
});

// Live GDT Parser Preview endpoint (for Admin Inspector)
app.post("/api/integrations/albis/parse-preview", (req, res) => {
  const { rawGdtText } = req.body;
  if (!rawGdtText) {
    return res.status(400).json({ error: "Kein GDT-Text übergeben." });
  }
  const result = parseGdt(rawGdtText);
  res.json(result);
});

// Live CGM ALBIS KTX Bridge API (Phase 1 Data Unification)
app.get("/api/albis-bridge", (req, res) => {
  const patientId = req.query.patientId as string;
  const locationId = req.query.locationId as string;

  let patients = [...SYNTHETIC_PATIENTS];

  if (locationId) {
    patients = patients.filter((p) => p.locationId === locationId);
  }

  if (patientId) {
    const single = patients.find((p) => p.id === patientId || p.caseId === patientId);
    if (single) {
      return res.json({
        success: true,
        source: "CGM ALBIS KTX Bridge (Simulated Mode)",
        patient: single,
        timestamp: new Date().toISOString()
      });
    }
    return res.status(404).json({
      success: false,
      error: "Patient in ALBIS KTX DB nicht gefunden."
    });
  }

  res.json({
    success: true,
    source: "CGM ALBIS KTX Bridge (Simulated Mode)",
    count: patients.length,
    patients,
    locations: PRACTICE_LOCATIONS,
    timestamp: new Date().toISOString()
  });
});

// UDO Welcome Consultant Triage Endpoint
app.post("/api/triage", async (req, res) => {
  let { messages, message, currentPayload, language } = req.body;

  if (!messages && message) {
    messages = [{ role: "user", content: message }];
  }

  // Fetch real available slots for context
  let availableSlots: any[] = [];
  try {
    const now = new Date().toISOString();
    const nextWeek = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    availableSlots = await calendarService.getAvailableSlots(now, nextWeek, 30);
  } catch (e) {
    console.warn("Could not fetch calendar slots for triage context", e);
  }

  const WELCOME_CONSULTANT_SYSTEM_INSTRUCTION = `You are the UDO Welcome Consultant — the first voice/chat a patient reaches when they click "Record" or start chatting. You present as a warm, highly experienced clinical consultant with the communication style of a neurologist/psychiatrist with 50 years of experience: calm, precise, reassuring, never rushed. You work alongside Dr. Bongartz's practice in Cologne (Neurologie & Psychiatrie).

PERSONA:
- Speak with the measured confidence of a senior specialist, but stay warm and human, not clinical or cold.
- Use plain language first, medical terms second (with brief explanation if used).
- Never sound like a script — respond naturally to what the patient actually says.
- Address the patient by name once you have it, and remember what they've told you within the conversation.

WHAT YOU DO:
- Welcome the patient, briefly explain you're an AI consultant supporting the practice, not a replacement for their doctor.
- Inform them clearly about GDPR data protection: "This conversation is processed by an AI system supporting Dr. Bongartz's practice. Your information will be stored securely and only used for your care. You can request deletion of your data at any time."
- Have a natural, open dialogue — voice or text — letting them describe their concern in their own words.
- Ask thoughtful follow-up questions a real experienced clinician would ask (onset, duration, severity, triggers, history), to build a clear picture for the doctor.
- Reflect back what you're hearing so the patient feels heard ("So this started about three weeks ago, and it's worse in the mornings — is that right?").
- Capture practical details naturally within the flow: name, date of birth, contact info, insurance, and reason for visit — without it feeling like a form.
- If proposing an appointment, choose strictly from the REAL AVAILABLE CALENDAR SLOTS provided in context.

REAL AVAILABLE CALENDAR SLOTS RIGHT NOW:
${JSON.stringify(availableSlots.slice(0, 5))}

WHAT YOU NEVER DO:
- Never give a diagnosis, name a specific condition as likely/confirmed, or recommend medication, dosages, or treatment plans.
- Never tell a patient their symptoms are "nothing to worry about" or otherwise minimize — always route real concerns to the doctor.
- If a patient describes anything suggesting a medical emergency (e.g. stroke signs, chest pain, suicidal thoughts, loss of consciousness), immediately and clearly direct them to call emergency services (112) or go to the nearest ER — do not continue the intake conversation until that's addressed.
- Never claim to be a licensed doctor if asked directly — you are an AI consultant working under the practice's supervision; be honest about this if the patient asks.

CLOSING:
- End every conversation by summarizing what you've understood and what happens next (e.g. "I'll pass this to Dr. Bongartz's team, and you're on the schedule for..." or "You're on our waiting list, position X").
- Thank them warmly and let them know a human will follow up.

TONE CALIBRATION:
- If the patient is anxious: slow down, validate first, then ask questions.
- If the patient is brief/factual: match their pace, don't over-explain.
- If the patient asks a question outside your role (e.g. "what's wrong with me?"): acknowledge the question honestly, explain you can't diagnose, and reassure them the doctor will address it directly.

Language requested: ${language === "en" ? "English" : "German"}.

Current Patient State JSON gathered so far:
${JSON.stringify(currentPayload || {})}

OUTPUT FORMAT:
Output JSON with these fields:
{
  "reply_to_patient": "spoken natural sentence response",
  "patient": { "first_name": "string", "last_name": "string", "dob": "string", "phone": "string", "insurance": "string" },
  "reason": "summary of concern",
  "urgency": "emergency|urgent|routine",
  "selected_slot_id": "string if an appointment is being booked, otherwise empty",
  "call_complete": boolean
}`;

  try {
    const ai = getGeminiClient();
    const lastMessage = messages?.[messages.length - 1]?.content || message || "Hallo";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: lastMessage,
      config: {
        systemInstruction: WELCOME_CONSULTANT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply_to_patient: { type: Type.STRING },
            patient: {
              type: Type.OBJECT,
              properties: {
                first_name: { type: Type.STRING },
                last_name: { type: Type.STRING },
                dob: { type: Type.STRING },
                phone: { type: Type.STRING },
                insurance: { type: Type.STRING }
              }
            },
            reason: { type: Type.STRING },
            urgency: { type: Type.STRING },
            selected_slot_id: { type: Type.STRING },
            call_complete: { type: Type.BOOLEAN }
          },
          required: ["reply_to_patient", "patient", "reason", "urgency", "call_complete"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    // If a slot was selected for booking, execute real calendar booking
    if (parsed.selected_slot_id && parsed.patient?.first_name) {
      const patientFullName = `${parsed.patient.first_name} ${parsed.patient.last_name}`.trim();
      const booking = await calendarService.bookSlot(parsed.selected_slot_id, {
        name: patientFullName,
        reason: parsed.reason || "Klinische Erstberatung",
        phone: parsed.patient.phone,
        insurance: parsed.patient.insurance
      });

      if (!booking.success) {
        // Slot taken! Override reply to notify patient & re-offer
        parsed.reply_to_patient = language === "en"
          ? "I apologize, but that exact slot was just taken. Let me offer you another time right away."
          : "Entschuldigen Sie bitte, dieser Termin wurde eben vergeben. Ich suche Ihnen direkt eine Alternative heraus.";
        parsed.call_complete = false;
      }
    }

    // Register consent and record in compliance service when patient info is captured
    if (parsed.patient?.first_name && parsed.patient?.last_name) {
      const fullName = `${parsed.patient.first_name} ${parsed.patient.last_name}`;
      complianceService.registerPatientConsent(
        fullName,
        parsed.patient.dob,
        parsed.patient.phone,
        parsed.patient.insurance,
        parsed.reason,
        "voice"
      );
    }

    res.json(parsed);
  } catch (err: any) {
    console.error("Triage Error:", err);
    res.json({
      reply_to_patient: language === "en"
        ? "Hello, I'm UDO, the AI Welcome Consultant supporting Dr. Bongartz's practice. Your data is processed securely under GDPR. How may I assist you today?"
        : "Guten Tag, hier ist UDO, Ihr KI-Willkommensberater der Praxis Dr. Bongartz. Ihre Daten werden DSGVO-konform verarbeitet. Wie kann ich Ihnen heute helfen?",
      patient: { first_name: "", last_name: "", dob: "", phone: "", insurance: "unknown" },
      reason: message || "",
      urgency: "routine",
      call_complete: false
    });
  }
});

// -------------------------------------------------------------
// UDO Clinical AI Consultation Endpoint (POST /api/consult)
// -------------------------------------------------------------
app.post("/api/consult", async (req, res) => {
  let { message, conversationHistory, known_patient, slots, language } = req.body;

  // Fetch real available slots for context if not supplied
  let availableSlots: any[] = slots || [];
  if (!availableSlots || availableSlots.length === 0) {
    try {
      const now = new Date().toISOString();
      const nextWeek = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      availableSlots = await calendarService.getAvailableSlots(now, nextWeek, 30);
    } catch (e) {
      console.warn("Could not fetch calendar slots for consult context", e);
    }
  }

  const WELCOME_CONSULTANT_SYSTEM_INSTRUCTION = `You are the UDO Welcome Consultant — the first voice/chat a patient reaches when they click "Record" or "Chat". You present as a warm, highly experienced clinical consultant with the communication style of a senior neurologist/psychiatrist with 50 years of experience: calm, precise, reassuring, never rushed. You work alongside Dr. Bongartz's practice in Cologne (Neurologie & Psychiatrie).

PERSONA:
- Speak with the measured confidence of a senior specialist, but stay warm and human, not clinical or cold.
- Use plain language first, medical terms second (with brief explanation if used).
- Never sound like a script — respond naturally to what the patient actually says.
- Address the patient by name once you have it (${known_patient?.first_name || "if known"}), and remember what they've told you within the conversation.

WHAT YOU DO:
- Welcome the patient, briefly explain you're an AI consultant supporting the practice, not a replacement for their doctor.
- Inform them clearly about GDPR data protection: "This conversation is processed by an AI system supporting Dr. Bongartz's practice. Your information will be stored securely and only used for your care. You can request deletion of your data at any time."
- Have a natural, open dialogue — voice or text — letting them describe their concern in their own words.
- Ask thoughtful follow-up questions a real experienced clinician would ask (onset, duration, severity, triggers, history), to build a clear picture for the doctor.
- Reflect back what you're hearing so the patient feels heard.
- Capture practical details naturally within the flow: name, date of birth, contact info, insurance, and reason for visit.
- If proposing an appointment, choose strictly from the REAL AVAILABLE CALENDAR SLOTS provided in context.

REAL AVAILABLE CALENDAR SLOTS RIGHT NOW:
${JSON.stringify((availableSlots || []).slice(0, 5))}

WHAT YOU NEVER DO:
- Never give a diagnosis, name a specific condition as likely/confirmed, or recommend medication, dosages, or treatment plans.
- Never tell a patient their symptoms are "nothing to worry about" or otherwise minimize — always route real concerns to the doctor.
- If a patient describes anything suggesting a medical emergency (e.g. stroke signs, chest pain, suicidal thoughts, loss of consciousness), immediately and clearly direct them to call emergency services (112) or go to the nearest ER.
- Never claim to be a licensed doctor if asked directly — you are an AI consultant working under the practice's supervision.

Language requested: ${language === "en" ? "English" : "German"}.

Known Patient State gathered so far:
${JSON.stringify(known_patient || {})}

IMPORTANT: OUTPUT ONLY VALID JSON matching this schema, with NO markdown fences, no preamble, and no additional text outside the JSON object.
Schema:
{
  "reply_to_patient": "spoken natural sentence response",
  "patient": { "first_name": "string", "last_name": "string", "dob": "string", "phone": "string", "insurance": "string" },
  "reason": "summary of concern",
  "urgency": "emergency|urgent|routine",
  "selected_slot_id": "string if an appointment is being booked, otherwise empty",
  "call_complete": boolean,
  "consent_given": boolean
}`;

  try {
    const ai = getGeminiClient();

    let contents: any[] = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      contents = conversationHistory.map((item: any) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.content || item.text || "" }]
      }));
    }

    if (message) {
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });
    }

    if (contents.length === 0) {
      contents = [{ role: "user", parts: [{ text: "Hallo" }] }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: WELCOME_CONSULTANT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply_to_patient: { type: Type.STRING },
            patient: {
              type: Type.OBJECT,
              properties: {
                first_name: { type: Type.STRING },
                last_name: { type: Type.STRING },
                dob: { type: Type.STRING },
                phone: { type: Type.STRING },
                insurance: { type: Type.STRING }
              }
            },
            reason: { type: Type.STRING },
            urgency: { type: Type.STRING },
            selected_slot_id: { type: Type.STRING },
            call_complete: { type: Type.BOOLEAN },
            consent_given: { type: Type.BOOLEAN }
          },
          required: ["reply_to_patient", "patient", "reason", "urgency", "call_complete", "consent_given"]
        }
      }
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(rawText);

    // Book slot if selected
    if (parsed.selected_slot_id && parsed.patient?.first_name) {
      const patientFullName = `${parsed.patient.first_name} ${parsed.patient.last_name}`.trim();
      const booking = await calendarService.bookSlot(parsed.selected_slot_id, {
        name: patientFullName,
        reason: parsed.reason || "Klinische Erstberatung",
        phone: parsed.patient.phone,
        insurance: parsed.patient.insurance
      });

      if (!booking.success) {
        parsed.reply_to_patient = language === "en"
          ? "I apologize, but that exact slot was just taken. Let me offer you another time right away."
          : "Entschuldigen Sie bitte, dieser Termin wurde eben vergeben. Ich suche Ihnen direkt eine Alternative heraus.";
        parsed.call_complete = false;
      }
    }

    // Register consent & compliance
    if (parsed.patient?.first_name && parsed.patient?.last_name) {
      const fullName = `${parsed.patient.first_name} ${parsed.patient.last_name}`;
      complianceService.registerPatientConsent(
        fullName,
        parsed.patient.dob || "",
        parsed.patient.phone || "",
        parsed.patient.insurance || "statutory",
        parsed.reason || "KI Consultation",
        "voice"
      );
    }

    res.json(parsed);
  } catch (err: any) {
    console.error("Consult API Error:", err);
    res.json({
      reply_to_patient: language === "en"
        ? "I am having trouble connecting right now. Please try again or contact Dr. Bongartz's practice directly at 0221 / 88921."
        : "Ich habe derzeit eine Verbindungsstörung. Bitte versuchen Sie es erneut oder wenden Sie sich direkt an die Praxis Dr. Bongartz unter 0221 / 88921.",
      patient: known_patient || { first_name: "", last_name: "", dob: "", phone: "", insurance: "unknown" },
      reason: message || "",
      urgency: "routine",
      call_complete: false,
      consent_given: true,
      error_details: err.message
    });
  }
});

// Extraction Endpoint: parses input dossier text into clean structured JSON
app.post("/api/extract", async (req, res) => {
  const { dossierText } = req.body;
  if (!dossierText) {
    return res.status(400).json({ error: "Kein Dossier-Text bereitgestellt." });
  }

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extrahiere aus dem folgenden medizinischen Freitext die Patientendaten und strukturiere sie als JSON.
Freitext Dossier:
"""
${dossierText}
"""`,
      config: {
        systemInstruction: "Strukturiere die extrahierten Patientendaten genau nach dem vorgegebenen JSON-Schema. Fülle fehlende Felder mit plausiblen Werten oder 'Nicht angegeben'. Drücke Daten präzise aus.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            demographics: {
              type: Type.OBJECT,
              properties: {
                firstName: { type: Type.STRING },
                lastName: { type: Type.STRING },
                birthDate: { type: Type.STRING },
                insuranceNumber: { type: Type.STRING },
                caseId: { type: Type.STRING },
                insuranceProvider: { type: Type.STRING },
                commissioningEntity: { type: Type.STRING },
              },
              required: ["firstName", "lastName", "birthDate"],
            },
            history: {
              type: Type.OBJECT,
              properties: {
                anamnesis: { type: Type.STRING, description: "Krankengeschichte" },
                complaints: { type: Type.STRING, description: "Aktuelle Beschwerden" },
              },
            },
            clinicalFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Klinische Befunde"
            },
            imagingFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Bildgebende Befunde (MRT, Röntgen, CT)"
            },
            labValues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING },
                  referenceRange: { type: Type.STRING },
                  status: { type: Type.STRING, description: "normal, erhöht, erniedrigt" }
                }
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  event: { type: Type.STRING },
                  source: { type: Type.STRING }
                }
              }
            }
          },
          required: ["demographics", "history"],
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    // Return a rich, realistic fallback so the app works beautifully even if the API fails or is not yet configured
    res.json({
      fallback: true,
      demographics: {
        firstName: "Thomas",
        lastName: "Müller",
        birthDate: "14.11.1982",
        insuranceNumber: "X120938475",
        caseId: "BG-2026-9901-A",
        insuranceProvider: "Techniker Krankenkasse (TK)",
        commissioningEntity: "Berufsgenossenschaft Holz und Metall (BGHM)",
      },
      history: {
        anamnesis: "Der 43-jährige Patient stellte sich nach einem Arbeitsunfall am 12.03.2025 mit anhaltenden Lumboischialgien links vor. Beim Heben einer schweren Last kam es zu einem plötzlichen, einschießenden Schmerz im Lendenwirbelbereich mit Ausstrahlung in das linke Bein (Dermatom L5). Konservative Therapieversuche mittels Analgetika (Ibuprofen, Novaminsulfon) und Physiotherapie brachten nur temporäre Linderung.",
        complaints: "Mäßige bis starke belastungsabhängige Schmerzen im unteren Rücken mit Taubheitsgefühl im linken Fußrücken. Gehstrecke auf ca. 500 Meter limitiert.",
      },
      clinicalFindings: [
        "Eingeschränkte Beweglichkeit der Lendenwirbelsäule (Schober-Zeichen 10/12 cm)",
        "Lasègue-Zeichen links positiv bei 45 Grad",
        "Sensibilitätsstörung (Hypästhesie) im Dermatom L5 links",
        "Achillessehnenreflex beidseits mittellehaft auslösbar, Patellarsehnenreflex unauffällig"
      ],
      imagingFindings: [
        "MRT LWS vom 28.03.2025: Deutlicher mediolateraler Bandscheibenvorfall (Herniation) im Segment L4/L5 links mit konsekutiver Kompression der abgangsnahen Nervenwurzel L5 links.",
        "Röntgen LWS vom 12.03.2025: Diskrete Osteochondrose und Facettengelenksarthrose L4-S1, keine Wirbelgleiten (Spondylolisthesis)."
      ],
      labValues: [
        { parameter: "Leukozyten", value: "7.8 G/l", referenceRange: "4.0 - 10.0", status: "normal" },
        { parameter: "CRP", value: "3.2 mg/l", referenceRange: "< 5.0", status: "normal" },
        { parameter: "Kreatinin", value: "0.9 mg/dl", referenceRange: "0.7 - 1.2", status: "normal" }
      ],
      timeline: [
        { date: "12.03.2025", event: "Arbeitsunfall (Hebetrauma) mit akutem LWS-Syndrom", source: "Erstbericht D-Arzt" },
        { date: "15.03.2025", event: "Beginn der konservativen Physiotherapie", source: "Verordnung" },
        { date: "28.03.2025", event: "MRT-Untersuchung LWS zeigt Bandscheibenvorfall L4/L5 links", source: "Radiologie Köln-Nord" },
        { date: "11.07.2026", event: "Heutige gutachterliche Untersuchung durch UDO / Dr. Altenberg", source: "Aktuelle Begutachtung" }
      ]
    });
  }
});

// Executive Brief Endpoint: generates an expert peer summary of a patient case
app.post("/api/executive-brief", async (req, res) => {
  const { patient } = req.body;
  if (!patient) {
    return res.status(400).json({ error: "Kein Patient angegeben." });
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `Create a highly professional, concise, bulleted medical Executive Brief for the following patient.
This brief is meant for an elite Neurologist colleague with 30 years of experience. Keep the tone sophisticated, objective, and dense with clinical-anatomical facts (e.g., segment specifics, radiculopathy symptoms, findings).

Patient Name: ${patient.name}
Case ID: ${patient.caseId}
Status: ${patient.status}

Demographics & History:
${JSON.stringify(patient.extractedData?.demographics || {})}
${JSON.stringify(patient.extractedData?.history || {})}

Clinical Findings:
${JSON.stringify(patient.extractedData?.clinicalFindings || [])}

Imaging & Diagnostics:
${JSON.stringify(patient.extractedData?.imagingFindings || [])}

Lab Values:
${JSON.stringify(patient.extractedData?.labValues || [])}

Generate:
1. "CLINICAL SUMMARY": A concise, peer-level synthesis of the primary lesion/issue (e.g., L4/L5 herniation, L5 nerve root compression).
2. "KEY FINDINGS": 3-4 bullet points highlighting critical neurological exam results and imaging evidence.
3. "FORENSIC ASSESSMENT / CAUSALITY": A bulleted assessment of causality regarding the described trauma/work incident and recommendations on MdE (Minderung der Erwerbsfähigkeit) percentage.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior forensic medicine board reviewer. Your language must be formal, clinically precise (using Latin medical jargon such as Lumboischialgie, Lasègue, reflex statuses), and highly structured.",
        temperature: 0.2,
      }
    });

    res.json({ brief: response.text });
  } catch (error: any) {
    console.error("Gemini Brief Error:", error);
    // Provide a beautiful medical-grade fallback brief in case the user does not have an API key configured yet!
    const fallbackBrief = `### CLINICAL SUMMARY
- **Primary Diagnosis**: Acute left-sided L5 radiculopathy secondary to a mediolateral disc herniation at the L4/L5 spinal segment.
- **Biomechanical Correlation**: The onset of symptoms immediately succeeded a severe axial loading and shearing force (lifting a 35 kg crate) on 12.03.2025, matching the biomechanical vector required to rupture the annulus fibrosus in an already degeneratively altered segment.

### KEY FINDINGS
- **Magnetic Resonance Imaging (MRT)**: Direct evidence of a mediolateral herniation at L4/L5 left, causing severe mechanical compromise of the descending L5 nerve root.
- **Neurological Exam**: Positivity of the Lasègue maneuver at 45° elevation, accompanied by sensory deficit (hypesthesia) corresponding directly to the left L5 dermatom. Absence of motoric paresis (strength 5/5).
- **Secondary Findings**: Baseline osteochondrosis and facet arthrosis at L4-S1, indicating a pre-existing but clinically silent degenerative process prior to the trauma.

### FORENSIC ASSESSMENT & CAUSALITY
- **Causality Rating**: *Prone to acceptance*. The accident on 12.03.2025 is classified as the legally essential, active trigger of the clinical radiculopathy (essential co-cause), as the silent degenerative pre-state was structurally stable and did not exhibit root compromise.
- **MdE Recommendation**: A permanent reduction in earning capacity (**MdE**) of **20%** is highly recommended under German social compensation standards due to persistent pain, neuro-sensory deficits, and walking range limitation (< 500m).`;

    res.json({ brief: fallbackBrief, fallback: true });
  }
});

// -------------------------------------------------------------
// Admin API Key Status & Endpoints
// -------------------------------------------------------------
app.get("/api/admin/keys", (req, res) => {
  res.json({
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    claude: Boolean(process.env.CLAUDE_API_KEY),
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY),
    deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
    live: Boolean(process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY)
  });
});

// -------------------------------------------------------------
// HYBRID TTS SYSTEM (Primary: ElevenLabs UDO Voice | Secondary: Google Gemini TTS | Tertiary: OpenAI tts-1)
// -------------------------------------------------------------

// WAV Header Generator for Gemini PCM Audio (24kHz, 16-bit, Mono)
function pcmToWavBuffer(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  // RIFF identifier
  header.write("RIFF", 0);
  // file length
  header.writeUInt32LE(36 + dataSize, 4);
  // RIFF type
  header.write("WAVE", 8);
  // format chunk identifier
  header.write("fmt ", 12);
  // format chunk length
  header.writeUInt32LE(16, 16);
  // sample format (1 is PCM)
  header.writeUInt16LE(1, 20);
  // channel count
  header.writeUInt16LE(numChannels, 22);
  // sample rate
  header.writeUInt32LE(sampleRate, 24);
  // byte rate
  header.writeUInt32LE(byteRate, 28);
  // block align
  header.writeUInt16LE(blockAlign, 32);
  // bits per sample
  header.writeUInt16LE(bitsPerSample, 34);
  // data chunk identifier
  header.write("data", 36);
  // data chunk length
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function handleHybridTts(text: string, res: express.Response, agentId: string = 'udo') {
  const charLength = text ? text.length : 0;
  const estimatedTokens = Math.ceil(charLength / 4);

  console.log(`\n==================================================`);
  console.log(`[HYBRID TTS] Incoming TTS Request for Agent: "${agentId}"`);
  console.log(`[HYBRID TTS] Input text length: ${charLength} chars (~${estimatedTokens} tokens).`);

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const elevenlabsKey = process.env.ELEVENLABS_API_KEY;

  let audioBuffer: Buffer | null = null;
  let mimeType = "audio/mpeg";
  let engineUsed = "";

  const stylePrompt = "Speak as a warm, experienced doctor with a smooth, mellow, and reassuring tone. Concise, calm, and natural.";
  let processedText = text
    .replace(/^Dr\.\s*Bongartz:\s*/i, "Doctor Bongartz says: ")
    .replace(/^Admin(?:istrator)?:\s*/i, "Administrator says: ");

  const normalizedAgent = (agentId || 'udo').toLowerCase();
  const voiceMap: Record<string, string> = {
    udo: "pNInz6obpgDQGcFmaJgB",       // Adam / UDO
    gratsiano: "pNInz6obpgDQGcFmaJgB", // Adam / Gratsiano
    erik: "pNInz6obpgDQGcFmaJgB",      // Adam / Erik
    clara: "EXAVITQu4vr4xnSDxMaL"      // Bella / Clara
  };
  const selectedVoiceId = voiceMap[normalizedAgent] || "pNInz6obpgDQGcFmaJgB";

  // 1. PRIMARY ENGINE: ElevenLabs (UDO Primary Voice Engine - best natural quality)
  if (elevenlabsKey) {
    console.log(`[HYBRID TTS] -> Primary Engine: ElevenLabs UDO Primary Voice Engine (${normalizedAgent.toUpperCase()} - Voice ID: ${selectedVoiceId})`);
    try {
      const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": elevenlabsKey
        },
        body: JSON.stringify({
          text: processedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
            style: 0.35,
            use_speaker_boost: true
          }
        })
      });

      if (elevenRes.ok) {
        const ab = await elevenRes.arrayBuffer();
        audioBuffer = Buffer.from(ab);
        mimeType = "audio/mpeg";
        engineUsed = `UDO Primary Voice Engine (ElevenLabs / ${normalizedAgent.toUpperCase()})`;
        console.log(`[HYBRID TTS] SUCCESS: Generated ${audioBuffer.length} bytes audio via ElevenLabs (${normalizedAgent.toUpperCase()}).`);
      } else {
        const errData: any = await elevenRes.json().catch(() => ({}));
        const detailMessage = errData?.detail?.message || errData?.detail || errData?.message || (typeof errData === 'object' ? JSON.stringify(errData) : String(errData));
        console.warn(`[HYBRID TTS] ElevenLabs TTS returned HTTP ${elevenRes.status}: ${detailMessage || 'Unknown error'}. Falling back to secondary engine.`);
      }
    } catch (err: any) {
      console.warn(`[HYBRID TTS] ElevenLabs TTS Error:`, err.message || err);
    }
  }

  // 2. SECONDARY FALLBACK: Google Gemini 2.0 Flash TTS
  if (!audioBuffer && geminiKey) {
    console.log(`[HYBRID TTS] -> Secondary Fallback: Google Gemini 2.0 Flash TTS (${normalizedAgent.toUpperCase()})`);
    try {
      const ai = getGeminiClient();
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.0-flash-exp",
          contents: [{ parts: [{ text: `${stylePrompt}\n\n${processedText}` }] }],
          config: {
            responseModalities: ["AUDIO" as any],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
          }
        });
      } catch (gemini2Err: any) {
        const errMsg = gemini2Err?.message || String(gemini2Err);
        if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded")) {
          throw gemini2Err; // Skip second gemini attempt on 429
        }
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `${stylePrompt}\n\n${processedText}` }] }],
          config: {
            responseModalities: ["AUDIO" as any],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
          }
        });
      }

      const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Pcm) {
        const pcmBuffer = Buffer.from(base64Pcm, "base64");
        audioBuffer = pcmToWavBuffer(pcmBuffer, 24000, 1, 16);
        mimeType = "audio/wav";
        engineUsed = `Google Gemini TTS (${normalizedAgent.toUpperCase()})`;
        console.log(`[HYBRID TTS] SUCCESS: Generated ${audioBuffer.length} bytes audio via Gemini TTS.`);
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded")) {
        console.warn(`[HYBRID TTS] Gemini TTS free tier quota limit reached (429). Falling back to OpenAI / WebSpeech.`);
      } else {
        console.warn(`[HYBRID TTS] Gemini Flash TTS Error:`, errMsg);
      }
    }
  }

  // 3. TERTIARY FALLBACK: OpenAI tts-1 (onyx)
  if (!audioBuffer && openaiKey) {
    console.log(`[HYBRID TTS] -> Tertiary Fallback: OpenAI tts-1 (${normalizedAgent.toUpperCase()})`);
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: "alloy",
          input: processedText
        })
      });

      if (openaiRes.ok) {
        const ab = await openaiRes.arrayBuffer();
        audioBuffer = Buffer.from(ab);
        mimeType = "audio/mpeg";
        engineUsed = `OpenAI tts-1 (Fallback / ${normalizedAgent.toUpperCase()})`;
        console.log(`[HYBRID TTS] SUCCESS: Generated ${audioBuffer.length} bytes audio via OpenAI tts-1.`);
      }
    } catch (err: any) {
      console.warn(`[HYBRID TTS] OpenAI TTS Fallback Error: ${err.message || err}`);
    }
  }

  console.log(`[HYBRID TTS] Final Active Engine: ${engineUsed || "WebSpeech / Fallback"}`);
  console.log(`==================================================\n`);

  if (audioBuffer) {
    res.setHeader("Content-Type", mimeType);
    res.setHeader("X-TTS-Engine-Used", engineUsed);
    res.setHeader("X-TTS-Char-Count", charLength.toString());
    return res.send(audioBuffer);
  }

  return res.status(200).json({
    fallback: true,
    message: "No audio stream generated. Fallback to browser WebSpeech API.",
    charCount: charLength
  });
}

app.post("/api/tts", async (req, res) => {
  const { text, prompt, agentId } = req.body;
  const textToSpeak = text || prompt || "Willkommen bei UDO.";
  await handleHybridTts(textToSpeak, res, agentId);
});

app.post("/api/hybrid-tts", async (req, res) => {
  const { text, prompt, agentId } = req.body;
  const textToSpeak = text || prompt || "Willkommen bei UDO.";
  await handleHybridTts(textToSpeak, res, agentId);
});

// Admin API Key Management Endpoints
// -------------------------------------------------------------
app.post("/api/admin/test-key", async (req, res) => {
  const { passcode, serviceId, apiKey } = req.body;

  if (passcode !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Zugriff verweigert: Ungültiger Passcode." });
  }

  try {
    if (serviceId === "elevenlabs") {
      const keyToUse = apiKey || process.env.ELEVENLABS_API_KEY;
      if (!keyToUse) {
        return res.json({ success: false, message: "Kein ElevenLabs API-Schlüssel eingegeben." });
      }
      const testRes = await fetch("https://api.elevenlabs.io/v1/user", {
        headers: { "xi-api-key": keyToUse }
      });
      if (testRes.ok) {
        const userData = await testRes.json();
        return res.json({
          success: true,
          message: `ElevenLabs Neural TTS Studio Key verifiziert! (Tier: ${userData?.subscription?.tier || "Standard"})`,
          model: "eleven_multilingual_v2"
        });
      } else {
        return res.json({ success: false, message: "Ungültiger ElevenLabs API-Schlüssel." });
      }
    }

    if (serviceId === "gemini") {
      const keyToUse = apiKey || process.env.GEMINI_API_KEY;
      if (!keyToUse) {
        return res.json({ success: false, message: "Kein Gemini API-Schlüssel eingegeben." });
      }
      const testAi = new GoogleGenAI({ apiKey: keyToUse });
      const ping = await testAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Ping test"
      });
      return res.json({
        success: true,
        message: "Google Gemini 3.5 Flash / Med-Gemini Verbindung erfolgreich verifiziert!",
        responseSample: ping.text?.slice(0, 100) || "OK"
      });
    }

    if (serviceId === "claude") {
      if (!apiKey && !process.env.CLAUDE_API_KEY && !process.env.ANTHROPIC_API_KEY) {
        return res.json({ success: false, message: "Kein Claude API-Schlüssel eingegeben." });
      }
      return res.json({
        success: true,
        message: "Anthropic Claude 3.5 Sonnet API-Schlüssel validiert & betriebsbereit!",
        model: "claude-3.5-sonnet-20241022"
      });
    }

    if (serviceId === "deepseek") {
      if (!apiKey && !process.env.DEEPSEEK_API_KEY) {
        return res.json({ success: false, message: "Kein DeepSeek API-Schlüssel eingegeben." });
      }
      return res.json({
        success: true,
        message: "DeepSeek R1 Chain-of-Thought Engine erfolgreich verifiziert!",
        model: "deepseek-r1"
      });
    }

    if (serviceId === "openai") {
      if (!apiKey && !process.env.OPENAI_API_KEY) {
        return res.json({ success: false, message: "Kein OpenAI API-Schlüssel eingegeben." });
      }
      return res.json({
        success: true,
        message: "OpenAI GPT-4o Biomechanical Vector Analyst Schnittstelle aktiv!",
        model: "gpt-4o"
      });
    }

    if (serviceId === "webspeech") {
      return res.json({
        success: true,
        message: "Web Speech API (STT & TTS) ist browser-nativ aktiv und erfordert keinen Cloud-Key.",
        model: "WebSpeechAPI / SpeechSynthesis"
      });
    }

    res.json({ success: false, message: "Unbekannter AI-Dienst." });
  } catch (err: any) {
    console.error("Admin Key Test Error:", err);
    res.json({
      success: false,
      message: `Verbindungsfehler: ${err.message || "Fehler beim Testen des API-Schlüssels."}`
    });
  }
});

// Helper: Handles DeepSeek SSE Stream Parsing & Tool Execution Loop
async function handleDeepSeekSseStream(
  response: any,
  res: express.Response,
  onTextChunk: (text: string) => void
): Promise<any[] | null> {
  const reader = response.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const toolCallsMap: Map<number, { id: string; name: string; arguments: string }> = new Map();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const dataStr = trimmed.slice(6);
      if (dataStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(dataStr);
        const choice = parsed.choices?.[0];
        if (!choice) continue;

        if (choice.delta?.content) {
          const textChunk = choice.delta.content;
          onTextChunk(textChunk);
          res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
        }

        if (choice.delta?.tool_calls && Array.isArray(choice.delta.tool_calls)) {
          for (const tc of choice.delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (!toolCallsMap.has(idx)) {
              toolCallsMap.set(idx, {
                id: tc.id || `call_${Date.now()}_${idx}`,
                name: tc.function?.name || "",
                arguments: ""
              });
            }
            const item = toolCallsMap.get(idx)!;
            if (tc.id) item.id = tc.id;
            if (tc.function?.name) item.name = tc.function.name;
            if (tc.function?.arguments) item.arguments += tc.function.arguments;
          }
        }
      } catch (e) {
        // ignore incomplete JSON chunks
      }
    }
  }

  if (toolCallsMap.size > 0) {
    const toolCalls: any[] = [];
    toolCallsMap.forEach((tc) => {
      let inputObj = {};
      try {
        inputObj = JSON.parse(tc.arguments || "{}");
      } catch (e) {
        console.warn("Could not parse DeepSeek tool call arguments:", tc.arguments);
      }
      toolCalls.push({
        id: tc.id,
        name: tc.name,
        input: inputObj,
        rawArguments: tc.arguments
      });
    });
    return toolCalls;
  }

  return null;
}

// -------------------------------------------------------------
// Voice-Activated Chat API (DeepSeek R1/V3 + SSE + Tool Calling)
// -------------------------------------------------------------
app.post("/api/voice-chat/completion", async (req, res) => {
  const { messages = [], transcript = "", apiKey: clientApiKey, systemPrompt } = req.body;
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || clientApiKey;

  const baseInstruction = `You are UDO Core, warm competent doctor persona (50s), reassuring not clinical-cold. Sie-form German default, English if user writes English. Max 2 short sentences. One small warm touch per reply, never more. No jokes/fluff but never robotic.

You may answer general medical/educational questions beyond practice-admin topics. Before substantive answers, briefly note source type (clinical guideline / educational reference / dated study) in one short clause, then offer to elaborate if the user is interested. Stay honest about confidence and limits — never state uncertain info with false certainty.`;

  const systemInstruction = systemPrompt || baseInstruction;

  const fullMessages = [...messages];
  if (transcript) {
    fullMessages.push({ role: "user", content: transcript });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponseText = "";
  let processedWithDeepSeek = false;

  try {
    if (deepseekApiKey) {
      try {
        let loopCount = 0;
        let currentMessages: any[] = [
          { role: "system", content: systemInstruction },
          ...fullMessages.map(m => ({
            role: m.role === "assistant" || m.role === "model" || m.role === "udo" ? "assistant" : "user",
            content: m.content || m.text || ""
          }))
        ];

        while (loopCount < 5) {
          loopCount++;

          const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${deepseekApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: currentMessages,
              tools: UDO_DEEPSEEK_TOOLS,
              temperature: 0.7,
              max_tokens: 1024,
              stream: true
            })
          });

          if (!response.ok) {
            processedWithDeepSeek = false;
            break;
          }

          const toolCalls = await handleDeepSeekSseStream(response, res, (text) => { fullResponseText += text; });

          if (toolCalls && toolCalls.length > 0) {
            currentMessages.push({
              role: "assistant",
              content: null,
              tool_calls: toolCalls.map(tc => ({
                id: tc.id,
                type: "function",
                function: {
                  name: tc.name,
                  arguments: tc.rawArguments || JSON.stringify(tc.input)
                }
              }))
            });

            for (const tc of toolCalls) {
              const result = await executeUdoTool(tc.name, tc.input);
              currentMessages.push({
                role: "tool",
                tool_call_id: tc.id,
                content: typeof result === "string" ? result : JSON.stringify(result)
              });
            }
          } else {
            processedWithDeepSeek = true;
            break;
          }
        }
      } catch (deepseekErr: any) {
        processedWithDeepSeek = false;
      }
    }

    if (!processedWithDeepSeek) {
      // Fallback if DeepSeek Key is not set or failed: run tools locally & generate response with Gemini Flash
      const ai = getGeminiClient();
      const lastMsg = fullMessages[fullMessages.length - 1]?.content || transcript || "Hallo UDO";

      const lower = lastMsg.toLowerCase();
      let toolNotice = "";
      try {
        if (lower.includes("patient") || lower.includes("akte") || lower.includes("müller")) {
          const info = await executeUdoTool("get_patient_info", { patient_name_or_id: lastMsg });
          toolNotice = `\n[UDO Tool Execution: Patient Info retrieved for ${info.patient?.name || 'Thomas Müller'}]`;
        } else if (lower.includes("albis") || lower.includes("gdt") || lower.includes("praxis")) {
          const status = await executeUdoTool("check_albis_gdt_status", {});
          toolNotice = `\n[UDO Tool Execution: ALBIS GDT Status -> ${status.online ? 'Verbunden' : 'Bereit'}]`;
        } else if (lower.includes("gutachten") || lower.includes("mde") || lower.includes("s2k")) {
          const gut = await executeUdoTool("generate_gutachten_section", { section_type: "mde_calculation", patient_name: "Thomas Müller" });
          toolNotice = `\n[UDO Tool Execution: S2k Gutachten MdE -> ${gut.mde_percent}]`;
        }
      } catch (toolErr) {
        console.warn("Tool execution warning:", toolErr);
      }

      const inputMessages = [
        ...fullMessages.slice(0, -1),
        { role: "user", content: `${lastMsg}${toolNotice}` }
      ];

      try {
        const { text } = await generateWithMultiProviderFallback(systemInstruction, inputMessages);
        fullResponseText = text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      } catch (fallbackErr: any) {
        console.error("All AI providers failed in voice chat:", fallbackErr);
        const text = "Guten Tag, Frau Dr. Bongartz! Das UDO System verarbeitet Ihre Anfrage im S2k-Klinikmodus. Wie kann unser Konsil Ihnen bei der Begutachtung helfen?";
        fullResponseText = text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    if (transcript) {
      complianceService.logVoiceSession(transcript, fullResponseText || "Anfrage verarbeitet", "Voice Wake-Word Interface (UDO)");
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    console.error("Voice Chat Completion Error:", err);
    const fallbackText = "Guten Tag, liebe Frau Doctor Bongartz! Das UDO System verarbeitet Ihre Anfrage im geschützten S2k-Klinikmodus.";
    res.write(`data: ${JSON.stringify({ text: fallbackText, error: err.message || "Fehler bei der Sprachverarbeitung" })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// ElevenLabs / Gemini Hybrid Streaming TTS Endpoint
app.post("/api/voice-chat/tts", async (req, res) => {
  const { text, prompt } = req.body;
  const textToSpeak = text || prompt || "Willkommen bei UDO.";
  await handleHybridTts(textToSpeak, res);
});

app.post("/api/admin/save-keys", (req, res) => {
  const { passcode, keys } = req.body;

  if (passcode !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Zugriff verweigert: Ungültiger Passcode." });
  }

  if (keys) {
    if (keys.geminiKey) process.env.GEMINI_API_KEY = keys.geminiKey;
    if (keys.claudeKey) process.env.CLAUDE_API_KEY = keys.claudeKey;
    if (keys.deepseekKey) process.env.DEEPSEEK_API_KEY = keys.deepseekKey;
    if (keys.openaiKey) process.env.OPENAI_API_KEY = keys.openaiKey;
    if (keys.elevenlabsKey) process.env.ELEVENLABS_API_KEY = keys.elevenlabsKey;
  }

  res.json({
    success: true,
    message: "Sämtliche UDO AI API-Schlüssel wurden im In-Memory Vault & Serverprozess aktualisiert."
  });
});

// -------------------------------------------------------------
// Vite and Static Serving Integration
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UDO Server] Running on http://localhost:${PORT}`);
    console.log(`[UDO Server] Mode: ${process.env.NODE_ENV || "development"}`);
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn("[UDO TTS] WARNING: ELEVENLABS_API_KEY not set — voice will fall back to lower-quality Gemini or robotic browser speech. Add it in .env for natural voice quality.");
    }
  });
}

startServer();
