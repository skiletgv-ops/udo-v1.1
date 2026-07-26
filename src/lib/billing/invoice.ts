import { BillingCode } from '../../types/device';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  patientName: string;
  patientAddress: string;
  lineItems: Array<{
    code: string;
    description: string;
    basePrice: number;
    factor: number; // 1.0 to 3.5
  }>;
}

export function generateInvoiceDocument(data: InvoiceData): string {
  let subtotal = 0;

  const itemsFormatted = data.lineItems
    .map((item) => {
      const total = item.basePrice * item.factor;
      subtotal += total;
      return `${item.code.padEnd(12)} | ${item.description.padEnd(40)} | ${item.basePrice.toFixed(2)}€ | x${item.factor.toFixed(1)} | ${total.toFixed(2)}€`;
    })
    .join('\n');

  return `
================================================================================
PRIVATÄRZTLICHE HONOARRECHNUNG (GOÄ)
Praxis Dr. med. Ulrike Bongartz • Neumarkt 1, 50667 Köln
BIC: COLO1DE22XXX • IBAN: DE89 3705 0198 0000 1234 56
================================================================================

RECHNUNG-NR: ${data.invoiceNumber}
RECHNUNGSDATUM: ${data.invoiceDate}
ZAHLBAR BIS: ${data.dueDate} (14 Tage Zahlungsziel)

EMPFÄNGER:
${data.patientName}
${data.patientAddress}

LEISTUNGSÜBERSICHT (GOÄ):
--------------------------------------------------------------------------------
Ziffer       | Bezeichnung                              | Einzel  | Faktor | Gesamt
--------------------------------------------------------------------------------
${itemsFormatted}
--------------------------------------------------------------------------------
GESAMTBETRAG: ${subtotal.toFixed(2)} EUR

Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungsnummer ${data.invoiceNumber}
innerhalb von 14 Tagen.

Dr. med. Ulrike Bongartz
================================================================================
`.trim();
}

export function exportInvoicePdf(data: InvoiceData): void {
  const content = generateInvoiceDocument(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GOAE_Rechnung_${data.invoiceNumber}_${data.patientName.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
