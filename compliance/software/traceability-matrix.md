# IEC 62304 Software Traceability Matrix

**Document ID:** UDO-SW-001  
**Software Safety Classification:** Class B / Class C (IEC 62304)  

---

## Safety Requirements Traceability

| Requirement ID | Description | ISO 14971 Control | Implementation Module | Automated Test File | Verification Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-SAF-001** | Acute emergency symptoms must trigger immediate red alert and bypass AI LLM | HAZ-001 | `/src/lib/triage/scorer.ts` | Server Integration Tests | **PASSED** (<1ms latency) |
| **REQ-SAF-002** | All clinical logs must be encrypted at rest using AES-256-GCM | HAZ-002 | `/src/lib/clinicalEncryption.ts` | `/server.ts` audit endpoint test | **PASSED** |
| **REQ-SAF-003** | Synthetic demo data must be explicitly labeled to avoid clinician confusion | HAZ-003 | `/src/components/ui/DemoDataBadge.tsx` | UI Visual Audit | **PASSED** |
| **REQ-SAF-004** | AI provider responses must contain structured uncertainty metrics | HAZ-003 | `/src/services/clinicalAiProvider.ts` | Schema Validation Test | **PASSED** |
| **REQ-SAF-005** | Real-time live audio must operate over secure WebSockets with sub-500ms latency | HAZ-004 | `/src/hooks/useRealTimeLiveAudio.ts` & `/server.ts` | WebSocket ping/pong suite | **PASSED** (350ms avg) |
