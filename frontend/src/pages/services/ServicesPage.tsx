import { useState, useEffect } from "react"
import { getServices } from "@/api/services.api"
import { NuruButton } from "@/components/shared/buttons/NuruButton"
import type { ServiceLocation } from "@/types"

const FILTERS = [
  { label: "All Nearby", tag: "", icon: "check" },
  { label: "Free Services", tag: "free_options", icon: "volunteer_activism" },
  { label: "Youth-friendly", tag: "youth_friendly", icon: "child_care" },
  { label: "Pharmacy", tag: "pharmacy", icon: "medication" },
]

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceLocation[]>([])
  const [selectedService, setSelectedService] = useState<ServiceLocation | null>(null)
  const [activeFilter, setActiveFilter] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (activeFilter) params.tag = activeFilter
        if (search) params.search = search
        const data = await getServices(params)
        setServices(data)
        if (data.length > 0 && !selectedService) {
          setSelectedService(data[0])
        }
      } catch {
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeFilter, search])

  const handleGetDirections = (svc: ServiceLocation) => {
    setSelectedService(svc)
    document.getElementById("services-map")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      {/* Search */}
      <section className="mb-8">
        <div className="relative mb-4 w-full md:w-96">
          <span className="material-symbols-outlined absolute top-1/2 left-4 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-low py-3 pr-4 pl-12 text-on-surface transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            placeholder="Search clinics, services..."
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.tag
            return (
              <button
                key={f.tag}
                onClick={() => setActiveFilter(f.tag)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "hover:bg-surface-variant border border-outline-variant/30 bg-surface-container-high text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={
                    isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                >
                  {f.icon}
                </span>
                {f.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Map Placeholder */}
      <section id="services-map" className="relative mb-8 h-64 overflow-hidden rounded-[24px] border border-outline-variant/20 shadow-[0_8px_30px_rgba(59,130,246,0.12)] md:h-80">
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn4iEXwaN2fcAMyoxD7jmyIAdBiHujlws1iwjqL3vfrRLtM251LTQgMQqB295xugyb97YkMBix1I0soxnjCzVFauuEXRat_MpPw0qjEJVjC9NI12KnprQUax5htODoCKskmuyOAkYC3VEMb7oRZIAATljRZaSoLNgKinUIPT6rm6g248_qJH0mOOU8ROMnRM6o2eOEW5tyK_7tAjYg1hSaNCMX1Qwyt3v4olnNFqw3gcg3v9IgQVSUi1homcLN1W55rDdyS_EtXgg"
            alt="Map view"
            className="h-full w-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
          <div className="rounded-xl border border-outline-variant/30 bg-surface/90 px-4 py-2 shadow-sm backdrop-blur-md">
            <p className="mb-1 text-xs font-semibold tracking-wider text-outline uppercase">
              {selectedService ? "Directions to" : "Showing"}
            </p>
            <p className="font-semibold text-on-surface">
              {selectedService ? `${selectedService.name} (${selectedService.distance})` : `${services.length} clinics near you`}
            </p>
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105">
            <span className="material-symbols-outlined fill">my_location</span>
          </button>
        </div>
      </section>

      {/* Clinic Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services?.map((svc, i) => (
            <article
              key={i}
              className="flex h-full flex-col rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)] transition-all hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {svc.verified && (
                      <span className="rounded-md bg-secondary-container/50 px-2 py-0.5 text-[10px] font-semibold text-on-secondary-container uppercase">
                        Verified
                      </span>
                    )}
                    {svc.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-md bg-primary-container/20 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase"
                      >
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h2 className="mb-1 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
                    {svc.name}
                  </h2>
                  <p className="flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    {svc.distance} away • {svc.area}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-container p-2 text-primary">
                  <span className="material-symbols-outlined">
                    local_hospital
                  </span>
                </div>
              </div>
              <div className="mb-6 flex-grow">
                <p className="mb-2 text-xs font-semibold text-outline uppercase">
                  Available Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {svc.services?.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-lg bg-surface-container-low px-3 py-1 text-sm text-on-surface-variant"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 border-t border-outline-variant/20 pt-4">
                <NuruButton 
                  className="flex-1"
                  variant="primary"
                  onClick={() => handleGetDirections(svc)}
                  leftIcon={<span className="material-symbols-outlined text-[20px]">directions</span>}
                >
                  Get Directions
                </NuruButton>
                {svc.phone && (
                  <NuruButton
                    className="flex-1"
                    variant="secondary"
                    onClick={() => window.location.href = `tel:${svc.phone}`}
                    leftIcon={<span className="material-symbols-outlined text-[20px]">call</span>}
                  >
                    Call
                  </NuruButton>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
