import { useState, useEffect } from "react"
import { getEvents } from "@/api/events.api"
import { createEvent, updateEvent, deleteEvent } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type { NuruEvent } from "@/types"

export default function AdminEventManagement() {
  const [events, setEvents] = useState<NuruEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    type: "workshop" as NuruEvent["type"], 
    category: "health" as NuruEvent["category"], 
    date: "", 
    location_name: "", 
    is_online: false, 
    meeting_link: "",
    max_attendees: 0,
    image_url: ""
  })

  useEffect(() => {
    ;(async () => {
      try { setEvents(await getEvents()) }
      catch { setEvents([]) }
      finally { setLoading(false) }
    })()
  }, [])

  const openCreate = () => {
    setForm({ title: "", description: "", type: "workshop", category: "health", date: "", location_name: "", is_online: false, meeting_link: "", max_attendees: 0, image_url: "" })
    setEditingId(null)
    setShowModal(true)
  }

  const openEdit = (evt: NuruEvent) => {
    // format date for datetime-local input
    const dateObj = new Date(evt.date)
    const formattedDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    
    setForm({
      title: evt.title,
      description: evt.description,
      type: evt.type,
      category: evt.category,
      date: formattedDate,
      location_name: evt.location_name,
      is_online: evt.is_online,
      meeting_link: evt.meeting_link || "",
      max_attendees: evt.max_attendees || 0,
      image_url: evt.image_url || ""
    })
    setEditingId(evt._id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.date) return
    try {
      const payload: Partial<NuruEvent> = {
        title: form.title,
        description: form.description,
        type: form.type,
        category: form.category,
        date: new Date(form.date).toISOString(),
        location_name: form.location_name,
        is_online: form.is_online,
        meeting_link: form.meeting_link || undefined,
        max_attendees: form.max_attendees || undefined,
        image_url: form.image_url || undefined,
        organizer: "Nuru"
      }

      if (editingId) {
        const evt = await updateEvent(editingId, payload)
        setEvents((prev) => prev.map((e) => e._id === editingId ? evt : e))
      } else {
        const evt = await createEvent(payload)
        setEvents((prev) => [...prev, evt])
      }
      setShowModal(false)
    } catch { /* alert on error */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return
    try { await deleteEvent(id); setEvents((p) => p.filter((e) => e._id !== id)) }
    catch { /* */ }
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar active="Events" />

      <main className="ml-0 flex-1 p-6 md:ml-72">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Event Management</h1>
            <p className="mt-1 text-on-surface-variant">Create and manage community events.</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all active:scale-95 hover:bg-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-[20px]">add</span> New Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center"><span className="material-symbols-outlined mb-2 text-[48px] text-outline">event_busy</span><p className="text-on-surface-variant">No events yet.</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evt) => (
              <div key={evt._id} className="flex flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${evt.is_online ? "bg-primary-container/20 text-primary" : "bg-surface-variant text-on-surface-variant"}`}>
                    {evt.is_online ? "Online" : "In-Person"}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(evt)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-primary-container hover:text-primary">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(evt._id)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                
                {evt.image_url && (
                  <div className="h-32 w-full overflow-hidden rounded-lg bg-surface-variant">
                    <img src={evt.image_url} alt={evt.title} className="h-full w-full object-cover" />
                  </div>
                )}
                
                <div>
                  <h4 className="font-bold text-on-surface leading-tight">{evt.title}</h4>
                  <p className="text-sm text-primary mt-1">{new Date(evt.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                
                <div className="mt-auto space-y-1 text-sm text-on-surface-variant pt-3 border-t border-outline-variant/20">
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">location_on</span> {evt.location_name}</div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">group</span> {evt.attendee_count} / {evt.max_attendees || "∞"} attendees</div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">category</span> {evt.type} • {evt.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="my-auto w-full max-w-2xl rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
              <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">
                {editingId ? "Edit Event" : "Create Event"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Date & Time</label>
                    <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Location Name</label>
                    <input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} placeholder="E.g., Nairobi Center or Zoom" className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as NuruEvent["type"] })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary">
                      <option value="workshop">Workshop</option><option value="talk">Talk</option><option value="gathering">Gathering</option><option value="webinar">Webinar</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as NuruEvent["category"] })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary">
                      <option value="health">Health</option><option value="career">Career</option><option value="social">Social</option><option value="education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Meeting Link (Optional)</label>
                    <input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Max Attendees (0 for unlimited)</label>
                    <input type="number" min="0" value={form.max_attendees} onChange={(e) => setForm({ ...form, max_attendees: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Cover Image URL (Optional)</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 text-on-surface font-semibold cursor-pointer">
                    <input type="checkbox" checked={form.is_online} onChange={(e) => setForm({ ...form, is_online: e.target.checked })} className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" />
                    This is an online event
                  </label>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-outline-variant py-3 font-semibold text-on-surface hover:bg-surface-variant">Cancel</button>
                <button onClick={handleSave} className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary hover:bg-on-primary-fixed-variant">
                  {editingId ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
