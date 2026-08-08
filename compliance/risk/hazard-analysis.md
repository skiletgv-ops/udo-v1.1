# Hazard Analysis & Risk Control Matrix (ISO 14971)

**Document ID:** UDO-RISK-001  
**Standard:** ISO 14971:2019 Medical devices — Application of risk management to medical devices  

---

## Risk Analysis Table

| Hazard ID | Hazard / Sequence of Events | Harm | Severity | Initial Risk | Mitigation / Control Measure | Verification | Residual Risk |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAZ-001** | LLM hallucination during acute stroke presentation misses FAST signs | Delayed emergency transport, brain ischemia | Critical | High | Hard Deterministic Triage Rulebook (`scorer.ts`) bypasses LLM in <1ms on keyword match | Automated unit tests (`scorer.test.ts`), zero-latency execution verification | Low (Acceptable) |
| **HAZ-002** | Unencrypted health data leaked during transit or at rest | GDPR/HIPAA violation, patient identity compromise | Serious | High | AES-256-GCM encryption for clinical storage + TLS 1.3 for API endpoints | Automated encryption suite (`clinicalEncryption.ts`) | Low (Acceptable) |
| **HAZ-003** | Clinician accepts AI recommendation without reviewing underlying data | Misdiagnosis or inappropriate therapy recommendation | Critical | High | Mandatory human oversight UI controls ([ACCEPT]/[REJECT]) + prominent disclaimer | Usability evaluation (IEC 62366) | Low (Acceptable) |
| **HAZ-004** | API timeout / Network drop during voice interaction | Lost clinical information, patient confusion | Moderate | Medium | WebSockets streaming fallback + local offline emergency phrase cache | Network disconnection unit tests | Low (Acceptable) |
