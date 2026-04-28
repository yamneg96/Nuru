import { useState, useEffect } from "react";
import { getServices } from "@/api/services.api";
import type { ServiceLocation } from "@shared/types";

const FILTERS = [
  { label: "All Nearby", tag: "", icon: "check" },
  { label: "Free Services", tag: "free_options", icon: "volunteer_activism" },
  { label: "Youth-friendly", tag: "youth_friendly", icon: "child_care" },
  { label: "Pharmacy", tag: "pharmacy", icon: "medication" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceLocation[]>([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (activeFilter) params.tag = activeFilter;
        if (search) params.search = search;
        const data = await getServices(params);
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeFilter, search]);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6">
      {/* Search */}
      <section className="mb-8">
        <div className="relative w-full md:w-96 mb-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface outline-none"
            placeholder="Search clinics, services..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.tag;
            return (
              <button
                key={f.tag}
                onClick={() => setActiveFilter(f.tag)}
                className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface border border-outline-variant/30 hover:bg-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>{f.icon}</span>
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="mb-8 rounded-[24px] overflow-hidden relative h-64 md:h-80 shadow-[0_8px_30px_rgba(59,130,246,0.12)] border border-outline-variant/20">
        <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn4iEXwaN2fcAMyoxD7jmyIAdBiHujlws1iwjqL3vfrRLtM251LTQgMQqB295xugyb97YkMBix1I0soxnjCzVFauuEXRat_MpPw0qjEJVjC9NI12KnprQUax5htODoCKskmuyOAkYC3VEMb7oRZIAATljRZaSoLNgKinUIPT6rm6g248_qJH0mOOU8ROMnRM6o2eOEW5tyK_7tAjYg1hSaNCMX1Qwyt3v4olnNFqw3gcg3v9IgQVSUi1homcLN1W55rDdyS_EtXgg"
            alt="Map view"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/30 shadow-sm">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-1">Showing</p>
            <p className="font-semibold text-on-surface">{services.length} clinics near you</p>
          </div>
          <button className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <span className="material-symbols-outlined fill">my_location</span>
          </button>
        </div>
      </section>

      {/* Clinic Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc, i) => (
            <article key={i} className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(59,130,246,0.05)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)] transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {svc.verified && <span className="bg-secondary-container/50 text-on-secondary-container px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase">Verified</span>}
                    {svc.tags?.map((tag) => (
                      <span key={tag} className="bg-primary-container/20 text-primary px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase">
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface mb-1">{svc.name}</h2>
                  <p className="text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {svc.distance} away • {svc.area}
                  </p>
                </div>
                <div className="bg-surface-container p-2 rounded-xl text-primary">
                  <span className="material-symbols-outlined">local_hospital</span>
                </div>
              </div>
              <div className="mb-6 flex-grow">
                <p className="text-xs font-semibold text-outline uppercase mb-2">Available Services</p>
                <div className="flex flex-wrap gap-2">
                  {svc.services?.map((s) => (
                    <span key={s} className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-lg text-sm">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-auto pt-4 border-t border-outline-variant/20">
                <button className="flex-1 bg-primary text-on-primary py-3 rounded-full font-semibold flex justify-center items-center gap-2 hover:bg-surface-tint transition-colors">
                  <span className="material-symbols-outlined text-[20px]">directions</span>Get Directions
                </button>
                {svc.phone && (
                  <a href={`tel:${svc.phone}`} className="flex-1 bg-surface-container-high text-primary py-3 rounded-full font-semibold flex justify-center items-center gap-2 hover:bg-surface-variant transition-colors border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[20px]">call</span>Call
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
