import { Link, useLocation } from "react-router-dom"

const NAV_LINKS = [
  { path: "/dashboard", label: "Home" },
  { path: "/explore", label: "Explore" },
  { path: "/chat", label: "Chat" },
  { path: "/services", label: "Services" },
  { path: "/settings", label: "Profile" },
]

export function AppHeader() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 hidden w-full items-center justify-between border-b border-gray-100 bg-white/90 px-8 py-3 font-['Plus_Jakarta_Sans'] antialiased shadow-sm backdrop-blur-md md:flex dark:border-gray-800 dark:bg-gray-900">
      <Link
        to="/dashboard"
        className="text-xl font-bold text-blue-600 dark:text-blue-400"
      >
        <img
          src="./Nuru_Logo.png"
          alt="Nuru Logo"
          className="h-10 w-10 rounded-full"
        />
      </Link>
      <nav className="flex gap-6">
        {NAV_LINKS.map((link) => {
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
        })}
      </nav>
      <Link
        to="/settings"
        className="rounded-full p-2 text-blue-600 transition-colors hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
      >
        <span className="material-symbols-outlined">lock_person</span>
      </Link>
    </header>
  )
}

export function MobileHeader({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-surface/90 px-5 py-3 backdrop-blur-sm md:hidden">
      <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-primary">
        {title || "Nuru"}
      </div>
      <QuickExitButton />
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
