import { useState } from "react"
import { Outlet } from "react-router-dom"
import { AppHeader, MobileHeader } from "./AppHeader"
import { AppFooter } from "./AppFooter"
import { AppSidebar } from "./AppSidebar"

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Sidebar - self-manages visibility based on route inside, but we provide it here */}
      <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Pass down setIsSidebarOpen so MobileHeader can toggle the sidebar */}
        <AppHeader />
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 pb-10 md:pb-0">
          <Outlet />
        </main>
        
        <AppFooter />
      </div>
    </div>
  )
}
