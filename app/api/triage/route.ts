import { calculateTriageScore } from '../../../src/lib/triage/scorer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptomText } = body;

    if (!symptomText || typeof symptomText !== 'string') {
      return Response.json({ error: 'Symptom-Text erforderlich.' }, { status: 400 });
    }

    const { urgency, matchedKeywords, reason } = calculateTriageScore(symptomText);

    let message = '';
    let action = '';

    switch (urgency) {
      case 'emergency':
        message = 'Bitte rufen Sie sofort den Notarzt: 112';
        action = 'redirect_er';
        break;
      case 'high':
        message = 'Wir bemühen uns um einen Termin noch heute.';
        action = 'same_day_booking';
        break;
      case 'medium':
      case 'low':
      default:
        message = 'Bitte buchen Sie einen regulären Termin.';
        action = 'standard_booking';
        break;
    }

    return Response.json({
      urgency,
      message,
      action,
      matchedKeywords,
      reason,
      evaluatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Triage Auswertungsfehler' }, { status: 500 });
  }
}
