import { Outlet } from "react-router-dom"
import { AppHeader, MobileHeader } from "./AppHeader"
import { BottomNavBar } from "./BottomNavBar"
import { AppFooter } from "./AppFooter"

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <AppHeader />
      <MobileHeader />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <AppFooter />
      <BottomNavBar />
    </div>
  )
}
