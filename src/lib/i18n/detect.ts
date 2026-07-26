export type SupportedLanguage = 'de' | 'en';

export function detectLanguage(input?: string | Navigator): SupportedLanguage {
  if (typeof input === 'string') {
    const text = input.toLowerCase();
    const englishKeywords = ['pain', 'headache', 'appointment', 'doctor', 'help', 'emergency', 'insurance', 'cancel', 'confirm'];
    const matched = englishKeywords.filter((kw) => text.includes(kw));
    if (matched.length > 0) return 'en';
  }

  if (typeof window !== 'undefined' && window.navigator) {
    const navLang = window.navigator.language || (window.navigator.languages && window.navigator.languages[0]) || '';
    if (navLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
  }

  return 'de'; // Default fallback to German (Köln Praxis)
}

export const i18nTranslations = {
  de: {
    welcome: 'Willkommen in der Praxis Dr. med. Ulrike Bongartz',
    triageTitle: 'Digitales Triage- & Anmeldesystem',
    bookAppointment: 'Termin Buchen',
    emergencyNotice: 'Bei akuten Notfällen wählen Sie bitte 112.',
    disclaimer: 'Nur zur Dokumentationsunterstützung. Kein Diagnostikgerät.'
  },
  en: {
    welcome: 'Welcome to Dr. med. Ulrike Bongartz Neurology Practice',
    triageTitle: 'Digital Triage & Patient Intake System',
    bookAppointment: 'Book Appointment',
    emergencyNotice: 'For medical emergencies, please call 112 immediately.',
    disclaimer: 'For documentation support only. Not a diagnostic device.'
  }
};
