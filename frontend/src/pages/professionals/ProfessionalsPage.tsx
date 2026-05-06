import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProfessionals } from "@/api/professional.api"
import type { Professional } from "@/types"
import { useTranslation } from "react-i18next"

export default function ProfessionalsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [typeFilter, setTypeFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")

  const TYPE_FILTERS = [
    { label: t('professionals.all_types', 'All Types'), value: "" },
    { label: t('professionals.medical', 'Medical Doctor'), value: "medical" },
    { label: t('professionals.counselor', 'Counselor'), value: "counselor" },
    { label: t('professionals.therapist', 'Therapist'), value: "therapist" },
    { label: t('professionals.psychiatrist', 'Psychiatrist'), value: "psychiatrist" },
  ]

  const CITY_FILTERS = [
    { label: t('professionals.all_locations', 'All Locations'), value: "" },
    { label: "Addis Ababa", value: "Addis Ababa" },
    { label: "Dire Dawa", value: "Dire Dawa" },
    { label: "Bahir Dar", value: "Bahir Dar" },
    { label: "Hawassa", value: "Hawassa" },
  ]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-tertiary-fixed-dim">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined text-[18px]"
          style={
            star <= Math.floor(rating)
              ? { fontVariationSettings: "'FILL' 1" }
              : star - 0.5 <= rating
                ? {}
                : { opacity: 0.3 }
          }
        >
          {star <= Math.floor(rating)
            ? "star"
            : star - 0.5 <= rating
              ? "star_half"
              : "star"}
        </span>
      ))}
    </div>
  )
}



  const filters: Record<string, string> = {}
  if (typeFilter) filters.type = typeFilter
  if (cityFilter) filters.city = cityFilter

  const { data: professionals = [], isLoading: loading } = useQuery<Professional[]>({
    queryKey: ["professionals", typeFilter, cityFilter],
    queryFn: () => getProfessionals(filters),
  })

  const clearFilters = () => {
    setTypeFilter("")
    setCityFilter("")
  }

  return (
    <div className="mx-auto w-full max-w-350 px-5 py-8 md:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-9.5 tracking-[-0.02em] text-on-background">
          {t('professionals.title', 'Find a Professional')}
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-on-surface-variant">
          {t('professionals.subtitle', 'Connect with trusted healthcare providers, counselors, and specialists in your area. Safe, confidential, and supportive.')}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col items-start gap-4 rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">
            filter_list
          </span>
          <span className="text-base font-semibold">{t('professionals.filters', 'Filters:')}</span>
        </div>
        <div className="flex w-full flex-wrap gap-3">
          {/* Type Filter */}
          <div className="relative min-w-37.5 flex-1">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-surface-variant bg-surface-container-low py-2 pl-4 pr-10 text-on-surface transition-shadow outline-none focus:border-transparent focus:ring-2 focus:ring-primary-container"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              expand_more
            </span>
          </div>
          {/* City Filter */}
          <div className="relative min-w-37.5 flex-1">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-surface-variant bg-surface-container-low py-2 pl-4 pr-10 text-on-surface transition-shadow outline-none focus:border-transparent focus:ring-2 focus:ring-primary-container"
            >
              {CITY_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              expand_more
            </span>
          </div>
        </div>
        <button
          onClick={clearFilters}
          className="whitespace-nowrap rounded-lg bg-surface-variant px-6 py-2 text-base font-semibold text-on-surface-variant transition-colors hover:bg-surface-dim"
        >
          {t('professionals.clear_all', 'Clear All')}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : professionals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-outline">
            person_search
          </span>
          <h3 className="mb-2 text-lg font-semibold text-on-surface">
            {t('professionals.no_found', 'No professionals found')}
          </h3>
          <p className="max-w-xs text-sm text-on-surface-variant">
            {t('professionals.no_found_desc', 'Try adjusting your filters or search in a different location.')}
          </p>
        </div>
      ) : (
        /* Professionals Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {professionals.map((pro) => (
            <div
              key={pro._id}
              className="group flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-[0_4px_20px_rgba(59,130,246,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]"
            >
              <div className="flex flex-1 flex-col p-6">
                {/* Avatar + Info */}
                <div className="mb-4 flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-surface-variant bg-surface-container-low">
                    {pro.photo_url ? (
                      <img
                        src={pro.photo_url}
                        alt={pro.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-container text-on-primary-container">
                        <span className="material-symbols-outlined text-[28px]">
                          person
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-1 font-['Plus_Jakarta_Sans'] text-[24px] font-semibold leading-8 text-on-surface">
                      {pro.full_name}
                    </h3>
                    <p className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[16px]">
                        medical_services
                      </span>
                      {pro.type.charAt(0).toUpperCase() + pro.type.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center gap-1">
                  <StarRating rating={pro.rating} />
                  <span className="ml-2 mt-0.5 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                    {pro.rating.toFixed(1)} ({pro.rating_count} {t('professionals.reviews', 'reviews')})
                  </span>
                </div>

                {/* Bio */}
                <p className="mb-6 flex-1 text-on-surface-variant">
                  {pro.bio?.slice(0, 150)}
                  {pro.bio && pro.bio.length > 150 ? "..." : ""}
                </p>

                {/* Location */}
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-surface-container-low p-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    location_on
                  </span>
                  <span>
                    {pro.institution}, {pro.city}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="border-t border-surface-container-high bg-surface-container-lowest p-4">
                <button
                  onClick={() => navigate(`/professionals/${pro._id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-base font-semibold text-on-primary transition-colors active:scale-[0.98] hover:bg-on-primary-fixed-variant"
                >
                  <span>{t('professionals.book_session', 'Book Session')}</span>
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_month
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
