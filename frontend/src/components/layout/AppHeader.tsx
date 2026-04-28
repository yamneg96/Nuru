import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { path: "/dashboard", label: "Home" },
  { path: "/explore", label: "Explore" },
  { path: "/chat", label: "Chat" },
  { path: "/services", label: "Services" },
  { path: "/settings", label: "Profile" },
];

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="hidden md:flex bg-white/90 dark:bg-gray-900 backdrop-blur-md font-['Plus_Jakarta_Sans'] antialiased sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm justify-between items-center w-full px-8 py-3">
      <Link to="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Nuru
      </Link>
      <nav className="flex gap-6">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link
        to="/settings"
        className="text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-2 rounded-full"
      >
        <span className="material-symbols-outlined">lock_person</span>
      </Link>
    </header>
  );
}

export function MobileHeader({ title }: { title?: string }) {
  return (
    <header className="md:hidden bg-surface/90 backdrop-blur-sm flex justify-between items-center px-5 py-3 sticky top-0 z-40">
      <div className="font-['Plus_Jakarta_Sans'] text-2xl text-primary font-bold tracking-tight">
        {title || "Nuru"}
      </div>
      <QuickExitButton />
    </header>
  );
}

export function QuickExitButton() {
  const handleQuickExit = () => {
    // Navigate to a safe, innocuous website
    window.location.href = "https://www.google.com";
  };

  return (
    <button
      onClick={handleQuickExit}
      className="text-primary p-2 rounded-full hover:bg-surface-container-high transition-colors"
      aria-label="Quick Exit"
    >
      <span className="material-symbols-outlined">lock_person</span>
    </button>
  );
}
