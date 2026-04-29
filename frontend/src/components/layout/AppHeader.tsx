import { Link, useLocation } from "react-router-dom"
import { useThemeStore } from "@/store/themeStore"

const NAV_LINKS = [
  { path: "/dashboard", label: "Home" },
  { path: "/explore", label: "Explore" },
  { path: "/chat", label: "Chat" },
  { path: "/services", label: "Services" },
  { path: "/settings", label: "Profile" },
]

export function AppHeader() {
  const location = useLocation()
  const { theme, setTheme } = useThemeStore()
  
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const isLanding = location.pathname === "/"

  return (
    <header className="sticky top-0 z-50 hidden w-full items-center justify-between border-b border-gray-100 bg-white/90 px-8 py-3 font-['Plus_Jakarta_Sans'] antialiased shadow-sm backdrop-blur-md md:flex dark:border-gray-800 dark:bg-gray-900">
      <Link
        to={isLanding ? "/" : "/dashboard"}
        className="text-xl font-bold text-blue-600 dark:text-blue-400"
      >
        <img
          src="/Nuru_Logo.png"
          alt="Nuru Logo"
          className="h-10 w-10 rounded-full"
        />
      </Link>
      <nav className="flex gap-6">
        {isLanding ? (
          <>
            <a className="rounded-lg px-3 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800" href="#how-it-works">
              How it works
            </a>
            <a className="rounded-lg px-3 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800" href="#features">
              Features
            </a>
            <a className="rounded-lg px-3 py-2 font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800" href="#trust">
              About us
            </a>
          </>
        ) : (
          NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "font-semibold text-blue-700 dark:text-blue-300"
                    : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            )
          })
        )}
      </nav>
      <div className="flex items-center gap-2">
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

export function MobileHeader({ title }: { title?: string }) {
  const location = useLocation()
  const { theme, setTheme } = useThemeStore()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const isLanding = location.pathname === "/"

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-surface/90 px-5 py-3 backdrop-blur-sm md:hidden dark:bg-gray-900/90">
      <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-primary">
        {title || "Nuru"}
      </div>
      <div className="flex items-center gap-2">
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
          <QuickExitButton />
        )}
      </div>
    </header>
  )
}

export function QuickExitButton() {
  const handleQuickExit = () => {
    // Navigate to a safe, innocuous website
    window.location.href = "https://www.google.com"
  }

  return (
    <button
      onClick={handleQuickExit}
      className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high"
      aria-label="Quick Exit"
    >
      <span className="material-symbols-outlined">lock_person</span>
    </button>
  )
}
