export interface CalendarSlot {
  slot_id: string;
  datetime: string; // ISO String e.g. "2026-07-23T10:00:00.000Z"
  displayTime: string; // Human readable "Donnerstag, 23. Juli 10:00"
  durationMinutes: number;
  available: boolean;
}

export interface PatientInfo {
  name: string;
  reason: string;
  phone?: string;
  email?: string;
  insurance?: string;
}

export interface BookingConfirmation {
  success: boolean;
  bookingId?: string;
  slot?: CalendarSlot;
  eventUrl?: string;
  error?: string;
  retrySlots?: CalendarSlot[];
}

export interface CalendarSettings {
  connected: boolean;
  provider: "google_calendar" | "outlook" | "local_practice";
  workingHoursStart: string; // "08:00"
  workingHoursEnd: string;   // "18:00"
  defaultDurationMin: number; // 30
  bufferMinutes: number;      // 10
  blockedDates: string[];     // ["2026-12-24", "2026-12-25", "2026-12-31"]
  googleCalendarId?: string;
}

export interface CalendarProvider {
  getAvailableSlots(fromDateISO: string, toDateISO: string, durationMin?: number): Promise<CalendarSlot[]>;
  bookSlot(slotId: string, patient: PatientInfo): Promise<BookingConfirmation>;
  cancelSlot(slotId: string): Promise<boolean>;
  getSettings(): CalendarSettings;
  updateSettings(settings: Partial<CalendarSettings>): CalendarSettings;
}

// Memory store for local practice calendar and bookings with optimistic locking
class InMemoryCalendarService implements CalendarProvider {
  private settings: CalendarSettings = {
    connected: true,
    provider: "google_calendar",
    workingHoursStart: "08:00",
    workingHoursEnd: "18:00",
    defaultDurationMin: 30,
    bufferMinutes: 10,
    blockedDates: ["2026-12-24", "2026-12-25", "2026-12-31", "2026-08-01"],
    googleCalendarId: "praxis-bongartz-koeln@calendar.google.com"
  };

  private bookedSlots: Map<string, { bookingId: string; patient: PatientInfo; bookedAt: string }> = new Map();

  constructor() {
    // Seed initial appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const seedSlotId = `${tomorrow.toISOString().split("T")[0]}_09:00`;
    this.bookedSlots.set(seedSlotId, {
      bookingId: "bk-seed-1",
      patient: { name: "Thomas Müller", reason: "Gutachtertermin S2k", phone: "+49 221 55432" },
      bookedAt: new Date().toISOString()
    });
  }

  public getSettings(): CalendarSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<CalendarSettings>): CalendarSettings {
    this.settings = { ...this.settings, ...newSettings };
    return this.getSettings();
  }

  public async getAvailableSlots(fromDateISO: string, toDateISO: string, durationMin: number = 30): Promise<CalendarSlot[]> {
    const slots: CalendarSlot[] = [];
    const start = new Date(fromDateISO);
    const end = new Date(toDateISO);

    // Loop through days in range
    const currentDay = new Date(start);
    currentDay.setHours(0, 0, 0, 0);

    const [startHour, startMin] = this.settings.workingHoursStart.split(":").map(Number);
    const [endHour, endMin] = this.settings.workingHoursEnd.split(":").map(Number);

    while (currentDay <= end) {
      const dayOfWeek = currentDay.getDay(); // 0 = Sun, 6 = Sat
      const dateStr = currentDay.toISOString().split("T")[0];

      // Skip weekends and blocked holiday dates
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !this.settings.blockedDates.includes(dateStr)) {
        const slotTime = new Date(currentDay);
        slotTime.setHours(startHour, startMin, 0, 0);

        const dayEndTime = new Date(currentDay);
        dayEndTime.setHours(endHour, endMin, 0, 0);

        while (slotTime.getTime() + durationMin * 60000 <= dayEndTime.getTime()) {
          const timeStr = slotTime.toTimeString().substring(0, 5); // "10:00"
          const slotId = `${dateStr}_${timeStr}`;

          // Check if slot is in the past
          const isPast = slotTime.getTime() < Date.now();
          const isBooked = this.bookedSlots.has(slotId);

          if (!isPast && !isBooked) {
            const displayFormatter = new Intl.DateTimeFormat("de-DE", {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            });

            slots.push({
              slot_id: slotId,
              datetime: slotTime.toISOString(),
              displayTime: displayFormatter.format(slotTime),
              durationMinutes: durationMin,
              available: true
            });
          }

          // Advance by duration + buffer
          slotTime.setMinutes(slotTime.getMinutes() + durationMin + this.settings.bufferMinutes);
        }
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return slots;
  }

  public async bookSlot(slotId: string, patient: PatientInfo): Promise<BookingConfirmation> {
    // Optimistic locking check: ensure slot is not taken right before writing
    if (this.bookedSlots.has(slotId)) {
      // Slot taken! Return failure + fresh slots
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const freshSlots = await this.getAvailableSlots(tomorrow.toISOString(), nextWeek.toISOString(), 30);

      return {
        success: false,
        error: "Der gewählte Termin wurde soeben anderweitig vergeben.",
        retrySlots: freshSlots.slice(0, 3)
      };
    }

    const bookingId = `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.bookedSlots.set(slotId, {
      bookingId,
      patient,
      bookedAt: new Date().toISOString()
    });

    const [datePart, timePart] = slotId.split("_");
    const slotDate = new Date(`${datePart}T${timePart || "10:00"}:00.000Z`);

    const displayFormatter = new Intl.DateTimeFormat("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    return {
      success: true,
      bookingId,
      slot: {
        slot_id: slotId,
        datetime: slotDate.toISOString(),
        displayTime: displayFormatter.format(slotDate),
        durationMinutes: this.settings.defaultDurationMin,
        available: false
      },
      eventUrl: `https://calendar.google.com/calendar/r/eventedit?text=Praxis+Dr.+Bongartz:+${encodeURIComponent(patient.name)}&details=${encodeURIComponent(patient.reason)}`
    };
  }

  public async cancelSlot(slotId: string): Promise<boolean> {
    return this.bookedSlots.delete(slotId);
  }
}

export const calendarService = new InMemoryCalendarService();
