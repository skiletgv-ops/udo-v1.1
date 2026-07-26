interface WaitlistPatient {
  id: string;
  name: string;
  phone: string;
  requestedDate: string;
}

// In-memory waitlist queue & active tokens for demo
const waitlistQueue: WaitlistPatient[] = [
  { id: 'wl-1', name: 'Maria Schmidt', phone: '+491711112233', requestedDate: '2026-07-28' },
  { id: 'wl-2', name: 'Jan Becker', phone: '+491722223344', requestedDate: '2026-07-28' }
];

const activeOfferTokens: Map<string, { patientId: string; slotTime: string; expiresAt: number }> = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, slotDate, slotTime, token, responseChoice } = body;

    // Action 1: Cancellation trigger -> Notify next patient in waitlist
    if (action === 'trigger_cancellation') {
      if (waitlistQueue.length === 0) {
        return Response.json({ message: 'No patients in waitlist queue.' }, { status: 200 });
      }

      const nextPatient = waitlistQueue.shift()!;
      const offerToken = `wt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min expiry

      activeOfferTokens.set(offerToken, {
        patientId: nextPatient.id,
        slotTime: `${slotDate} ${slotTime}`,
        expiresAt
      });

      const smsMessage = `Gute Nachricht! Ein früherer Termin bei Frau Dr. Bongartz wurde frei (${slotDate} um ${slotTime}). Um den Termin zu buchen, wählen Sie innerhalb von 15 Minuten: ACCEPT Token: ${offerToken}`;

      console.log(`[Waitlist Auto-SMS] Sent to ${nextPatient.phone}: ${smsMessage}`);

      return Response.json({
        status: 'notified',
        patientNotified: nextPatient.name,
        offerToken,
        expiresInMinutes: 15,
        smsMessage
      });
    }

    // Action 2: Patient responds to offer token (ACCEPT or DECLINE)
    if (action === 'respond_offer') {
      if (!token || !activeOfferTokens.has(token)) {
        return Response.json({ error: 'Ungültiger oder abgelaufener Token (15 Min Limit).' }, { status: 400 });
      }

      const offerData = activeOfferTokens.get(token)!;
      if (Date.now() > offerData.expiresAt) {
        activeOfferTokens.delete(token);
        return Response.json({ error: 'Token ist abgelaufen. Der Termin wurde weitergegeben.' }, { status: 410 });
      }

      if (responseChoice === 'ACCEPT') {
        activeOfferTokens.delete(token);
        return Response.json({
          status: 'booked',
          message: `Termin am ${offerData.slotTime} erfolgreich gebucht!`,
          bookingId: `BK_${Date.now()}`
        });
      } else {
        activeOfferTokens.delete(token);
        return Response.json({
          status: 'declined',
          message: 'Angebot abgelehnt. Nächster Patient wird benachrichtigt.'
        });
      }
    }

    return Response.json({ error: 'Unbekannte Aktion.' }, { status: 400 });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Serverfehler im Waitlist System.' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    waitlistCount: waitlistQueue.length,
    patients: waitlistQueue,
    activeOfferCount: activeOfferTokens.size
  });
}
