import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import type { ReactNode } from "react"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isOnboarded = useAuthStore((s) => s.isOnboarded)
  if (isAuthenticated && isOnboarded)
    return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
