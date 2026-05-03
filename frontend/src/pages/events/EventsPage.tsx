import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getEvents, registerForEvent } from "@/api/events.api"
import { FeedbackModal } from "@/components/shared/FeedbackModal"
import type { NuruEvent } from "@/types"

const CATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "Health", value: "health" },
  { label: "Career", value: "career" },
  { label: "Social", value: "social" },
  { label: "Education", value: "education" },
]

const TYPE_ICONS: Record<string, string> = {
  workshop: "build",
  talk: "mic",
  gathering: "groups",
  webinar: "videocam",
  other: "event",
}

export default function EventsPage() {
  const [category, setCategory] = useState("")
  const [registering, setRegistering] = useState<string | null>(null)
  const [feedbackContextId, setFeedbackContextId] = useState<string | null>(null)

  const { data: events = [], isLoading: loading } = useQuery<NuruEvent[]>({
    queryKey: ["events", category],
    queryFn: () => {
      const filters: Record<string, string> = {}
      if (category) filters.category = category
      return getEvents(filters)
    },
  })

  const queryClient = useQueryClient()

  const handleRegister = async (id: string) => {
    setRegistering(id)
    try {
      const res = await registerForEvent(id)
      queryClient.setQueryData<NuruEvent[]>(["events", category], (old) =>
        (old || []).map((e) => e._id === id ? { ...e, attendee_count: res.attendee_count } : e)
      )
      // Open feedback modal for the event we just joined
      setFeedbackContextId(id)
    } catch { /* */ }
    finally { setRegistering(null) }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] tracking-[-0.02em] text-on-background">
          Events & Workshops
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-on-surface-variant">
          Join workshops, talks, and community gatherings designed for young people.
        </p>
      </div>

      {/* Category Filters */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
        {CATEGORY_FILTERS.map((f) => (
          <button key={f.value} onClick={() => setCategory(f.value)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${category === f.value ? "bg-primary text-on-primary shadow-sm" : "border border-outline-variant/30 bg-surface-container-high text-on-surface hover:bg-surface-variant"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-outline">event_busy</span>
          <h3 className="mb-2 text-lg font-semibold text-on-surface">No events found</h3>
          <p className="max-w-xs text-sm text-on-surface-variant">Check back later for upcoming events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {events.map((evt) => {
            const date = new Date(evt.date)
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            const icon = TYPE_ICONS[evt.type] || "event"

            return (
              <article key={evt._id} className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_4px_20px_rgba(59,130,246,0.05)] transition-all hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)]">
                {/* Image / Color Header */}
                <div className="relative h-32 bg-gradient-to-br from-primary-container to-primary-fixed">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-on-primary-container/30" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  {evt.is_online && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[14px]">videocam</span> Online
                    </span>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-xs font-semibold text-on-surface uppercase backdrop-blur-sm">{evt.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">{evt.title}</h3>
                  <p className="mb-4 flex-1 text-sm text-on-surface-variant">{evt.description.slice(0, 120)}{evt.description.length > 120 ? "..." : ""}</p>

                  <div className="mb-4 space-y-2 text-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">event</span>
                      {dateStr} at {timeStr}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                      {evt.location_name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">group</span>
                      {evt.attendee_count} attendees{evt.max_attendees ? ` / ${evt.max_attendees} max` : ""}
                    </div>
                  </div>

                  <button onClick={() => handleRegister(evt._id)} disabled={registering === evt._id}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-on-primary transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-on-primary-fixed-variant">
                    {registering === evt._id ? "Registering..." : "Register"}
                    <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <FeedbackModal 
        isOpen={!!feedbackContextId} 
        onClose={() => setFeedbackContextId(null)} 
        context="event"
        contextId={feedbackContextId || undefined}
      />
    </div>
  )
}
