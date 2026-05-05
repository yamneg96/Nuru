import { useNavigate } from "react-router-dom"

interface AdminSidebarProps {
  active: string
}

export function AdminSidebar({ active }: AdminSidebarProps) {
  const navigate = useNavigate()

  const items = [
    { label: "Dashboard", icon: "home", path: "/admin" },
    { label: "Content CMS", icon: "menu_book", path: "/admin/content" },
    { label: "Professionals", icon: "medical_services", path: "/admin/professionals" },
    { label: "Appointments", icon: "event_note", path: "/admin/appointments" },
    { label: "Events", icon: "event", path: "/admin/events" },
    { label: "Reports", icon: "analytics", path: "/admin/reports" },
    { label: "Support Tickets", icon: "support_agent", path: "/admin/support" },
    { label: "Admins", icon: "manage_accounts", path: "/admin/users" },
    { label: "Profile", icon: "person", path: "/admin/profile" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("nuru_token")
    localStorage.removeItem("nuru_admin")
    navigate("/admin/login")
  }

  return (
    <nav className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-slate-100 bg-white p-6 shadow-sm md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container">
          <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            admin_panel_settings
          </span>
        </div>
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-black tracking-tight text-blue-600">Nuru</h1>
          <p className="text-sm text-slate-500">Admin Panel</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50/50 font-bold text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
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
  )
}
