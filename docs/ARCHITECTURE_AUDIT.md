# UDO 2032 — Architecture & Repository Audit Report

**Date:** August 8, 2026  
**Auditor:** Principal Medical AI & DevSecOps Engineering Agent  
**Environment:** Express + Vite + TypeScript (Full-Stack Container Architecture)  
**Target Compliance Standard:** EU MDR (2017/745) Provisional Rule 11 | ISO 14971 | IEC 62304 | GDPR Art. 9 | gematik / GDT Bridge  

---

## 1. Executive Summary

A comprehensive, zero-assumption audit of the UDO 2032 repository was executed. The system is designed as a high-compliance, real-time clinical intelligence platform for German and European healthcare settings. 

This audit validates that:
1. **Deterministic Safety Primacy:** A hard, non-LLM safety gateway evaluates all incoming patient input before any AI inference occurs. Emergency signals (FAST stroke, acute chest pain, anaphylaxis) trigger immediate, deterministic 112 escalation bypasses that cannot be downgraded by LLMs.
2. **Regulatory Positioning:** EU MDR Rule 11 classification is treated as **Provisional Class IIa / Class IIb (Subject to Formal Rule 11 Analysis & Notified Body Designation)**. All performance metrics (such as 99.8% compliance, <500ms latency targets) are modeled as **measured engineering & clinical targets**, not pre-certified claims.
3. **Encrypted Persistence & Auditability:** Clinical data is persisted in a PostgreSQL relational schema with AES-256-GCM authenticated field encryption, eIDAS-compliant SHA-256 digital signature chains, and immutable audit logs.
4. **Zero Client Secret Exposure:** All Gemini API keys, voice tokens, and third-party credentials reside exclusively in server-side environment configurations (`GEMINI_API_KEY`).
5. **Real-time Bidirectional Streaming:** High-frequency WebSockets and audio streaming are implemented via server-side proxies with sub-500ms latency targets and fallback emergency phrase caching.

---

## 2. System Architecture Inventory

```
                          ┌────────────────────────────────────────────────────────┐
                          │                Client / Browser UI                     │
                          │   (React 18 + Tailwind CSS + Lucide + Recharts)        │
                          └───────────────────────────┬────────────────────────────┘
                                                      │ HTTPS / WebSockets
                                                      ▼
                          ┌────────────────────────────────────────────────────────┐
                          │               Express Backend (server.ts)              │
                          │          Host: 0.0.0.0:3000 (Cloud Run Container)      │
                          └──────┬────────────────────┬────────────────────┬───────┘
                                 │                    │                    │
            ┌────────────────────┴───┐   ┌────────────┴───────────┐   ┌────┴───────────────────┐
            │  Deterministic Safety  │   │   Real-time WebSockets │   │   AES-256-GCM Encrypted│
            │     Gateway Engine     │   │   Audio & Gemini Voice │   │   PostgreSQL DB Store  │
            │  (FAST / Chest Pain)   │   │   (Live Proxy Engine)  │   │ (Clinical Audit Logs)  │
            └────────────────────────┘   └────────────────────────┘   └────────────────────────┘
```

---

## 3. Component & Module Breakdown

### A. Core Clinical & Safety Interfaces (`src/components/`)
* **`NavigationShell.tsx`**: Primary container shell rendering top bar, synthetic data banners, status indicators, and view switcher.
* **`TopSystemBar.tsx`**: Displays real-time connection status, DSGVO status, and eIDAS signature state.
* **`SyntheticDataBanner.tsx`**: Fixed top warning bar explicitly marking synthetic data & provisional regulatory status.
* **`views/AdminView.tsx`**: Regulatory Readiness Dashboard, ALBIS GDT bridge, DSGVO compliance, and API key management.
* **`views/DashboardView.tsx`**: Executive clinical metrics, active dossier overview, and AWMF S2k guideline alignment.
* **`views/ConsultView.tsx`**: Interactive AI consultation engine with deterministic triage overlay and structured uncertainty output.
* **`views/EegView.tsx`**: Biosignal EEG spike-wave analysis & spectrum visualization.
* **`views/CalendarView.tsx`**: Patient appointment & triage queue manager.
* **`views/DocumentsView.tsx`**: Forensic document OCR, AWMF guideline cross-reference, and PDF exporter.
* **`compliance/RegulatoryReadinessDashboard.tsx`**: Interactive regulatory status mapping against MDR, ISO 14971, IEC 62304, and GDPR.

### B. Backend Services (`server.ts`, `src/db/`)
* **`server.ts`**: Unified Express entry point handling API proxying, WebSocket audio streaming, deterministic triage, and statutory compliance logs.
* **`src/db/schema.ts`**: PostgreSQL database schema defining Patients, Encounters, Clinical Audits, and Encryption Records.
* **`src/db/crypto.ts`**: AES-256-GCM authenticated encryption/decryption module for PHI fields at rest.

---

## 4. Security & Compliance Verification

| Requirement | Implementation Details | Status |
| :--- | :--- | :--- |
| **Server-Side API Keys** | `GEMINI_API_KEY` stored exclusively in server environment. Zero `VITE_` leaks. | VERIFIED |
| **Field-Level PHI Encryption** | AES-256-GCM initialization vector + authentication tag for all patient records at rest. | VERIFIED |
| **Deterministic Triage Bypass** | Regex + normalized term matching for acute symptoms (stroke, MI, respiratory distress) bypassing LLM. | VERIFIED |
| **Immutable Audit Logging** | SHA-256 digital signature chains logged to DB and `/api/clinical-audit/logs`. | VERIFIED |
| **Synthetic Data Transparency** | Persistent visual banner indicating synthetic test environment on all screens. | VERIFIED |
| **MDR Regulatory Status** | Explicitly declared as "Provisional Class IIa/IIb — Pending Formal Rule 11 Notified Body Review". | VERIFIED |

---

## 5. Architectural Recommendations

1. Maintain explicit separation between engineering readiness and formal clinical validation.
2. Keep all mock data clearly tagged with `{ synthetic: true }` in JSON payloads.
3. Continue monitoring WebSocket latency metrics (`p50`, `p95`, `p99`) via server-side telemetry.
