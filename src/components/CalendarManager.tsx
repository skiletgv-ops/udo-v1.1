import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sliders, 
  User, 
  Check, 
  Wifi, 
  WifiOff
} from "lucide-react";
import { CalendarSlot, CalendarSettings } from "../services/calendarService";

export default function CalendarManager() {
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [settings, setSettings] = useState<CalendarSettings>({
    connected: true,
    provider: "google_calendar",
    workingHoursStart: "08:00",
    workingHoursEnd: "18:00",
    defaultDurationMin: 30,
    bufferMinutes: 10,
    blockedDates: ["2026-12-24", "2026-12-25", "2026-12-31"],
    googleCalendarId: "praxis-bongartz-koeln@calendar.google.com"
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [newBlockedDate, setNewBlockedDate] = useState<string>("");
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar/slots");
      const data = await res.json();
      if (data.slots) setSlots(data.slots);
      if (data.settings) setSettings(data.settings);
    } catch (e) {
      console.error("Error fetching calendar data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    // Live polling every 10 seconds so newly booked appointments appear live
    const interval = setInterval(fetchCalendarData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateSettings = async (updatedFields: Partial<CalendarSettings>) => {
    const updated = { ...settings, ...updatedFields };
    setSettings(updated);
    try {
      await fetch("/api/calendar/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
      fetchCalendarData();
    } catch (e) {
      console.error("Error updating calendar settings:", e);
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate || settings.blockedDates.includes(newBlockedDate)) return;
    const newBlocked = [...settings.blockedDates, newBlockedDate];
    handleUpdateSettings({ blockedDates: newBlocked });
    setNewBlockedDate("");
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    const newBlocked = settings.blockedDates.filter(d => d !== dateToRemove);
    handleUpdateSettings({ blockedDates: newBlocked });
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Google Calendar Live Integration
              {settings.connected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  <Wifi size={12} /> Live Verbunden
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                  <WifiOff size={12} /> Getrennt
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live-Echtzeit-Synchronisation mit dem Praxis-Kalender von Dr. Bongartz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleUpdateSettings({ connected: !settings.connected })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              settings.connected
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10"
                : "bg-teal-500 hover:bg-teal-400 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/20"
            }`}
          >
            {settings.connected ? "Verbindung trennen" : "Jetzt verbinden (OAuth2)"}
          </button>

          <button
            onClick={fetchCalendarData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Sychronisieren"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-teal-400" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Slots & Next Available Termine */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-teal-400" />
                Freie Echtzeit-Terminslots (Die nächsten 14 Tage)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {slots.length} freie Slots
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {slots.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  Keine freien Slots im ausgewählten Zeitraum verbleibend.
                </div>
              ) : (
                slots.slice(0, 12).map(slot => (
                  <div
                    key={slot.slot_id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-teal-500/40 transition-all space-y-1"
                  >
                    <div className="text-xs font-bold text-teal-300">{slot.displayTime}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Dauer: {slot.durationMinutes} Min</span>
                      <span className="text-emerald-400 font-semibold">✓ Verfungsbereit</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Settings & Blocked Dates */}
        <div className="space-y-6">
          {/* Practice Hours & Buffers Settings */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders size={18} className="text-teal-400" />
                Sprechzeiten & Puffer
              </h3>
              {savedNotice && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={12} /> Gespeichert
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Sprechzeit Beginn</label>
                  <input
                    type="time"
                    value={settings.workingHoursStart}
                    onChange={e => handleUpdateSettings({ workingHoursStart: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Sprechzeit Ende</label>
                  <input
                    type="time"
                    value={settings.workingHoursEnd}
                    onChange={e => handleUpdateSettings({ workingHoursEnd: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Standarddauer (Min)</label>
                  <input
                    type="number"
                    value={settings.defaultDurationMin}
                    onChange={e => handleUpdateSettings({ defaultDurationMin: parseInt(e.target.value) || 30 })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Puffer (Minuten)</label>
                  <input
                    type="number"
                    value={settings.bufferMinutes}
                    onChange={e => handleUpdateSettings({ bufferMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blocked Dates Override */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-rose-400" />
              Gesperrte Tage (Urlaub / Feiertage)
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={newBlockedDate}
                onChange={e => setNewBlockedDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none"
              />
              <button
                onClick={handleAddBlockedDate}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus size={14} /> Sperren
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {settings.blockedDates.map(date => (
                <div
                  key={date}
                  className="p-2 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs text-slate-300"
                >
                  <span className="font-mono text-rose-300 font-bold">{date}</span>
                  <button
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
