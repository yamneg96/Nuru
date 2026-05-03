import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { createAppointment } from "@/api/appointment.api"

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"]

export default function BookAppointmentPage() {
  const { professionalId } = useParams<{ professionalId: string }>()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState<"online" | "offline">("online")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const today = new Date()
  const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" })
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOffset = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const dayLabels = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

  const handleBook = async () => {
    if (!professionalId || !selectedDate || !selectedTime) return
    setLoading(true)
    try {
      const dateObj = new Date(today.getFullYear(), today.getMonth(), selectedDate)
      await createAppointment({
        professional_id: professionalId,
        appointment_date: dateObj.toISOString(),
        type: appointmentType,
        notes: notes || undefined,
      })
      setStep(3) // success
    } catch {
      alert("Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (step === 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className=" space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-surface">Appointment Booked!</h1>
          <p className="text-lg text-on-surface-variant">Your session has been scheduled. You'll receive a confirmation shortly.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/appointments")} className="w-full rounded-full bg-primary py-4 font-semibold text-on-primary">View My Appointments</button>
            <button onClick={() => navigate("/professionals")} className="w-full rounded-full border border-outline-variant py-4 font-semibold text-on-surface transition-colors hover:bg-surface-container-low">Back to Directory</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-100 bg-white/90 px-5 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="rounded-full p-2 text-on-surface hover:bg-blue-50 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="text-xl font-bold tracking-tight text-blue-600">Nuru</div>
        </div>
      </header>

      <main className="mx-auto w-full grow px-5 py-6 pb-32 md:pb-6">
        {/* Title */}
        <div className="mb-6 mt-4 text-center">
          <h1 className="mb-2 font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-surface">Book a Session</h1>
          <p className="text-on-surface-variant">We're here to listen. Let's find a time that works for you.</p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-1">
          <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-secondary" : "bg-surface-variant"}`} />
          <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-secondary" : "bg-surface-variant"}`} />
        </div>

        {step === 1 && (
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-container/20 blur-3xl" />

            {/* Calendar */}
            <h2 className="mb-1 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">Select Date</h2>
            <p className="mb-4 text-on-surface-variant">Choose an available day.</p>

            <div className="mb-2 flex items-center justify-between px-2">
              <span className="font-semibold text-on-surface">{currentMonth}</span>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center">
              {dayLabels.map((d) => <span key={d} className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">{d}</span>)}
            </div>

            <div className="mb-6 grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOffset === 0 ? 6 : firstDayOffset - 1 }).map((_, i) => <div key={`blank-${i}`} className="aspect-square" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isPast = day < today.getDate()
                const isSelected = selectedDate === day
                return (
                  <button key={day} disabled={isPast} onClick={() => setSelectedDate(day)}
                    className={`flex aspect-square items-center justify-center rounded-full text-sm transition-all ${isSelected ? "scale-105 bg-primary text-on-primary shadow-md" : isPast ? "opacity-30" : "text-on-surface hover:bg-surface-variant"}`}>
                    {day}
                  </button>
                )
              })}
            </div>

            <hr className="mb-6 border-outline-variant/50" />

            {/* Time */}
            <h2 className="mb-2 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">Select Time</h2>
            <div className="mb-6 grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t) => (
                <button key={t} onClick={() => setSelectedTime(t)}
                  className={`rounded-xl border py-3 px-4 text-center transition-colors ${selectedTime === t ? "border-2 border-primary bg-surface-container-low font-semibold text-primary shadow-sm" : "border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-low"}`}>
                  {t}
                </button>
              ))}
            </div>

            <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-on-primary shadow-[0_4px_12px_rgba(0,88,190,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 hover:opacity-90">
              Continue to Next Step
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)]">
            <h2 className="mb-4 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">Confirm Details</h2>

            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
                <span className="material-symbols-outlined text-primary">event</span>
                <span className="text-on-surface">{selectedDate} {currentMonth} at {selectedTime}</span>
              </div>
            </div>

            {/* Type */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-on-surface-variant">Session Type</p>
              <div className="flex gap-3">
                {(["online", "offline"] as const).map((t) => (
                  <button key={t} onClick={() => setAppointmentType(t)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 px-4 font-semibold transition-all ${appointmentType === t ? "border-2 border-primary bg-surface-container-low text-primary" : "border-outline-variant text-on-surface"}`}>
                    <span className="material-symbols-outlined text-[20px]">{t === "online" ? "video_camera_front" : "location_on"}</span>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-on-surface-variant">Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything you'd like the professional to know..." className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-outline-variant py-4 font-semibold text-on-surface transition-colors hover:bg-surface-container-low">Back</button>
              <button onClick={handleBook} disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-on-primary transition-all active:scale-[0.98] disabled:opacity-50">
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
