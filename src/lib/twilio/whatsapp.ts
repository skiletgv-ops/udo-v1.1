export type WhatsAppIntent =
  | 'address_change'
  | 'referral_request'
  | 'appointment_confirm'
  | 'appointment_cancel'
  | 'unsupported';

export interface WhatsAppMessageResult {
  intent: WhatsAppIntent;
  replyText: string;
  isStructured: boolean;
}

export function parseAndReplyWhatsAppMessage(incomingText: string): WhatsAppMessageResult {
  const text = (incomingText || '').trim().toLowerCase();

  if (text.includes('adresse') || text.includes('wo ist die praxis') || text.includes('anschrift')) {
    return {
      intent: 'address_change',
      replyText:
        'Praxis Dr. med. Ulrike Bongartz: Neumarkt 1, 50667 Köln. Telefon: 0221 1234567. Öffnungszeiten: Mo-Fr 08:00 - 16:00 Uhr.',
      isStructured: true
    };
  }

  if (text.includes('überweisung') || text.includes('rezept') || text.includes('schein')) {
    return {
      intent: 'referral_request',
      replyText:
        'Ihre Überweisungs-/Rezeptanfrage wurde registriert. Wir prüfen Ihre eGK und legen das Dokument zum Abholen bereit.',
      isStructured: true
    };
  }

  if (text.includes('confirm') || text.includes('bestätigen') || text.includes('ja')) {
    return {
      intent: 'appointment_confirm',
      replyText:
        'Vielen Dank! Ihr Termin wurde erfolgreich bestätigt. Wir freuen uns auf Ihren Besuch.',
      isStructured: true
    };
  }

  if (text.includes('cancel') || text.includes('absagen') || text.includes('nein')) {
    return {
      intent: 'appointment_cancel',
      replyText:
        'Ihr Termin wurde storniert. Nächste freie Termine können Sie unter /calendar einsehen.',
      isStructured: true
    };
  }

  // Strict Policy Guard: NO open-ended medical advice on messaging channel
  return {
    intent: 'unsupported',
    replyText:
      'Ihre Nachricht enthält eine offene medizinische Anfrage. Aus Datenschutz- und Sicherheitsgründen geben wir keine medizinischen Ratschläge per Chat. Bitte rufen Sie direkt in der Praxis an: 0221 1234567.',
    isStructured: false
  };
}
