import { Link, useLocation } from "react-router-dom"
import { useThemeStore } from "@/store/themeStore"
import { useTranslation } from "react-i18next"
import { usePreferencesStore } from "@/store/preferencesStore";

export function AppHeader() {
  const location = useLocation()
  const { theme, setTheme } = useThemeStore()
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = usePreferencesStore()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const isLanding = location.pathname === "/"

  const handleLanguageChange = () => {
    const nextLang =
      language === "english"
        ? "amharic"
        : language === "amharic"
        ? "oromo"
        : "english"
    setLanguage(nextLang)
    i18n.changeLanguage(
      nextLang === "english" ? "en" : nextLang === "amharic" ? "am" : "om"
    )
  }

  return (
    <header className="sticky top-0 z-50 hidden w-full items-center justify-between border-b border-gray-100 bg-white/90 px-8 py-3 font-['Plus_Jakarta_Sans'] antialiased shadow-sm backdrop-blur-md md:flex dark:border-gray-800 dark:bg-gray-900">
      <Link
        to={isLanding ? "/" : "/dashboard"}
        className="flex items-center text-xl font-bold text-blue-600 dark:text-blue-400 gap-2"
      >
        <img
          src="/Nuru_Logo.png"
          alt="Nuru Logo"
          className="h-10 w-10 rounded-full"
        />
        <span>{t("nuru")}</span>
      </Link>
      <nav className="flex gap-6">
        {isLanding && (
          <>
            <a className="rounded-lg px-3 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800" href="#how-it-works">
              {t("landing.how_it_works", "How it works")}
            </a>
            <a className="rounded-lg px-3 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800" href="#features">
              {t("landing.features_title", "Features")}
            </a>
            <a className="rounded-lg px-3 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800" href="#trust">
              {t("common.about_us", "About us")}
            </a>
          </>
        )}
      </nav>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLanguageChange}
          className="flex items-center gap-1 rounded-full p-2 text-blue-600 transition-colors hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
          aria-label="Toggle Language"
        >
          <span className="material-symbols-outlined">translate</span>
          <span className="text-xs uppercase font-bold tracking-wider">
            {language.substring(0, 2)}
          </span>
        </button>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-full p-2 text-blue-600 transition-colors hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
          aria-label="Toggle Theme"
        >
          <span className="material-symbols-outlined">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
        {isLanding ? (
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2 font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">
              lock_person
            </span>
            Login
          </Link>
        ) : (
          <Link
            to="/settings"
            className="rounded-full p-2 text-blue-600 transition-colors hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">lock_person</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export function MobileHeader({ title, onMenuClick }: { title?: string; onMenuClick?: () => void }) {
  const location = useLocation()
  const { theme, setTheme } = useThemeStore()
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = usePreferencesStore()
  
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const isLanding = location.pathname === "/"

  const handleLanguageChange = () => {
    const nextLang =
      language === "english"
        ? "amharic"
        : language === "amharic"
        ? "oromo"
        : "english"
    setLanguage(nextLang)
    i18n.changeLanguage(
      nextLang === "english" ? "en" : nextLang === "amharic" ? "am" : "om"
    )
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-surface/90 px-5 py-3 backdrop-blur-sm md:hidden dark:bg-gray-900/90">
      <div className="flex items-center gap-3">
        {!isLanding && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high dark:text-blue-400 dark:hover:bg-gray-800"
            aria-label="Open Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-primary">
          {title || t("nuru")}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLanguageChange}
          className="flex items-center gap-1 rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high dark:text-blue-400 dark:hover:bg-gray-800"
          aria-label="Toggle Language"
        >
          <span className="material-symbols-outlined text-sm">translate</span>
          <span className="text-[10px] uppercase font-bold">
            {language.substring(0, 2)}
          </span>
        </button>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high dark:text-blue-400 dark:hover:bg-gray-800"
          aria-label="Toggle Theme"
        >
          <span className="material-symbols-outlined">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
        {isLanding ? (
          <Link
            to="/login"
            className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">login</span>
          </Link>
        ) : (
          <Link
            to="/settings"
            className="rounded-full p-2 text-blue-600 transition-colors hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">lock_person</span>
          </Link>
        )}
      </div>
    </header>
  )
}
