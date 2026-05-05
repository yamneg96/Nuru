import { useState, useEffect } from "react"
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, verifyAdmin } from "@/api/admin.api"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type { UserProfile } from "@/types"

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<UserProfile | null>(null)

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" as "admin" | "super_admin" })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const auth = await verifyAdmin()
        if (auth.role !== "super_admin") {
          setError("Only Super Admins can access this page.")
          return
        }
        setAdmins(await getAdminUsers())
      } catch {
        setError("Failed to load administrators. You may not have permission.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleCreate = async () => {
    if (!form.email || !form.name || !form.password) return
    try {
      const newAdmin = await createAdminUser(form)
      setAdmins((prev) => [newAdmin, ...prev])
      setShowCreate(false)
      setForm({ name: "", email: "", password: "", role: "admin" })
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to create admin")
    }
  }

  const handleUpdate = async () => {
    if (!showEdit) return
    try {
      const payload: any = {}
      if (form.name && form.name !== showEdit.name) payload.name = form.name
      if (form.password) payload.password = form.password
      if (form.role && form.role !== showEdit.role) payload.role = form.role

      const updated = await updateAdminUser(showEdit._id || (showEdit as any).id, payload)
      setAdmins((prev) => prev.map((a) => (a._id || (a as any).id) === (updated._id || (updated as any).id) ? updated : a))
      setShowEdit(null)
      setForm({ name: "", email: "", password: "", role: "admin" })
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to update admin")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin account?")) return
    try {
      await deleteAdminUser(id)
      setAdmins((prev) => prev.filter((a) => (a._id || (a as any).id) !== id))
    } catch (err: any) {
      alert("Failed to delete admin")
    }
  }

  const openCreate = () => {
    setForm({ name: "", email: "", password: "", role: "admin" })
    setShowCreate(true)
  }

  const openEdit = (admin: UserProfile) => {
    setForm({ name: admin.name || "", email: admin.email || "", password: "", role: (admin.role as "admin" | "super_admin") || "admin" })
    setShowEdit(admin)
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar active="Admins" />

      <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-72">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Administrators</h1>
            <p className="mt-1 text-on-surface-variant">Manage platform administrators and their roles.</p>
          </div>
          {!error && (
            <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all active:scale-95 hover:bg-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">add</span> New Admin
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-error">gpp_bad</span>
            <h3 className="text-lg font-semibold text-error">{error}</h3>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-outline">group</span>
            <h3 className="text-lg font-semibold text-on-surface">No administrators found</h3>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {admins.map((admin) => (
              <div key={admin._id || (admin as any).id} className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined text-[24px]">
                      {admin.role === "super_admin" ? "local_police" : "shield_person"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface">{admin.name}</h3>
                    <p className="text-sm text-on-surface-variant">{admin.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${admin.role === "super_admin" ? "bg-error-container/20 text-error" : "bg-secondary-container/20 text-secondary"}`}>
                    {admin.role?.replace("_", " ")}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(admin)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-variant text-on-surface-variant hover:bg-primary-container hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(admin._id || (admin as any).id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-variant text-on-surface-variant hover:bg-error-container hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create/Edit */}
        {(showCreate || showEdit) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="mx-4 w-full rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
              <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">
                {showCreate ? "Create Admin" : "Edit Admin"}
              </h3>
              <div className="space-y-4">
                {showCreate && (
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" placeholder="admin@example.com" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" placeholder="Full Name" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Password {showEdit && "(leave blank to keep current)"}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary" placeholder="••••••••" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "super_admin" })} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { setShowCreate(false); setShowEdit(null) }} className="flex-1 rounded-full border border-outline-variant py-3 font-semibold text-on-surface">Cancel</button>
                <button onClick={showCreate ? handleCreate : handleUpdate} className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary">
                  {showCreate ? "Create" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
