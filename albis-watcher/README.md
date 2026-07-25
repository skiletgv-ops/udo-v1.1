# CGM ALBIS GDT 2.1 File-Exchange Bridge Watcher Service

This is the local Windows/Node.js watcher service for connecting **CGM ALBIS** (local Praxisverwaltungssystem) with the **U.D.O. S2k Gutachten Platform**.

## Architecture & Workflow
1. **ALBIS Request (Satzart 6302 - Anforderung Untersuchung)**:
   When a physician clicks "UDO Gutachten Anfordern" in ALBIS, ALBIS generates a GDT 2.1 file (e.g. `ARZT2UDO.GDT`) in the shared exchange folder:
   `C:\ALBIS\GDT\UDO_EXCHANGE\inbound\`

2. **Watcher Detection & Parsing**:
   This watcher service monitors `C:\ALBIS\GDT\UDO_EXCHANGE\` using `chokidar`.
   - Debounces file write streams to wait for file size stabilization.
   - Decodes CP850 / IBM437 / UTF-8 encoding.
   - Parses fixed-format GDT records (`[3-digit length][4-digit field key][value]`).
   - Extracts Patientennummer (`3000`), Nachname (`3101`), Vorname (`3102`), Geburtsdatum (`3103`), Geschlecht (`3110`), and Untersuchungsdatum (`6200`).

3. **UDO Case Sync**:
   The watcher sends an HTTP POST payload to `POST /api/integrations/albis/inbound` on the UDO platform.
   UDO creates or updates the patient case and marks `source: "albis"`.

4. **ALBIS Result Return (Satzart 6310 - Ergebnisse einer Untersuchung)**:
   When the Gutachten report is finalized in UDO, UDO calls `POST /api/integrations/albis/outbound`.
   The bridge writes a `UDO2ARZT.GDT` file into `C:\ALBIS\GDT\UDO_EXCHANGE\outbound\`.
   - Contains exact 3-digit QMS line length calculation.
   - Contains status string pointer in field `6221` (e.g. `"Gutachten erstellt, siehe UDO-Fallakte #BG-2026-9901-A"`).
   - **HARD CONSTRAINT**: Contains NO diagnosis text or PHI report body (pointer/status only).
   ALBIS imports this file back into the patient's Karteikarte.

## Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Run the watcher service
npm start
```

## Environment Variables
- `ALBIS_EXCHANGE_DIR`: Path to the shared exchange directory (Default: `C:\ALBIS\GDT\UDO_EXCHANGE\`).
- `UDO_API_URL`: URL of the UDO server (Default: `http://localhost:3000`).
