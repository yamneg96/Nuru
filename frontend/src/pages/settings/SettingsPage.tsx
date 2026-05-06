import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { usePreferencesStore } from "@/store/preferencesStore"
import { useAuthStore } from "@/store/authStore"
import { useThemeStore } from "@/store/themeStore"
import { updatePreferences, deleteUserData } from "@/api/user.api"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export default function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language, saveHistory, setLanguage, setSaveHistory } =
    usePreferencesStore()
  const logout = useAuthStore((s) => s.logout)
  const softLogout = useAuthStore((s) => s.softLogout)
  const { theme, setTheme } = useThemeStore()
  const [deleting, setDeleting] = useState(false)

  const handleSoftLogout = () => {
    softLogout()
    toast.success(t('settings.logout_success', "Logged out successfully!"))
    navigate("/")
  }

  const handleLanguageChange = async (
    lang: "english" | "amharic" | "oromo"
  ) => {
    setLanguage(lang)
    try {
      await updatePreferences({ language: lang })
    } catch {
      /* local state is fine */
    }
  }

  const handleHistoryToggle = async () => {
    const newVal = !saveHistory
    setSaveHistory(newVal)
    try {
      await updatePreferences({ save_history: newVal })
    } catch {
      /* local */
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('settings.delete_confirm', "This will permanently delete all your data. Are you sure?")))
      return
    setDeleting(true)
    try {
      await deleteUserData()
      logout()
      toast.success(t('settings.delete_success', "Your data has been permanently deleted."))
      navigate("/")
    } catch {
      /* fallback */
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-8 p-6 md:p-8">
      <div className="pt-2 pb-1">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-9.5 font-bold text-on-surface">
          {t('settings.title', 'Privacy & Settings')}
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {t('settings.subtitle', 'Manage your app preferences and control how your data is handled. We prioritize your anonymity and safety above all else.')}
        </p>
      </div>

      {/* Safe Space Card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,88,190,0.04)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <span className="material-symbols-outlined fill text-[28px]">
              shield_locked
            </span>
          </div>
          <div>
            <h2 className="mb-1 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
              {t('settings.safe_space_title', 'Your Space is Safe')}
            </h2>
            <p className="mb-4 leading-relaxed text-on-surface-variant">
              {t('settings.safe_space_desc', 'Interactions with Nuru are strictly confidential. We do not link your conversations, searches, or clinic visits to your personal identity.')}
            </p>
            <Link
              className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary-container"
              to="/privacy"
            >
              {t('settings.privacy_link', 'Read full Privacy Policy')}
              <span className="material-symbols-outlined text-sm">
                arrow_outward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Controls */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,88,190,0.04)]">
        <h2 className="mb-6 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
          {t('settings.privacy_controls', 'Privacy Controls')}
        </h2>
        <div className="flex flex-col gap-6">
          <div className="mb-4 rounded-lg bg-surface-container-low p-4">
            <p className="font-medium text-on-surface-variant">
              {t('settings.anonymous_notice', 'You are anonymous in this app')}
            </p>
          </div>

          {/* Save History Toggle */}
          <div className="border-surface-variant flex flex-wrap items-center justify-between gap-4 border-b py-1 pb-4">
            <div className="pr-4 md:pr-0">
              <div className="mb-1 font-semibold text-on-surface">
                {t('settings.save_history', 'Save chat history')}
              </div>
              <div className="text-sm text-on-surface-variant">
                {t('settings.save_history_desc', 'Keep a local record of your chats to review later.')}
              </div>
            </div>
            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
              <input
                type="checkbox"
                checked={saveHistory}
                onChange={handleHistoryToggle}
                className="peer sr-only"
              />
              <div className="bg-surface-variant peer h-7 w-14 rounded-full shadow-inner peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-outline-variant after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>

          {/* Dark Theme Toggle */}
          <div className="border-surface-variant flex items-center justify-between border-b py-1 pb-4">
            <div className="pr-4">
              <div className="mb-1 font-semibold text-on-surface">
                {t('settings.dark_theme', 'Dark Theme')}
              </div>
              <div className="text-sm text-on-surface-variant">
                {t('settings.dark_theme_desc', 'Switch between light and dark mode appearance.')}
              </div>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
              className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface outline-none focus:border-primary"
            >
              <option value="system">{t('settings.theme_system', 'System')}</option>
              <option value="light">{t('settings.theme_light', 'Light')}</option>
              <option value="dark">{t('settings.theme_dark', 'Dark')}</option>
            </select>
          </div>

          {/* Delete Data */}
          <div className="flex items-center justify-between pt-1">
            <div className="pr-4">
              <div className="mb-1 font-semibold text-on-surface">
                {t('settings.delete_data', 'Delete my data')}
              </div>
              <div className="text-sm text-on-surface-variant">
                {t('settings.delete_data_desc', 'Instantly wipe all data and return to the welcome screen.')}
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex shrink-0 items-center gap-1 rounded-full bg-error-container px-4 py-2 font-semibold text-on-error-container shadow-sm transition-colors hover:bg-error-container/80 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                delete_sweep
              </span>
              {deleting ? t('settings.deleting_btn', 'Deleting...') : t('settings.delete_btn', 'Delete')}
            </button>
          </div>

          {/* Soft Logout */}
          <div className="flex items-center justify-between pt-1">
            <div className="pr-4">
              <div className="mb-1 font-semibold text-on-surface">
                {t('settings.soft_logout', 'Soft Logout')}
              </div>
              <div className="text-sm text-on-surface-variant">
                {t('settings.soft_logout_desc', 'Sign out of your session without deleting your data.')}
              </div>
            </div>
            <button
              onClick={handleSoftLogout}
              className="flex shrink-0 items-center gap-1 rounded-full border border-outline-variant bg-surface px-4 py-2 font-semibold text-on-surface shadow-sm transition-colors hover:bg-surface-hover"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              {t('settings.logout_btn', 'Logout')}
            </button>
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="mb-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,88,190,0.04)]">
        <h2 className="mb-4 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
          {t('settings.lang_pref', 'Language Preference')}
        </h2>
        <p className="mb-6 text-on-surface-variant">
          {t('settings.lang_pref_desc', 'Choose the language you prefer. Nuru will adapt its responses.')}
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { value: "english" as const, label: "English" },
            { value: "amharic" as const, label: "አማርኛ", sub: "Amharic" },
            { value: "oromo" as const, label: "Afaan Oromoo" },
          ].map((lang) => {
            const isSelected = language === lang.value
            return (
              <label
                key={lang.value}
                className={`relative flex cursor-pointer items-start rounded-lg p-4 transition-all ${isSelected ? "border-2 border-primary bg-primary-fixed/20" : "border border-outline-variant bg-white hover:bg-surface-container-low"}`}
              >
                <div className="flex h-5 items-center">
                  <input
                    type="radio"
                    name="language"
                    value={lang.value}
                    checked={isSelected}
                    onChange={() => handleLanguageChange(lang.value)}
                    className="h-5 w-5 border-outline bg-white text-primary focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="font-semibold text-on-surface">
                    {lang.label}
                  </span>
                  {lang.sub && (
                    <span className="mt-0.5 text-sm text-on-surface-variant">
                      {lang.sub}
                    </span>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </section>
    </div>
  )
}
