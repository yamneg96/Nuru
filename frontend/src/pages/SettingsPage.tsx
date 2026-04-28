import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useAuthStore } from "@/store/authStore";
import { updatePreferences, deleteUserData } from "@/api/user.api";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { language, saveHistory, setLanguage, setSaveHistory } = usePreferencesStore();
  const logout = useAuthStore((s) => s.logout);
  const [deleting, setDeleting] = useState(false);

  const handleLanguageChange = async (lang: "english" | "amharic" | "oromo") => {
    setLanguage(lang);
    try { await updatePreferences({ language: lang }); } catch { /* local state is fine */ }
  };

  const handleHistoryToggle = async () => {
    const newVal = !saveHistory;
    setSaveHistory(newVal);
    try { await updatePreferences({ save_history: newVal }); } catch { /* local */ }
  };

  const handleDelete = async () => {
    if (!confirm("This will permanently delete all your data. Are you sure?")) return;
    setDeleting(true);
    try {
      await deleteUserData();
      logout();
      navigate("/");
    } catch { /* fallback */ }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
      <div className="pt-2 pb-1">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface">Privacy &amp; Settings</h1>
        <p className="text-on-surface-variant mt-2 max-w-xl">
          Manage your app preferences and control how your data is handled. We prioritize your anonymity and safety above all else.
        </p>
      </div>

      {/* Safe Space Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_8px_30px_rgb(0,88,190,0.04)]">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
            <span className="material-symbols-outlined text-[28px] fill">shield_locked</span>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface mb-1">Your Space is Safe</h2>
            <p className="text-on-surface-variant mb-4 leading-relaxed">
              Interactions with Nuru are strictly confidential. We do not link your conversations, searches, or clinic visits to your personal identity.
            </p>
            <a className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-container transition-colors" href="#">
              Read full Privacy Policy
              <span className="material-symbols-outlined text-sm">arrow_outward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Privacy Controls */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_8px_30px_rgb(0,88,190,0.04)]">
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface mb-6">Privacy Controls</h2>
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-low rounded-lg p-4 mb-4">
            <p className="font-medium text-on-surface-variant">You are anonymous in this app</p>
          </div>

          {/* Save History Toggle */}
          <div className="flex items-center justify-between py-1 border-b border-surface-variant pb-4">
            <div className="pr-4">
              <div className="font-semibold text-on-surface mb-1">Save chat history</div>
              <div className="text-on-surface-variant text-sm">Keep a local record of your chats to review later.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" checked={saveHistory} onChange={handleHistoryToggle} className="sr-only peer" />
              <div className="w-14 h-7 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner" />
            </label>
          </div>

          {/* Delete Data */}
          <div className="flex items-center justify-between pt-1">
            <div className="pr-4">
              <div className="font-semibold text-on-surface mb-1">Delete my data</div>
              <div className="text-on-surface-variant text-sm">Instantly wipe all data and return to the welcome screen.</div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-shrink-0 bg-error-container hover:bg-error-container/80 text-on-error-container font-semibold rounded-full px-4 py-2 flex items-center gap-1 transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_8px_30px_rgb(0,88,190,0.04)] mb-8">
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface mb-4">Language Preference</h2>
        <p className="text-on-surface-variant mb-6">Choose the language you prefer. Nuru will adapt its responses.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: "english" as const, label: "English" },
            { value: "amharic" as const, label: "አማርኛ", sub: "Amharic" },
            { value: "oromo" as const, label: "Afaan Oromoo" },
          ].map((lang) => {
            const isSelected = language === lang.value;
            return (
              <label key={lang.value} className={`relative flex items-start p-4 cursor-pointer rounded-lg transition-all ${isSelected ? "border-2 border-primary bg-primary-fixed/20" : "border border-outline-variant bg-white hover:bg-surface-container-low"}`}>
                <div className="flex items-center h-5">
                  <input type="radio" name="language" value={lang.value} checked={isSelected} onChange={() => handleLanguageChange(lang.value)} className="w-5 h-5 text-primary bg-white border-outline focus:ring-primary focus:ring-2" />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="font-semibold text-on-surface">{lang.label}</span>
                  {lang.sub && <span className="text-on-surface-variant text-sm mt-0.5">{lang.sub}</span>}
                </div>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
