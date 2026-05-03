import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAdminStats, getAdminEngagement, verifyAdmin } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type { AdminDashboardStats, AdminEngagement } from "@/types"


export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [engagement, setEngagement] = useState<AdminEngagement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        await verifyAdmin()
        const [s, e] = await Promise.all([getAdminStats(), getAdminEngagement()])
        setStats(s)
        setEngagement(e)
      } catch {
        navigate("/admin/login")
      } finally {
        setLoading(false)
      }
    })()
  }, [navigate])


  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Sidebar */}
      <AdminSidebar active="Dashboard" />

      {/* Main */}
      <main className="ml-0 min-h-screen flex-1 overflow-y-auto bg-surface-container-low p-6 md:ml-72">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between py-2">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] text-on-background">Analytics Overview</h2>
            <p className="mt-1 text-on-surface-variant">Platform performance and user engagement metrics.</p>
          </div>
        </header>

        {/* KPI Cards */}
        {stats && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Users" value={(stats.users?.total ?? 0).toLocaleString()} icon="group" iconBg="bg-primary-container/20" iconColor="text-primary" />
            <KpiCard label="Messages Logged" value={(stats.activity?.messages ?? 0).toLocaleString()} icon="forum" iconBg="bg-secondary-container/30" iconColor="text-secondary" />
            <KpiCard label="Total Events" value={(stats.activity?.events ?? 0).toLocaleString()} icon="event" iconBg="bg-tertiary-container/20" iconColor="text-tertiary" />
            <KpiCard label="Active Professionals" value={(stats.professionals?.active ?? 0).toLocaleString()} icon="local_hospital" iconBg="bg-primary-fixed/50" iconColor="text-primary" subtext={`${stats.professionals?.total ?? 0} total`} />
          </div>
        )}

        {/* Charts Row */}
        {engagement && (
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* User Growth */}
            <div className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(59,130,246,0.04)]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-background">User Growth</h3>
              </div>
              <div className="relative flex min-h-[200px] flex-1 items-end gap-2 px-2 pb-8 pt-8">
                {/* Grid lines */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
                  {[0, 1, 2, 3].map((i) => <div key={i} className="h-0 w-full border-b border-outline-variant/20" />)}
                </div>
                {/* Bars */}
                <div className="relative z-10 flex h-full w-full items-end justify-between px-2 pb-8">
                  {(engagement.daily_registrations.slice(-7) || []).map((d, i) => {
                    const maxVal = Math.max(...engagement.daily_registrations.map((x) => x.count), 1)
                    const pct = Math.max((d.count / maxVal) * 100, 5)
                    return (
                      <div key={i} className="group flex flex-col items-center gap-1">
                        <div className={`w-3 rounded-t-sm transition-all ${i === engagement.daily_registrations.slice(-7).length - 1 ? "bg-primary" : "bg-primary-container opacity-80"}`} style={{ height: `${pct}%`, minHeight: "8px" }} />
                        <span className="text-[10px] text-outline-variant">{d._id.slice(-2)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Messages Trend */}
            <div className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(59,130,246,0.04)]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-background">Message Trends</h3>
              </div>
              <div className="relative flex min-h-[200px] flex-1 items-end gap-4">
                {(engagement.daily_messages.slice(-4) || []).map((d, i) => {
                  const maxVal = Math.max(...engagement.daily_messages.map((x) => x.count), 1)
                  const pct = Math.max((d.count / maxVal) * 100, 10)
                  return (
                    <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1">
                      <div className="w-full rounded-t-md bg-secondary-container transition-all group-hover:opacity-80" style={{ height: `${pct}%`, minHeight: "16px" }} />
                      <div className="mt-2 text-center text-xs text-outline-variant">W{i + 1}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-3">
          <QuickLinkCard title="Manage Content" description="Create and edit modules, articles, and videos" icon="menu_book" onClick={() => navigate("/admin/content")} />
          <QuickLinkCard title="Verify Professionals" description="Review pending professional applications" icon="verified" onClick={() => navigate("/admin/professionals")} />
          <QuickLinkCard title="Manage Events" description="Create, update, and monitor community events" icon="event" onClick={() => navigate("/admin/events")} />
        </div>
      </main>
    </div>
  )
}

function KpiCard({ label, value, icon, iconBg, iconColor, subtext }: { label: string; value: string; icon: string; iconBg: string; iconColor: string; subtext?: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-[0_4px_24px_rgba(59,130,246,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg} ${iconColor}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div>
        <div className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] text-on-background">{value}</div>
        {subtext && <span className="mt-1 text-sm text-on-surface-variant">{subtext}</span>}
      </div>
    </div>
  )
}

function QuickLinkCard({ title, description, icon, onClick }: { title: string; description: string; icon: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-start gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 text-left shadow-[0_4px_24px_rgba(59,130,246,0.04)] transition-all hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h4 className="font-semibold text-on-surface">{title}</h4>
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      </div>
    </button>
  )
}
