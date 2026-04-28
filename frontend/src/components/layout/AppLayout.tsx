import { Outlet } from "react-router-dom";
import { AppHeader, MobileHeader } from "./AppHeader";
import { BottomNavBar } from "./BottomNavBar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <AppHeader />
      <MobileHeader />
      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  );
}
