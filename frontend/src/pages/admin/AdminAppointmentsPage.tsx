import { useState, useEffect } from "react"
import { getAdminAppointments } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type { Appointment } from "@/types"

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await getAdminAppointments()
        setAppointments(data)
      } catch {
        setAppointments([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar active="Appointments" />

      <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-72">
        <div className="mb-6">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Platform Appointments</h1>
          <p className="mt-1 text-on-surface-variant">View all user-to-professional appointments across the platform.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-outline">event_busy</span>
            <h3 className="text-lg font-semibold text-on-surface">No appointments found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant">
                <tr>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Professional</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {appointments.map((apt) => {
                  const user: any = apt.user_id || {}
                  const prof: any = apt.professional_id || {}
                  return (
                    <tr key={apt._id} className="transition-colors hover:bg-surface-variant/30">
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-on-surface">
                          {new Date(apt.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-on-surface">{user.name || "Anonymous User"}</div>
                        <div className="text-xs text-on-surface-variant">{user.email || user.anonymous_id?.slice(0, 8)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-on-surface">{prof.full_name || "Unknown"}</div>
                        <div className="text-xs text-primary">{prof.type?.replace("_", " ")}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${apt.type === "online" ? "bg-primary-container/30 text-primary" : "bg-tertiary-container/30 text-tertiary"}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {apt.type === "online" ? "videocam" : "location_on"}
                          </span>
                          {apt.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          apt.status === "completed" ? "bg-secondary-container/20 text-secondary" :
                          apt.status === "confirmed" ? "bg-primary-container/20 text-primary" :
                          apt.status === "cancelled" ? "bg-error-container/20 text-error" :
                          "bg-surface-variant text-on-surface-variant"
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {apt.duration_minutes} min
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
