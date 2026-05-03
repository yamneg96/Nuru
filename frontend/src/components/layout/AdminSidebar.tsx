import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

const NAV_ITEMS = [
  { label: "Dashboard", icon: "home", path: "/admin" },
  { label: "Content CMS", icon: "menu_book", path: "/admin/content" },
  { label: "Professionals", icon: "medical_services", path: "/admin/professionals" },
  { label: "Events", icon: "event", path: "/admin/events" },
  { label: "Reports", icon: "analytics", path: "/admin/reports" },
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("nuru_token")
    localStorage.removeItem("nuru_admin")
    navigate("/admin/login")
  }

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md md:hidden"
      >
        <span className="material-symbols-outlined text-slate-600">menu</span>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <nav
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-100 bg-white p-6 shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container">
              <span
                className="material-symbols-outlined text-on-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-black tracking-tight text-blue-600">Nuru</h1>
              <p className="text-sm text-slate-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 md:hidden"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path)
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path)
                  setIsMobileMenuOpen(false)
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50/50 font-bold text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-error"
        >
          <span className="material-symbols-outlined">logout</span> Sign Out
        </button>
      </nav>
    </>
  )
}
