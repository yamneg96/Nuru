import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminLogin } from "@/api/admin.api"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await adminLogin(email, password)
      localStorage.setItem("nuru_token", res.token)
      localStorage.setItem("nuru_admin", "true")
      navigate("/admin")
    } catch {
      setError("Incorrect email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface p-5">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(0,88,190,0.15), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(108,248,187,0.1), transparent 50%)" }} />

      {/* Login Card */}
      <main className="relative z-10 flex w-full max-w-[420px] flex-col gap-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_32px_rgba(0,88,190,0.06)] md:p-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-1 text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low shadow-inner">
            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold leading-[38px] tracking-[-0.02em] text-primary">Nuru Admin</h1>
          <p className="text-on-surface-variant">Secure System Access</p>
        </header>

        {/* Warning Banner */}
        <div className="flex items-start gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-high p-4">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-on-surface-variant">security</span>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
            Authorized personnel only. All access attempts are monitored and logged.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="admin-email" className="ml-1 text-xs font-semibold tracking-wider text-on-surface uppercase">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nuru.app"
                  className="h-[52px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="admin-password" className="ml-1 text-xs font-semibold tracking-wider text-on-surface uppercase">Password</label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-error" : "text-outline"}`}>lock</span>
                <input
                  id="admin-password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`h-[52px] w-full rounded-lg border pl-12 pr-12 text-on-surface outline-none transition-all placeholder:text-outline/60 ${error ? "border-error bg-error-container/10 focus:border-error focus:ring-2 focus:ring-error/20" : "border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
                </button>
              </div>
              {error && (
                <p className="ml-1 mt-1 flex items-center gap-1 text-xs font-semibold text-error">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <button type="submit" disabled={loading}
            className="mt-2 flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-on-primary-fixed-variant">
            {loading ? "Signing in..." : "Login as Admin"}
            {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
        </form>

        {/* Return link */}
        <div className="flex justify-center">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-xs font-semibold tracking-wider text-primary transition-colors hover:text-on-primary-fixed-variant hover:underline uppercase">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Return to Public Site
          </button>
        </div>
      </main>
    </div>
  )
}
