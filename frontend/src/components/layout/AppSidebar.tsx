import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

const NAV_ITEMS = [
  { path: "/dashboard", labelKey: "home", icon: "home" },
  { path: "/explore", labelKey: "explore", icon: "explore" },
  { path: "/chat", labelKey: "chat", icon: "chat" },
  { path: "/services", labelKey: "services", icon: "medical_services" },
  { path: "/settings", labelKey: "profile", icon: "person" },
]

interface AppSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function AppSidebar({ isOpen, setIsOpen }: AppSidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()

  // Hide sidebar entirely on landing page if desired, or keep it.
  // We'll hide it on the landing page just like BottomNavBar did.
  if (location.pathname === "/") {
    return null
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 dark:border-gray-800 dark:bg-gray-900 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/Nuru_Logo.png"
              alt="Nuru Logo"
              className="h-8 w-8 rounded-full"
            />
            <span>{t("nuru")}</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col gap-2 px-4">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{t(`nav.${item.labelKey}`, item.labelKey.charAt(0).toUpperCase() + item.labelKey.slice(1))}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Optional footer area in sidebar */}
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Nuru
          </div>
        </div>
      </aside>
    </>
  )
}
