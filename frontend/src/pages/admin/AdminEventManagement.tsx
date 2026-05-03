import { useState, useEffect } from "react"
import { getEvents } from "@/api/events.api"
import { createEvent, updateEvent, deleteEvent } from "@/api/admin.api"
import type { NuruEvent } from "@/types"

import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function AdminEventManagement() {
  const [events, setEvents] = useState<NuruEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", type: "workshop" as NuruEvent["type"], category: "health" as NuruEvent["category"], date: "", location_name: "", is_online: false, max_attendees: 0 })

  useEffect(() => {
    ;(async () => {
      try { setEvents(await getEvents()) }
      catch { setEvents([]) }
      finally { setLoading(false) }
    })()
  }, [])

  const handleCreate = async () => {
    if (!form.title || !form.date) return
    try {
      const evt = await createEvent({ ...form, organizer: "Nuru", attendee_count: 0, max_attendees: form.max_attendees || undefined })
      setEvents((prev) => [...prev, evt])
      setShowCreate(false)
      setForm({ title: "", description: "", type: "workshop", category: "health", date: "", location_name: "", is_online: false, max_attendees: 0 })
    } catch { /* */ }
  }

  const handleToggleOnline = async (id: string, isOnline: boolean) => {
    try {
      const updated = await updateEvent(id, { is_online: !isOnline })
      setEvents((prev) => prev.map((e) => e._id === id ? updated : e))
    } catch { /* */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return
    try { await deleteEvent(id); setEvents((p) => p.filter((e) => e._id !== id)) }
    catch { /* */ }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="ml-0 flex-1 p-6 md:ml-72">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Event Management</h1>
            <p className="mt-1 text-on-surface-variant">Create and manage community events.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all active:scale-95 hover:bg-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-[20px]">add</span> New Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center"><span className="material-symbols-outlined mb-2 text-[48px] text-outline">event_busy</span><p className="text-on-surface-variant">No events yet.</p></div>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt._id} className="flex flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
                    <span className="material-symbols-outlined">event</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-on-surface">{evt.title}</h4>
                    <p className="text-sm text-on-surface-variant">{new Date(evt.date).toLocaleDateString()} • {evt.location_name} • {evt.attendee_count} attendees</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${evt.is_online ? "bg-primary-container/20 text-primary" : "bg-surface-variant text-on-surface-variant"}`}>
                    {evt.is_online ? "Online" : "In-Person"}
                  </span>
                  <button onClick={() => handleToggleOnline(evt._id, evt.is_online)} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-variant" title="Toggle online/offline">
                    <span className="material-symbols-outlined text-[20px]">{evt.is_online ? "location_on" : "videocam"}</span>
                  </button>
                  <button onClick={() => handleDelete(evt._id)} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="mx-4 w-full rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
              <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">Create Event</h3>
              <div className="space-y-3">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                  <input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} placeholder="Location" className="rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as NuruEvent["type"] })} className="rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary">
                    <option value="workshop">Workshop</option><option value="talk">Talk</option><option value="gathering">Gathering</option><option value="webinar">Webinar</option><option value="other">Other</option>
                  </select>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as NuruEvent["category"] })} className="rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary">
                    <option value="health">Health</option><option value="career">Career</option><option value="social">Social</option><option value="education">Education</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-on-surface-variant">
                  <input type="checkbox" checked={form.is_online} onChange={(e) => setForm({ ...form, is_online: e.target.checked })} className="rounded border-outline-variant text-primary focus:ring-primary" /> Online event
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-outline-variant py-3 font-semibold text-on-surface">Cancel</button>
                <button onClick={handleCreate} className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary">Create Event</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
