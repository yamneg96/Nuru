import { useState, useEffect } from "react"
import { getReports } from "@/api/admin.api"
import type { PublicReport } from "@/types"

export default function ReportsPage() {
  const [reports, setReports] = useState<PublicReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try { setReports(await getReports()) }
      catch { setReports([]) }
      finally { setLoading(false) }
    })()
  }, [])

  const quarterly = reports.filter((r) => r.type === "quarterly" || r.type === "annual")
  const monthly = reports.filter((r) => r.type === "monthly")

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
      {/* Hero */}
      <section className="mb-8 flex flex-col items-center gap-4 py-6 text-center md:py-10">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] tracking-[-0.02em] text-primary">
          Our Public Impact
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-on-surface-variant">
          Transparency is at the core of our mission. Explore our latest reports
          to see how Nuru is empowering youth through safe, accessible, and
          non-judgmental guidance.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-outline">
            analytics
          </span>
          <h3 className="mb-2 text-lg font-semibold text-on-surface">
            No reports published yet
          </h3>
          <p className="max-w-xs text-sm text-on-surface-variant">
            Check back soon for our impact reports.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Metrics from latest report */}
          {reports[0] && (
            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl bg-primary-container p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-20">
                  <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                </div>
                <span className="relative z-10 text-xs font-semibold tracking-wider text-on-primary-container/80 uppercase">Total Youth Served</span>
                <span className="relative z-10 mt-1 block font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-primary-container">
                  {(reports[0].metrics?.users_served ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-secondary-container p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-20">
                  <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                </div>
                <span className="relative z-10 text-xs font-semibold tracking-wider text-on-secondary-container/80 uppercase">Conversations Held</span>
                <span className="relative z-10 mt-1 block font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-secondary-container">
                  {(reports[0].metrics?.conversations_held ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-high p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-10 text-primary">
                  <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                </div>
                <span className="relative z-10 text-xs font-semibold tracking-wider text-on-surface/70 uppercase">Active Professionals</span>
                <span className="relative z-10 mt-1 block font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-surface">
                  {(reports[0].metrics?.professionals_active ?? 0).toLocaleString()}
                </span>
              </div>
            </section>
          )}

          {/* Quarterly Reports */}
          {quarterly.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between border-b border-surface-variant pb-2">
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">Quarterly Reports</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {quarterly.map((r) => (
                  <div key={r._id} className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-on-surface">{r.title}</h3>
                        <p className="text-xs font-semibold tracking-wider text-outline uppercase">
                          {r.published_at ? `Published ${formatDate(r.published_at)}` : "Draft"}
                        </p>
                      </div>
                      <div className="rounded-full bg-surface-container p-2 text-primary">
                        <span className="material-symbols-outlined">analytics</span>
                      </div>
                    </div>
                    <p className="flex-1 text-on-surface-variant">
                      {r.summary_markdown?.slice(0, 180) || "View the full report for detailed analysis."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button className="rounded-full bg-primary px-6 py-2 font-semibold text-on-primary transition-colors active:scale-95 hover:bg-surface-tint">
                        Read Full Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Monthly */}
          {monthly.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between border-b border-surface-variant pb-2">
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">Monthly Briefs</h2>
              </div>
              <div className="space-y-2">
                {monthly.map((r) => (
                  <div key={r._id} className="flex flex-col items-start justify-between gap-4 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 transition-colors hover:bg-surface-container-low sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="hidden rounded-lg bg-secondary-container/30 p-3 text-secondary sm:flex">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-on-surface">{r.title}</h4>
                        <span className="text-sm text-on-surface-variant">
                          {formatDate(r.period.from)} – {formatDate(r.period.to)}
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-2 font-semibold text-primary hover:underline">
                      View Brief
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
