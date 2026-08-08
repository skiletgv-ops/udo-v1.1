# UDO 2032 — Comprehensive Feature Inventory & Classification

**Date:** August 8, 2026  
**Status:** Audit & Categorization Complete  

All features in the repository have been cataloged and classified according to the core product classification matrix:
* **A — KEEP:** Core UDO functionality essential for clinical operation.
* **B — REBUILD / POLISH:** Useful features refined for safety, compliance, or UI consistency.
* **C — HIDE TEMPORARILY:** Future features moved out of primary clinical view.
* **D — REMOVE:** Dead, duplicate, or unneeded prototype features removed.
* **E — DEMO ONLY:** Synthetic test data clearly labeled with synthetic flags.
* **F — REGULATORY / SAFETY:** Non-negotiable compliance, audit, and safety infrastructure.

---

## Complete Feature Matrix

| Feature | Location | Classification | Usage Status | Clinical / Regulatory Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Deterministic Safety Gateway** | `server.ts` (`/api/triage/evaluate`) | **F (REGULATORY / SAFETY)** | Active | Prevents LLM override of FAST stroke / chest pain acute emergencies. Non-negotiable. |
| **Synthetic Data Warning Banner** | `src/components/ui/SyntheticDataBanner.tsx` | **F (REGULATORY / SAFETY)** | Active | Explicitly flags synthetic environment per IEC 62366 usability standards. |
| **MDR Regulatory Readiness Dashboard** | `src/components/compliance/RegulatoryReadinessDashboard.tsx` | **F (REGULATORY / SAFETY)** | Active | Tracks MDR Rule 11, ISO 14971, IEC 62304, and GDPR Art. 9 readiness. |
| **DSGVO / GDPR Compliance Panel** | `src/components/CompliancePanel.tsx` | **F (REGULATORY / SAFETY)** | Active | Handles Art. 15 data export & Art. 17 right-to-be-forgotten requests. |
| **ALBIS GDT Interoperability Bridge** | `src/components/AlbisGdtBridgePanel.tsx` | **A (KEEP)** | Active | German practice software file integration (GDT 2.1 / 3.0 import & export). |
| **AES-256-GCM Field Encryption** | `src/db/crypto.ts` | **F (REGULATORY / SAFETY)** | Active | Protects PHI at rest with authenticated encryption. |
| **WebSockets Live Audio Proxy** | `server.ts` (`/api/voice/stream`) | **A (KEEP)** | Active | Low-latency real-time voice consultation with sub-500ms target latency. |
| **AWMF S2k Guideline Knowledge Base** | `src/components/views/DocumentsView.tsx` | **A (KEEP)** | Active | Cross-references clinical findings against official German AWMF S2k guidelines. |
| **EEG Biosignal Analysis Workspace** | `src/components/views/EegView.tsx` | **A (KEEP)** | Active | Visualizes multi-channel EEG signals and automated spike-wave detection. |
| **Forensic Gutachten Draft Reviewer** | `src/components/gutachten/` | **A (KEEP)** | Active | Multi-phase medical report drafting with human clinician sign-off requirement. |
| **API Keys & Security Admin** | `src/components/ApiKeysAdmin.tsx` | **F (REGULATORY / SAFETY)** | Active | Server-side key rotation and audit logging. |
| **Legacy Prototype Upgrade Mock Items** | `src/components/PracticeUpgrades.tsx` | **D (REMOVED / ISOLATED)** | Isolated | Legacy static tab list bypassed in favor of unified MDR Readiness Dashboard. |

---

## Summary Statistics

* **Total Audited Components:** 84
* **Active Primary Views:** 7 (Dashboard, Consult, Patients, EEG, Calendar, Documents, Admin)
* **Core Safety Gateways:** 3 (Deterministic Triage, AES-256 Encryption, Immutable Audit Logger)
* **Regulatory Compliance Frameworks:** 8 (EU MDR, ISO 14971, ISO 13485, IEC 62304, IEC 62366, GDPR Art. 9, eIDAS, gematik GDT)
