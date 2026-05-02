import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProfessionalById } from "@/api/professional.api"
// import type { Professional } from "@/types"

export default function ProfessionalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pro, isLoading: loading } = useQuery({
    queryKey: ["professional", id],
    queryFn: () => getProfessionalById(id!),
    enabled: !!id,
  })

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  if (!pro) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined mb-4 text-[48px] text-outline">person_off</span>
      <h2 className="mb-2 text-lg font-semibold text-on-surface">Professional not found</h2>
      <button onClick={() => navigate("/professionals")} className="mt-4 rounded-full bg-primary px-6 py-2 font-semibold text-on-primary">Back to Directory</button>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-6 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-on-surface-variant">
        <button onClick={() => navigate("/professionals")} className="transition-colors hover:text-primary">Professionals</button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-on-surface">{pro.full_name}</span>
      </nav>

      {/* Hero Card */}
      <section className="relative mb-6 flex flex-col items-center gap-6 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(59,130,246,0.04)] md:flex-row md:items-start md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-surface-container opacity-50 blur-3xl" />
        <div className="relative shrink-0">
          <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border-4 border-surface-container-lowest shadow-sm md:h-40 md:w-40">
            {pro.photo_url ? <img src={pro.photo_url} alt={pro.full_name} className="h-full w-full object-cover" /> : (
              <div className="flex h-full w-full items-center justify-center bg-primary-container text-on-primary-container">
                <span className="material-symbols-outlined text-[48px]">person</span>
              </div>
            )}
          </div>
          {pro.verification_status === "verified" && (
            <div className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-secondary-container text-on-secondary-container shadow-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          )}
        </div>
        <div className="z-10 flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] text-on-surface">{pro.full_name}</h1>
          <p className="mb-4 flex items-center gap-1 text-lg text-primary">
            <span className="material-symbols-outlined text-[20px]">medical_services</span>
            {pro.type.charAt(0).toUpperCase() + pro.type.slice(1)} • {pro.years_of_experience}y exp
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5">
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-semibold text-on-surface">{pro.rating.toFixed(1)}</span>
              <span className="text-sm text-on-surface-variant">({pro.rating_count})</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {pro.institution}, {pro.city}
            </div>
          </div>
          <p className="max-w-2xl leading-relaxed text-on-surface-variant">{pro.bio}</p>
        </div>
        <div className="z-10 w-full shrink-0 pt-4 md:ml-auto md:w-auto md:pt-0">
          <button onClick={() => navigate(`/appointments/book/${pro._id}`)} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-on-primary shadow-sm transition-all active:scale-95 hover:bg-on-primary-fixed-variant md:w-auto">
            <span className="material-symbols-outlined">calendar_month</span> Book Appointment
          </button>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-6 md:col-span-2">
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <h2 className="mb-4 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">About</h2>
            <p className="leading-relaxed text-on-surface-variant">{pro.bio}</p>
          </section>
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <h2 className="mb-4 flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
              <span className="material-symbols-outlined text-secondary">psychiatry</span> Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {pro.specializations.map((s: string) => (
                <span key={s} className="rounded-full border border-surface-variant bg-surface-container px-4 py-2 text-xs font-semibold tracking-wider text-on-surface uppercase">{s}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="md:col-span-1">
          <section className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <h2 className="mb-4 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">Availability</h2>
            <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
              <span className="material-symbols-outlined text-secondary">{pro.availability?.online ? "video_camera_front" : "location_on"}</span>
              <p className="font-semibold text-on-surface">
                {pro.availability?.online && pro.availability?.offline ? "Online & In-Person" : pro.availability?.online ? "Online Only" : "In-Person Only"}
              </p>
            </div>
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-surface-container-low p-3">
              <span className="material-symbols-outlined mt-0.5 text-[18px] text-secondary">lock</span>
              <p className="text-xs leading-tight text-on-surface-variant">Your booking details are encrypted and strictly confidential.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
