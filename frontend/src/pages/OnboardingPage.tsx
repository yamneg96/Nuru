import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferencesStore } from "@/store/preferencesStore";

const LANGUAGES = [
  { value: "english" as const, label: "English" },
  { value: "amharic" as const, label: "Amharic" },
  { value: "oromo" as const, label: "Afaan Oromo" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = usePreferencesStore();
  const [selected, setSelected] = useState(language);

  const handleNext = () => {
    setLanguage(selected);
    navigate("/safely");
  };

  return (
    <div className="bg-gradient-to-b from-surface to-surface-container-low text-on-surface font-sans antialiased min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="flex-1 flex flex-col p-5 relative max-w-md mx-auto w-full">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center mb-6 shadow-sm border border-primary-fixed-dim">
            <span className="material-symbols-outlined text-primary text-[32px] fill">volunteer_activism</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface mb-1">
            Welcome to Nuru
          </h1>
          <p className="text-lg leading-7 text-on-surface-variant">
            Choose your preferred language to get started.
          </p>
        </header>

        {/* Language Selection */}
        <section className="flex flex-col gap-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.value;
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
                  className={`flex items-center justify-between p-6 rounded-[20px] transition-all ${
                    isSelected
                      ? "border-2 border-primary bg-primary-fixed-dim text-on-primary-fixed shadow-[0_4px_16px_rgba(0,88,190,0.08)]"
                      : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98]"
                  }`}
                >
                  <span className="font-semibold">{lang.label}</span>
                  <span
                    className={`material-symbols-outlined fill transition-opacity ${
                      isSelected ? "text-primary opacity-100" : "text-outline-variant opacity-0"
                    }`}
                  >
                    check_circle
                  </span>
                </div>
              </label>
            );
          })}
        </section>

        <div className="flex-1" />

        {/* Footer */}
        <footer className="mt-8 pb-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container shadow-sm border border-surface-container-high mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px] fill">shield_lock</span>
            </div>
            <div className="pt-0.5">
              <h2 className="font-semibold text-on-surface mb-1">Your Privacy</h2>
              <p className="text-on-surface-variant leading-snug">No one will know who you are. You are safe here.</p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-[18px] rounded-full bg-primary text-on-primary font-semibold flex justify-center items-center shadow-[0_4px_20px_rgba(0,88,190,0.2)] active:scale-95 transition-transform"
          >
            Next
          </button>
        </footer>
      </main>
    </div>
  );
}
