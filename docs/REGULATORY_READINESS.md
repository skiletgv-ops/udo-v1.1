# UDO 2032 — Regulatory Readiness Strategy & EU MDR Roadmap

**Date:** August 8, 2026  
**Status:** Provisional Rule 11 Architecture Active  

---

## 1. Intended Purpose Statement

UDO 2032 (Universal Diagnostic Operator) is a medical software application intended for use by qualified healthcare professionals (physicians, triage nurses, clinical administrators) in outpatient clinics, medical centers, and hospital emergency departments.

The software provides:
1. **Deterministic Emergency Triage:** Automatic detection and 112 escalation flagging for acute high-risk symptoms (stroke, myocardial infarction, acute respiratory distress, anaphylaxis).
2. **Clinical Decision Support (CDS):** AI-assisted differential diagnosis suggestions, AWMF S2k guideline cross-referencing, and structured clinical uncertainty modeling.
3. **Forensic Report Generation:** Assisted drafting of medical-legal reports (Gutachten) under human physician supervision.
4. **Interoperability:** Bidirectional data exchange with German practice management software via GDT 2.1/3.0 bridges.

---

## 2. EU MDR Rule 11 Classification Analysis

Under Annex VIII, Rule 11 of Regulation (EU) 2017/745 (MDR):

> *"Software intended to provide information which is used to take decisions with diagnostic or therapeutic purposes is classified as Class IIa, except if such decisions have an impact that may cause:*
> - *death or an irreversible deterioration of a person's state of health, in which case it is in Class III; or*
> - *a serious deterioration of a person's state of health or a surgical intervention, in which case it is in Class IIb."*

### Provisional Classification Finding: **Class IIa / Class IIb (Provisional — Subject to Notified Body Review)**

**Rationale:**
1. The primary decision-support features provide guidance to a licensed physician who retains sole diagnostic authority (Class IIa).
2. To prevent potential Class III risk associated with delayed emergency treatment, UDO incorporates a **deterministic, non-LLM safety gateway** that immediately flags acute life-threatening emergencies without AI inference delay.

---

## 3. Harmonized Standards Compliance Summary

* **ISO 13485:2016** — Quality Management System procedures documented in `/compliance/audit-gap-matrix.md`.
* **ISO 14971:2019** — Risk Management hazard analysis and risk controls documented in `/compliance/risk/hazard-analysis.md`.
* **IEC 62304:2006/AMD1:2015** — Software Lifecycle Class B traceability matrix documented in `/compliance/software/traceability-matrix.md`.
* **IEC 62366-1:2015** — Usability engineering and human-factors controls for clinical user interfaces.
* **GDPR (EU 2016/679) Art. 9** — Data Protection Impact Assessment (DPIA) and AES-256-GCM encryption at rest.
