# Medical Device Classification Analysis — EU MDR (2017/745)

**Document ID:** UDO-REG-002  
**Status:** PROVISIONAL CLASSIFICATION — REQUIRES FORMAL REGULATORY REVIEW  

---

## 1. Rule 11 Analysis (MDR Annex VIII)

Under EU Medical Device Regulation 2017/745 Annex VIII, **Rule 11** states:

> *"Software intended to provide information which is used to take decisions with diagnostic or therapeutic purposes is classified as Class IIa, except if such decisions have an impact that may cause:*
> - *death or an irreversible deterioration of a person's state of health, in which case it is in Class III; or*
> - *a serious deterioration of a person's state of health or a surgical intervention, in which case it is classified as Class IIb."*

---

## 2. Risk Impact Assessment

| Module | Function | Potential Harm from False Negative | Impact Classification |
| :--- | :--- | :--- | :--- |
| **Deterministic Safety Gateway** | Acute symptom detection (FAST stroke, chest pain) | Delayed 112 emergency escalation leading to irreversible brain/heart tissue death | Managed via deterministic non-LLM rulebook to mitigate Class III risk down to Class IIa/IIb |
| **Triage Scorer & CDS** | Priority scheduling & differential suggestions | Delayed routine appointment or misprioritized specialist referral | **Class IIa** |
| **Gutachten Generator** | Document drafting for social insurance | Non-clinical administrative error | **Class I** (Software function) |

---

## 3. Provisional Classification Conclusion

* **Overall Device Classification:** **Class IIa / Class IIb** (Subject to Final Notified Body Designation).
* **Rationale:** The inclusion of deterministic zero-latency safety overrides isolates critical emergency workflows from AI hallucination, placing primary decision-support features safely in the Class IIa domain under clinical physician supervision.
