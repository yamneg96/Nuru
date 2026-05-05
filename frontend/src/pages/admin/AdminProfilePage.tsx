import { useState, useEffect } from "react"
import { getAdminProfile, updateAdminProfile } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type { UserProfile } from "@/types"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [form, setForm] = useState({ name: "", password: "", confirmPassword: "" })

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAdminProfile()
        setProfile(data)
        setForm({ name: data.name || "", password: "", confirmPassword: "" })
      } catch {
        setMessage({ type: "error", text: "Failed to load profile." })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    
    if (form.password && form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      return
    }

    setSaving(true)
    try {
      const payload: any = {}
      if (form.name && form.name !== profile?.name) payload.name = form.name
      if (form.password) payload.password = form.password

      if (Object.keys(payload).length === 0) {
        setMessage({ type: "info", text: "No changes to save." })
        setSaving(false)
        return
      }

      const updated = await updateAdminProfile(payload)
      setProfile(updated)
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }))
      setMessage({ type: "success", text: "Profile updated successfully." })
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error?.message || "Failed to update profile." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar active="Profile" />

      <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-72">
        <div className="mb-6">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">My Profile</h1>
          <p className="mt-1 text-on-surface-variant">Manage your account settings and credentials.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : profile ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8">
            <div className="mb-8 flex items-center gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-inner">
                <span className="material-symbols-outlined text-[40px]">person</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface">{profile.name}</h2>
                <p className="text-on-surface-variant">{profile.email}</p>
                <div className="mt-2 inline-block rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                  {profile.role?.replace("_", " ")}
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 rounded-xl p-4 ${
                message.type === "error" ? "bg-error-container text-on-error-container" :
                message.type === "success" ? "bg-primary-container/20 text-primary" :
                "bg-surface-variant text-on-surface-variant"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Full Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Your Name" 
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/30">
                <h3 className="mb-4 text-lg font-semibold text-on-surface">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">New Password</label>
                    <input 
                      type="password" 
                      value={form.password} 
                      onChange={(e) => setForm({ ...form, password: e.target.value })} 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="Leave blank to keep current password" 
                    />
                  </div>
                  {form.password && (
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={form.confirmPassword} 
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                        className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                        placeholder="Confirm password" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center justify-center w-full sm:w-auto gap-2 rounded-full bg-primary px-8 py-3.5 font-bold text-on-primary shadow-sm transition-all active:scale-95 hover:bg-on-primary-fixed-variant disabled:opacity-70"
                >
                  {saving ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">save</span>
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  )
}
