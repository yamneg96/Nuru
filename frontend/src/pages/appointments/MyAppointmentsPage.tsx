import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMyAppointments, cancelAppointment, rateAppointment } from "@/api/appointment.api"
import type { Appointment } from "@/types"

type Tab = "upcoming" | "past"

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-tertiary-fixed/20", text: "text-tertiary", icon: "schedule" },
  confirmed: { bg: "bg-secondary-container/20", text: "text-secondary", icon: "check_circle" },
  completed: { bg: "bg-secondary-container/20", text: "text-secondary", icon: "check_circle" },
  cancelled: { bg: "bg-error-container/40", text: "text-error", icon: "cancel" },
}

export default function MyAppointmentsPage() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("upcoming")
  const [ratingModal, setRatingModal] = useState<string | null>(null)
  const [ratingValue, setRatingValue] = useState(5)

  useEffect(() => {
    ;(async () => {
      try { setAppointments(await getMyAppointments()) }
      catch { setAppointments([]) }
      finally { setLoading(false) }
    })()
  }, [])

  const upcoming = appointments.filter((a) => ["pending", "confirmed"].includes(a.status))
  const past = appointments.filter((a) => ["completed", "cancelled"].includes(a.status))
  const displayed = tab === "upcoming" ? upcoming : past

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return
    try {
      const updated = await cancelAppointment(id)
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)))
    } catch { /* */ }
  }

  const handleRate = async (id: string) => {
    try {
      const updated = await rateAppointment(id, ratingValue)
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)))
      setRatingModal(null)
    } catch { /* */ }
  }

  const getProfName = (a: Appointment) => {
    if (typeof a.professional_id === "object") return a.professional_id.full_name
    return "Professional"
  }

  const getProfType = (a: Appointment) => {
    if (typeof a.professional_id === "object") return a.professional_id.type
    return ""
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] text-on-background">My Appointments</h1>
          <p className="text-on-surface-variant">Manage your upcoming visits and view past interactions.</p>
        </div>
        <div className="flex gap-2 rounded-full bg-surface-variant p-1">
          {(["upcoming", "past"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-6 py-2 font-semibold transition-all ${tab === t ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-background"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-outline">calendar_month</span>
          <h3 className="mb-2 text-lg font-semibold text-on-surface">No {tab} appointments</h3>
          <p className="mb-4 max-w-xs text-sm text-on-surface-variant">
            {tab === "upcoming" ? "Book a session with a professional to get started." : "Your past appointments will appear here."}
          </p>
          {tab === "upcoming" && (
            <button onClick={() => navigate("/professionals")} className="rounded-full bg-primary px-6 py-3 font-semibold text-on-primary">Find Professionals</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((apt) => {
            const dateStr = new Date(apt.appointment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            const timeStr = new Date(apt.appointment_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            const status = STATUS_STYLES[apt.status] || STATUS_STYLES.pending

            return (
              <div key={apt._id} className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_4px_16px_rgba(59,130,246,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(59,130,246,0.08)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">{dateStr}</span>
                  <span className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold uppercase ${status.bg} ${status.text}`}>
                    <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
                    {apt.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-background">{getProfName(apt)}</h4>
                    <p className="text-sm text-on-surface-variant">{getProfType(apt)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-surface-variant/30 p-3">
                  <div className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">{apt.type === "online" ? "video_camera_front" : "event"}</span>
                    {timeStr}
                  </div>
                  <span className="rounded bg-surface px-2 py-1 text-xs font-semibold uppercase text-on-surface-variant">{apt.type}</span>
                </div>

                {/* Actions */}
                {tab === "upcoming" && apt.status !== "cancelled" && (
                  <div className="flex gap-2 border-t border-outline-variant/20 pt-3">
                    <button onClick={() => handleCancel(apt._id)} className="rounded-full px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error-container">Cancel</button>
                  </div>
                )}
                {tab === "past" && apt.status === "completed" && !apt.user_rating && (
                  <div className="border-t border-outline-variant/20 pt-3">
                    <button onClick={() => setRatingModal(apt._id)} className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">rate_review</span> Leave a Rating
                    </button>
                  </div>
                )}
                {apt.user_rating && (
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
                    <span className="text-xs font-semibold uppercase text-on-surface-variant">Your Rating</span>
                    <div className="flex gap-0.5 text-tertiary-fixed-dim">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-[18px]" style={s <= apt.user_rating! ? { fontVariationSettings: "'FILL' 1" } : { opacity: 0.3 }}>star</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
            <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">Rate Your Experience</h3>
            <div className="mb-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRatingValue(s)} className="text-tertiary-fixed-dim transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-[32px]" style={s <= ratingValue ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)} className="flex-1 rounded-full border border-outline-variant py-3 font-semibold text-on-surface">Cancel</button>
              <button onClick={() => handleRate(ratingModal)} className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
