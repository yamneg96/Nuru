import { Link, useLocation } from "react-router-dom"

const NAV_ITEMS = [
  { path: "/dashboard", label: "Home", icon: "home" },
  { path: "/explore", label: "Explore", icon: "explore" },
  { path: "/chat", label: "Chat", icon: "chat" },
  { path: "/services", label: "Services", icon: "medical_services" },
  { path: "/settings", label: "Profile", icon: "person" },
]

export function BottomNavBar() {
  const location = useLocation()
  
  if (location.pathname === "/") {
    return null
  }

  return (
    <nav className="pb-safe fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[24px] border-t border-gray-100 bg-white px-4 pt-2 shadow-[0_-4px_20px_rgba(59,130,246,0.08)] md:hidden dark:border-gray-800 dark:bg-gray-900">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-200 ${
              isActive
                ? "scale-95 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                : "text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-medium">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
