import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllModules, getAllArticles, getAllVideos, createModule, createArticle, deleteModule, deleteArticle, deleteVideo } from "@/api/admin.api"
import type { Module, Article, Video } from "@/types"

type Tab = "modules" | "articles" | "videos"

export default function AdminContentCMS() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("modules")
  const [modules, setModules] = useState<Module[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const [m, a, v] = await Promise.all([getAllModules(), getAllArticles(), getAllVideos()])
        setModules(m); setArticles(a); setVideos(v)
      } catch { /* */ }
      finally { setLoading(false) }
    })()
  }, [])

  const handleCreateModule = async () => {
    if (!newTitle) return
    try {
      const mod = await createModule({ title: newTitle, description: newDesc, slug: newTitle.toLowerCase().replace(/\s+/g, "-"), icon: "book", color: "primary", order: modules.length + 1, published: false })
      setModules((prev) => [...prev, mod])
      setShowCreate(false); setNewTitle(""); setNewDesc("")
    } catch { /* */ }
  }

  const handleCreateArticle = async () => {
    if (!newTitle || !modules[0]) return
    try {
      const art = await createArticle({ title: newTitle, slug: newTitle.toLowerCase().replace(/\s+/g, "-"), content_markdown: newDesc, summary: newDesc, module_id: modules[0]._id, order: articles.length + 1, published: false })
      setArticles((prev) => [...prev, art])
      setShowCreate(false); setNewTitle(""); setNewDesc("")
    } catch { /* */ }
  }

  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm(`Delete this ${type.slice(0, -1)}?`)) return
    try {
      if (type === "modules") { await deleteModule(id); setModules((p) => p.filter((x) => x._id !== id)) }
      if (type === "articles") { await deleteArticle(id); setArticles((p) => p.filter((x) => x._id !== id)) }
      if (type === "videos") { await deleteVideo(id); setVideos((p) => p.filter((x) => x._id !== id)) }
    } catch { /* */ }
  }

  const TABS: { label: string; value: Tab; count: number }[] = [
    { label: "Modules", value: "modules", count: modules.length },
    { label: "Articles", value: "articles", count: articles.length },
    { label: "Videos", value: "videos", count: videos.length },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-slate-100 bg-white p-6 shadow-sm md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container"><span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span></div>
          <div><h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-black tracking-tight text-blue-600">Nuru</h1><p className="text-sm text-slate-500">Admin Panel</p></div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {[{ l: "Dashboard", i: "home", p: "/admin" }, { l: "Content CMS", i: "menu_book", p: "/admin/content", a: true }, { l: "Professionals", i: "medical_services", p: "/admin/professionals" }, { l: "Events", i: "event", p: "/admin/events" }].map((x) => (
            <button key={x.l} onClick={() => navigate(x.p)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${x.a ? "bg-blue-50/50 font-bold text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"}`}>
              <span className="material-symbols-outlined" style={x.a ? { fontVariationSettings: "'FILL' 1" } : undefined}>{x.i}</span>{x.l}
            </button>
          ))}
        </div>
      </nav>

      <main className="ml-0 flex-1 p-6 md:ml-72">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Content Management</h1>
            <p className="mt-1 text-on-surface-variant">Create, edit, and manage all educational content.</p>
          </div>
          <button onClick={() => { setShowCreate(true); setNewTitle(""); setNewDesc("") }}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all active:scale-95 hover:bg-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-[20px]">add</span> New {tab.slice(0, -1)}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {TABS.map((t) => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${tab === t.value ? "bg-primary text-on-primary shadow-sm" : "border border-outline-variant/30 bg-surface-container-high text-on-surface hover:bg-surface-variant"}`}>
              {t.label} <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <div className="space-y-3">
            {tab === "modules" && modules.map((m) => <ContentRow key={m._id} title={m.title} subtitle={m.description} published={m.published} onDelete={() => handleDelete("modules", m._id)} />)}
            {tab === "articles" && articles.map((a) => <ContentRow key={a._id} title={a.title} subtitle={a.summary} published={a.published} onDelete={() => handleDelete("articles", a._id)} />)}
            {tab === "videos" && videos.map((v) => <ContentRow key={v._id} title={v.title} subtitle={v.description} published={v.published} onDelete={() => handleDelete("videos", v._id)} />)}
            {((tab === "modules" && modules.length === 0) || (tab === "articles" && articles.length === 0) || (tab === "videos" && videos.length === 0)) && (
              <div className="py-16 text-center"><span className="material-symbols-outlined mb-2 text-[48px] text-outline">inventory_2</span><p className="text-on-surface-variant">No {tab} yet. Create your first one!</p></div>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="mx-4 w-full rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
              <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">New {tab.slice(0, -1)}</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Title</label>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary" placeholder="Enter title..." />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-on-surface-variant">Description / Content</label>
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={4} className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary" placeholder="Enter description..." />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-outline-variant py-3 font-semibold text-on-surface">Cancel</button>
                <button onClick={tab === "modules" ? handleCreateModule : handleCreateArticle} className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary">Create</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function ContentRow({ title, subtitle, published, onDelete }: { title: string; subtitle: string; published: boolean; onDelete: () => void }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center">
      <div className="flex-1">
        <h4 className="font-semibold text-on-surface">{title}</h4>
        <p className="mt-1 text-sm text-on-surface-variant">{subtitle?.slice(0, 100)}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${published ? "bg-secondary-container/20 text-secondary" : "bg-surface-variant text-on-surface-variant"}`}>
          {published ? "Published" : "Draft"}
        </span>
        <button onClick={onDelete} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  )
}
