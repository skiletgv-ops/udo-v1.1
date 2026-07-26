import { BillingCode } from '../../types/device';

export function suggestBillingCodes(gutachtenText: string, deviceSessionsCount: number): BillingCode[] {
  const suggestions: BillingCode[] = [];

  // GOÄ 800: Eingehende neurologische Untersuchung
  suggestions.push({
    id: `goae-800-${Date.now()}`,
    code: 'GOÄ 800',
    system: 'GOÄ',
    description: 'Eingehende neurologische Untersuchung',
    confidence: 0.96,
    price: 26.23,
    status: 'suggested',
    reasoning: 'Ganzkörperlicher & hirnnervlicher Status in Anamnese vorhanden.'
  });

  // GOÄ 80: Schriftliche Gutachtliche Äußerung
  if (gutachtenText.length > 200 || gutachtenText.toLowerCase().includes('gutachten')) {
    suggestions.push({
      id: `goae-80-${Date.now()}`,
      code: 'GOÄ 80',
      system: 'GOÄ',
      description: 'Schriftliche Gutachtliche Äußerung (S2k Standard)',
      confidence: 0.92,
      price: 120.0,
      status: 'suggested',
      reasoning: 'S2k Strukturgutachtenentwurf erfasst.'
    });
  }

  // GOÄ 825: EEG Untersuchung
  if (deviceSessionsCount > 0 || gutachtenText.toLowerCase().includes('eeg')) {
    suggestions.push({
      id: `goae-825-${Date.now()}`,
      code: 'GOÄ 825',
      system: 'GOÄ',
      description: 'Elektroenzephalographische Untersuchung (EEG)',
      confidence: 0.9,
      price: 64.12,
      status: 'suggested',
      reasoning: 'Importierte EEG Gerätesitzung verknüpft.'
    });
  }

  // GOÄ 857: Kognitive Testbatterie
  if (gutachtenText.toLowerCase().includes('vts') || gutachtenText.toLowerCase().includes('kognitiv')) {
    suggestions.push({
      id: `goae-857-${Date.now()}`,
      code: 'GOÄ 857',
      system: 'GOÄ',
      description: 'Anwendung und Auswertung komplexer Testverfahren',
      confidence: 0.88,
      price: 43.72,
      status: 'suggested',
      reasoning: 'Kognitive Testung (Vienna Test System) ausgewertet.'
    });
  }

  return suggestions;
}
