import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function SafelyPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const anonymousId = useAuthStore((s) => s.anonymousId)
  const setOnboarded = useAuthStore((s) => s.setOnboarded)
  const [copied, setCopied] = useState(false)

  // Generate a short display ID from the anonymous_id
  const displayId = anonymousId
    ? `${t('safely.user_prefix', 'User #')}${anonymousId.slice(0, 4).toUpperCase()}`
    : t('safely.user_anon', 'User #ANON')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleStart = () => {
    setOnboarded(true)
    toast.success(t('safely.welcome_toast', "Welcome! Your journey starts here."))
    navigate("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-surface to-surface-container-low p-6 antialiased">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all hover:bg-surface-container-highest hover:text-on-surface active:scale-95 shadow-sm"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <main className="w-full max-w-120">
        <div className="border-surface-variant/50 flex flex-col items-center rounded-3xl border bg-surface-container-lowest p-8 text-center shadow-[0_8px_40px_rgba(0,88,190,0.06)] md:p-10">
          {/* Icon */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm shadow-primary/10">
            <span className="material-symbols-outlined fill text-[48px]">
              shield_person
            </span>
          </div>

          {/* Text */}
          <h1 className="mb-3 font-['Plus_Jakarta_Sans'] text-[30px] leading-9.5 font-bold text-on-surface">
            {t('safely.title', "You're In — Safely")}
          </h1>
          <p className="mb-8 px-4 text-lg leading-7 text-on-surface-variant">
            {t('safely.subtitle', "You're now anonymous. No one knows who you are.")}
          </p>

          {/* Anonymous ID Badge */}
          <div className="mb-8 flex w-full items-center justify-between rounded-xl border border-surface-container-highest bg-surface-container p-5">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-xs font-semibold tracking-wider text-outline uppercase">
                {t('safely.your_id', 'Your Anonymous ID')}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold tracking-wide text-on-surface">
                {displayId}
              </span>
            </div>
            <button
              onClick={handleCopy}
              aria-label="Copy ID"
              className="hover:bg-surface-variant group flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary transition-colors"
            >
              <span className="material-symbols-outlined transition-transform group-active:scale-90">
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="w-full rounded-full bg-primary px-8 py-4 font-semibold text-on-primary shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-on-primary-fixed-variant active:scale-[0.98]"
          >
            {t('safely.start_exploring', 'Start exploring')}
          </button>
        </div>
      </main>
    </div>
  )
}
