import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { startFlow, submitStep, getResult, createReferral, getDecisionResources } from "@/api/decision.api"
import { FeedbackModal } from "@/components/shared/FeedbackModal"
import type {
  DecisionQuestion,
  DecisionResult,
  DecisionReferralResult,
  DecisionResourceCategory,
  FlowType,
} from "@/types"

export default function DecisionFlowPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const flowType = (params.get("flow") || "missed_period") as FlowType

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(4)
  const [question, setQuestion] = useState<DecisionQuestion | null>(null)
  const [result, setResult] = useState<DecisionResult | null>(null)
  const [selected, setSelected] = useState<string | string[]>("")
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  // Enhanced DSS state
  const [referralData, setReferralData] = useState<DecisionReferralResult | null>(null)
  const [resourcesData, setResourcesData] = useState<DecisionResourceCategory[] | null>(null)
  const [referralLoading, setReferralLoading] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showReferrals, setShowReferrals] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await startFlow(flowType)
      setSessionId(res.session_id)
      setCurrentStep(res.current_step)
      setTotalSteps(res.total_steps)
      setQuestion(res.question)
      setStarted(true)
    } catch {
      /* fallback */
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!sessionId || !selected) return
    setLoading(true)
    try {
      const res = await submitStep(sessionId, selected)
      setCurrentStep(res.current_step)
      if (res.completed) {
        const resultData = await getResult(sessionId)
        setResult(resultData)
      } else if (res.question) {
        setQuestion(res.question)
        setSelected("")
      }
    } catch {
      /* fallback */
    } finally {
      setLoading(false)
    }
  }

  const handleGetReferrals = async () => {
    setReferralLoading(true)
    setShowReferrals(true)
    try {
      const data = await createReferral(flowType)
      setReferralData(data)
    } catch {
      setReferralData(null)
    } finally {
      setReferralLoading(false)
    }
  }

  const handleGetResources = async () => {
    setShowResources(true)
    try {
      const data = await getDecisionResources(flowType)
      setResourcesData(data)
    } catch {
      setResourcesData(null)
    }
  }

  // Not started yet — show intro
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined fill text-[40px]">
              psychology
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-surface">
            {t("decision.intro_title")}
          </h1>
          <p className="text-lg text-on-surface-variant">
            {t("decision.intro_desc")}
          </p>
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full rounded-full bg-primary py-4 font-semibold text-on-primary shadow-[0_4px_20px_rgba(0,88,190,0.2)] transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? t("decision.starting") : t("decision.begin")}
          </button>
        </div>
      </div>
    )
  }

  // Show result
  if (result) {
    const riskColors: Record<string, string> = {
      low: "text-secondary",
      moderate: "text-tertiary",
      high: "text-error",
    }
    return (
      <div className="min-h-screen bg-background pb-32">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-5 font-['Plus_Jakarta_Sans'] shadow-sm backdrop-blur-md">
          <div className="text-xl font-bold text-blue-600">Nuru</div>
        </header>
        <main className="mx-auto space-y-6 px-5 py-6">
          <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`material-symbols-outlined fill text-[32px] ${riskColors[result.risk_level]}`}
              >
                assessment
              </span>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-on-surface">
                {t("decision.results")}
              </h1>
            </div>
            <p className="mb-4 text-lg text-on-surface-variant">
              {result.summary}
            </p>
            {result.ai_explanation && (
              <div className="mb-4 rounded-xl border border-primary-fixed-dim/30 bg-primary-fixed/30 p-4">
                <p className="text-sm text-on-surface">
                  {result.ai_explanation}
                </p>
              </div>
            )}
            <div className="space-y-2">
              {result.advice.map((a: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3"
                >
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-secondary">
                    check_circle
                  </span>
                  <p className="text-on-surface-variant">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-xs font-semibold tracking-wider text-outline uppercase">
            {t("decision.what_next")}
          </h3>
          <div className="flex flex-col gap-3">
            {result.next_steps?.map((step: { icon: string; action: string; title: string; description: string }, i: number) => (
              <button
                key={i}
                onClick={() => navigate(step.action)}
                className="group flex w-full items-center rounded-xl border border-outline-variant bg-surface-container-low p-4 text-left transition-colors hover:bg-surface-container"
              >
                <div className="bg-surface-variant mr-4 flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors group-hover:bg-primary-fixed group-hover:text-on-primary-fixed">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <div className="flex-grow">
                  <span className="block font-semibold text-on-surface">
                    {step.title}
                  </span>
                  <span className="block text-sm text-on-surface-variant">
                    {step.description}
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline-variant transition-colors group-hover:text-primary">
                  chevron_right
                </span>
              </button>
            ))}

            {/* Get Professional Help */}
            <button
              onClick={handleGetReferrals}
              className="group flex w-full items-center rounded-xl border border-secondary/30 bg-secondary-container/10 p-4 text-left transition-colors hover:bg-secondary-container/20"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div className="flex-grow">
                <span className="block font-semibold text-on-surface">{t("decision.get_help")}</span>
                <span className="block text-sm text-on-surface-variant">{t("decision.matched_professionals")}</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary">chevron_right</span>
            </button>

            {/* Find Resources */}
            <button
              onClick={handleGetResources}
              className="group flex w-full items-center rounded-xl border border-tertiary/30 bg-tertiary-container/10 p-4 text-left transition-colors hover:bg-tertiary-container/20"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
                <span className="material-symbols-outlined">local_library</span>
              </div>
              <div className="flex-grow">
                <span className="block font-semibold text-on-surface">{t("decision.find_resources")}</span>
                <span className="block text-sm text-on-surface-variant">{t("decision.resources_title")}</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-tertiary">chevron_right</span>
            </button>

            {/* Leave Feedback */}
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low p-4 text-center transition-colors hover:bg-surface-container mt-4"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">rate_review</span>
              <span className="font-semibold text-on-surface">{t("decision.leave_feedback")}</span>
            </button>
          </div>

          {/* Referrals Panel */}
          {showReferrals && (
            <div className="rounded-3xl border border-secondary/20 bg-surface-container-lowest p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">group</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-on-surface">{t("decision.matched_professionals")}</h3>
              </div>
              {referralLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
                  <span className="ml-3 text-sm text-on-surface-variant">{t("decision.referral_loading")}</span>
                </div>
              ) : referralData && referralData.professionals.length > 0 ? (
                <div className="space-y-3">
                  {referralData.professionals.map((p) => (
                    <div key={p._id} className="flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                        {p.photo_url ? (
                          <img src={p.photo_url} alt={p.full_name} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined">person</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-on-surface">{p.full_name}</h4>
                        <p className="text-xs text-on-surface-variant">{p.type} • {p.institution || p.city}</p>
                        {p.specializations?.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {p.specializations.slice(0, 3).map((s, i) => (
                              <span key={i} className="rounded-full bg-secondary-container/30 px-2 py-0.5 text-[10px] font-medium text-secondary">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/appointments/book/${p._id}`)}
                        className="shrink-0 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-on-secondary transition-all hover:shadow-md"
                      >
                        {t("decision.book_appointment")}
                      </button>
                    </div>
                  ))}
                  <p className="text-center text-xs text-on-surface-variant">{referralData.message}</p>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-on-surface-variant">{t("decision.no_professionals")}</p>
              )}
            </div>
          )}

          {/* Resources Panel */}
          {showResources && resourcesData && (
            <div className="rounded-3xl border border-tertiary/20 bg-surface-container-lowest p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">local_library</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-on-surface">{t("decision.resources_title")}</h3>
              </div>
              <div className="space-y-5">
                {resourcesData.map((cat) => (
                  <div key={cat.category}>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-outline">{cat.title}</h4>
                    <div className="space-y-2">
                      {cat.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3">
                          <span className="material-symbols-outlined mt-0.5 text-[20px] text-tertiary">
                            {cat.category === "hotlines" ? "call" : cat.category === "clinics" ? "location_on" : "info"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-semibold text-on-surface">{item.name}</h5>
                            <p className="text-xs text-on-surface-variant">{item.description}</p>
                            {item.phone && (
                              <a href={`tel:${item.phone}`} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                                <span className="material-symbols-outlined text-[14px]">call</span> {item.phone}
                              </a>
                            )}
                            {item.website && (
                              <a href={item.website} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span> Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <FeedbackModal 
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)} 
          context="decision" 
        />
      </div>
    )
  }

  // Show question step
  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-5 font-['Plus_Jakarta_Sans'] shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="-ml-2 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="text-xl font-bold text-blue-600">Nuru</div>
        </div>
      </header>
      <main className="mx-auto px-5 pt-6">
        {/* Progress */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-wider text-secondary uppercase">
            {t("decision.step_of", { current: currentStep + 1, total: totalSteps })}
          </span>
          <div className="bg-surface-variant mt-2 h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {question && (
          <section className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-2 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
              {question.text}
            </h2>
            {question.subtitle && (
              <p className="mb-4 text-sm text-on-surface-variant">
                {question.subtitle}
              </p>
            )}
            <div
              className={
                question.type === "multiple_choice"
                  ? "grid grid-cols-2 gap-3"
                  : "flex flex-col gap-3"
              }
            >
              {question.options.map((opt: { value: string; label: string }) => {
                const isSelected =
                  question.type === "multiple_choice"
                    ? Array.isArray(selected) && selected.includes(opt.value)
                    : selected === opt.value
                return (
                  <label
                    key={opt.value}
                    className="group relative cursor-pointer"
                  >
                    <input
                      type={
                        question.type === "multiple_choice"
                          ? "checkbox"
                          : "radio"
                      }
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => {
                        if (question.type === "multiple_choice") {
                          const arr = Array.isArray(selected) ? selected : []
                          setSelected(
                            isSelected
                              ? arr.filter((v) => v !== opt.value)
                              : [...arr, opt.value]
                          )
                        } else {
                          setSelected(opt.value)
                        }
                      }}
                    />
                    <div
                      className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 group-hover:border-primary/50 ${isSelected ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface-container-lowest"}`}
                    >
                      <span className="font-semibold text-on-surface">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </section>
        )}

        <div className="fixed bottom-0 left-0 z-40 w-full bg-gradient-to-t from-background via-background to-transparent p-5">
          <div className="mx-auto">
            <button
              onClick={handleNext}
              disabled={
                !selected ||
                (Array.isArray(selected) && selected.length === 0) ||
                loading
              }
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-on-primary shadow-[0_4px_20px_rgba(59,130,246,0.2)] transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? t("decision.processing") : t("decision.next_step")}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
