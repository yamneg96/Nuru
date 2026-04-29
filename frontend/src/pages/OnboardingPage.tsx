import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePreferencesStore } from "@/store/preferencesStore"

const LANGUAGES = [
  { value: "english" as const, label: "English" },
  { value: "amharic" as const, label: "Amharic" },
  { value: "oromo" as const, label: "Afaan Oromo" },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { language, setLanguage } = usePreferencesStore()
  const [selected, setSelected] = useState(language)

  const handleNext = () => {
    setLanguage(selected)
    navigate("/safely")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-surface to-surface-container-low font-sans text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col p-5">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-fixed-dim bg-primary-fixed shadow-sm">
            <span className="material-symbols-outlined fill text-[32px] text-primary">
              volunteer_activism
            </span>
          </div>
          <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface">
            Welcome to Nuru
          </h1>
          <p className="text-lg leading-7 text-on-surface-variant">
            Choose your preferred language to get started.
          </p>
        </header>

        {/* Language Selection */}
        <section className="flex flex-col gap-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.value
            return (
              <label key={lang.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value={lang.value}
                  checked={isSelected}
                  onChange={() => setSelected(lang.value)}
                  className="peer sr-only"
                />
                <div
                  className={`flex items-center justify-between rounded-[20px] p-6 transition-all ${
                    isSelected
                      ? "border-2 border-primary bg-primary-fixed-dim text-on-primary-fixed shadow-[0_4px_16px_rgba(0,88,190,0.08)]"
                      : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98]"
                  }`}
                >
                  <span className="font-semibold">{lang.label}</span>
                  <span
                    className={`material-symbols-outlined fill transition-opacity ${
                      isSelected
                        ? "text-primary opacity-100"
                        : "text-outline-variant opacity-0"
                    }`}
                  >
                    check_circle
                  </span>
                </div>
              </label>
            )
          })}
        </section>

        <div className="flex-1" />

        {/* Footer */}
        <footer className="mt-8 pb-4">
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-surface-container-high bg-surface-container p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container">
              <span className="material-symbols-outlined fill text-[20px] text-on-secondary-container">
                shield_lock
              </span>
            </div>
            <div className="pt-0.5">
              <h2 className="mb-1 font-semibold text-on-surface">
                Your Privacy
              </h2>
              <p className="leading-snug text-on-surface-variant">
                No one will know who you are. You are safe here.
              </p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="flex w-full items-center justify-center rounded-full bg-primary py-[18px] font-semibold text-on-primary shadow-[0_4px_20px_rgba(0,88,190,0.2)] transition-transform active:scale-95"
          >
            Next
          </button>
        </footer>
      </main>
    </div>
  )
}
