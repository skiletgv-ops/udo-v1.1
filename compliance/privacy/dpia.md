# GDPR Data Protection Impact Assessment (DPIA) — Health Data (Art. 9 GDPR)

**Document ID:** UDO-PRIV-001  
**Legal Basis:** Article 9(2)(h) GDPR (Healthcare processing under clinician secrecy) & BGB § 630f  

---

## 1. Technical Data Safeguards

1. **Encryption at Rest:** All patient identifiers and clinical notes stored in PostgreSQL / clinical audit tables are encrypted using AES-256-GCM.
2. **Encryption in Transit:** Mandatory TLS 1.3 for all HTTP/WebSocket endpoints.
3. **Data Minimization:** No unnecessary patient data is transmitted to AI provider APIs. Prompt payloads use anonymized case tokens where possible.
4. **Immutable Audit Trails:** Access and modifications to clinical records generate immutable audit events with timestamps, user IDs, and client IP addresses.

---

## 2. Subprocessor Register

| Subprocessor | Location | Function | Data Safeguard | Transfer Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Google Cloud Platform (EU-West1)** | Frankfurt, Germany | Infrastructure, Cloud Run, Gemini API | Server-side proxy, EU Data Residency | EU Model Contract Clauses / DPA |
| **ElevenLabs Inc.** | US / EU Proxy | Humanic Male V1 Voice Synthesis | Transient audio stream (no retention) | Standard Contractual Clauses (SCC) |
