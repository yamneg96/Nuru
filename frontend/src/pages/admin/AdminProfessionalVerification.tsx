import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAdminProfessionals, verifyProfessional } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type { Professional } from "@/types"

const STATUS_TABS = [
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
]

export default function AdminProfessionalVerification() {
  const navigate = useNavigate()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("pending")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try { setProfessionals(await getAdminProfessionals(status)) }
      catch { setProfessionals([]) }
      finally { setLoading(false) }
    })()
  }, [status])

  const handleVerify = async (id: string, newStatus: "verified" | "rejected") => {
    setActionLoading(id)
    try {
      const updated = await verifyProfessional(id, newStatus)
      setProfessionals((prev) => prev.map((p) => p._id === id ? updated : p))
    } catch { /* */ }
    finally { setActionLoading(null) }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar active="Professionals" />

      <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-72">
        <div className="mb-6">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Professional Verification</h1>
          <p className="mt-1 text-on-surface-variant">Review and manage professional applications.</p>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex gap-2 rounded-full bg-surface-variant p-1 w-fit">
          {STATUS_TABS.map((t) => (
            <button key={t.value} onClick={() => setStatus(t.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${status === t.value ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-background"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : professionals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-outline">person_search</span>
            <h3 className="text-lg font-semibold text-on-surface">No {status} professionals</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {professionals.map((pro) => (
              <div key={pro._id} className="flex flex-col gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-surface-variant bg-surface-container-low">
                    {pro.photo_url ? <img src={pro.photo_url} alt={pro.full_name} className="h-full w-full object-cover" /> : (
                      <span className="material-symbols-outlined text-[24px] text-on-surface-variant">person</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface">{pro.full_name}</h3>
                    <p className="text-sm text-primary">{pro.type} • {pro.institution}</p>
                    <p className="text-sm text-on-surface-variant">{pro.city}, {pro.region} • {pro.years_of_experience}y exp</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pro.email && <span className="text-sm text-on-surface-variant">{pro.email}</span>}
                  {status === "pending" && (
                    <>
                      <button onClick={() => handleVerify(pro._id, "verified")} disabled={actionLoading === pro._id}
                        className="flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-on-secondary transition-colors disabled:opacity-50 hover:opacity-90">
                        <span className="material-symbols-outlined text-[16px]">check</span> Verify
                      </button>
                      <button onClick={() => handleVerify(pro._id, "rejected")} disabled={actionLoading === pro._id}
                        className="flex items-center gap-1 rounded-full bg-error-container px-4 py-2 text-sm font-semibold text-on-error-container transition-colors disabled:opacity-50 hover:opacity-90">
                        <span className="material-symbols-outlined text-[16px]">close</span> Reject
                      </button>
                    </>
                  )}
                  {status === "verified" && (
                    <span className="flex items-center gap-1 rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-semibold text-secondary">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
