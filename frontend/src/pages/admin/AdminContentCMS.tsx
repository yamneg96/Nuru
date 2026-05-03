import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { 
  getAllModules, createModule, updateModule, deleteModule,
  getAllArticles, createArticle, updateArticle, deleteArticle,
  getAllVideos, createVideo, updateVideo, deleteVideo,
  getAllQuizzes, createQuiz, updateQuiz, deleteQuiz
} from "@/api/admin.api"
import type { Module, Article, Video, Quiz } from "@/types"

type Tab = "modules" | "articles" | "videos" | "quizzes"

export default function AdminContentCMS() {
  const [activeTab, setActiveTab] = useState<Tab>("modules")
  
  const [modules, setModules] = useState<Module[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  const [loading, setLoading] = useState(true)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form States
  const [moduleForm, setModuleForm] = useState<Partial<Module>>({ title: "", description: "", icon: "article", color: "primary", order: 0, published: false })
  const [articleForm, setArticleForm] = useState<Partial<Article>>({ module_id: "", title: "", summary: "", content_markdown: "", badge: "", image_url: "", video_id: "", order: 0, published: false })
  const [videoForm, setVideoForm] = useState<Partial<Video>>({ module_id: "", title: "", description: "", source_type: "youtube", source_url: "", thumbnail_url: "", duration: "", order: 0, published: false })
  const [quizForm, setQuizForm] = useState<Partial<Quiz>>({ module_id: "", title: "", description: "", questions: [], published: false })

  const loadData = async () => {
    setLoading(true)
    try {
      const [mods, arts, vids, qs] = await Promise.all([
        getAllModules(), getAllArticles(), getAllVideos(), getAllQuizzes()
      ])
      setModules(mods)
      setArticles(arts)
      setVideos(vids)
      setQuizzes(qs)
    } catch { /* handle err */ }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  // ── Modal Handling ─────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null)
    if (activeTab === "modules") setModuleForm({ title: "", description: "", icon: "article", color: "primary", order: modules.length, published: false })
    if (activeTab === "articles") setArticleForm({ module_id: modules[0]?._id || "", title: "", summary: "", content_markdown: "", badge: "", image_url: "", video_id: "", order: articles.length, published: false })
    if (activeTab === "videos") setVideoForm({ module_id: modules[0]?._id || "", title: "", description: "", source_type: "youtube", source_url: "", thumbnail_url: "", duration: "", order: videos.length, published: false })
    if (activeTab === "quizzes") setQuizForm({ module_id: modules[0]?._id || "", title: "", description: "", questions: [{ text: "", options: ["", ""], correct_index: 0, explanation: "" }], published: false })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditingId(item._id)
    if (activeTab === "modules") setModuleForm({ ...item })
    if (activeTab === "articles") setArticleForm({ ...item, module_id: typeof item.module_id === 'object' ? item.module_id._id : item.module_id })
    if (activeTab === "videos") setVideoForm({ ...item, module_id: typeof item.module_id === 'object' ? item.module_id._id : item.module_id })
    if (activeTab === "quizzes") setQuizForm({ ...item })
    setShowModal(true)
  }

  // ── Save Handlers ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      if (activeTab === "modules") {
        if (!moduleForm.title || !moduleForm.description) return alert("Title and description required")
        if (editingId) {
          const res = await updateModule(editingId, moduleForm)
          setModules(p => p.map(x => x._id === editingId ? res : x))
        } else {
          const res = await createModule(moduleForm)
          setModules(p => [...p, res])
        }
      } else if (activeTab === "articles") {
        if (!articleForm.title || !articleForm.content_markdown || !articleForm.module_id) return alert("Missing required fields")
        if (editingId) {
          const res = await updateArticle(editingId, articleForm)
          setArticles(p => p.map(x => x._id === editingId ? res : x))
        } else {
          const res = await createArticle(articleForm)
          setArticles(p => [...p, res])
        }
      } else if (activeTab === "videos") {
        if (!videoForm.title || !videoForm.source_url || !videoForm.module_id) return alert("Missing required fields")
        if (editingId) {
          const res = await updateVideo(editingId, videoForm)
          setVideos(p => p.map(x => x._id === editingId ? res : x))
        } else {
          const res = await createVideo(videoForm)
          setVideos(p => [...p, res])
        }
      } else if (activeTab === "quizzes") {
        if (!quizForm.title || !quizForm.questions?.length) return alert("Missing title or questions")
        if (editingId) {
          const res = await updateQuiz(editingId, quizForm)
          setQuizzes(p => p.map(x => x._id === editingId ? res : x))
        } else {
          const res = await createQuiz(quizForm)
          setQuizzes(p => [...p, res])
        }
      }
      setShowModal(false)
    } catch (err: any) {
      alert("Failed to save: " + (err.response?.data?.error?.message || err.message))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      if (activeTab === "modules") { await deleteModule(id); setModules(p => p.filter(x => x._id !== id)) }
      if (activeTab === "articles") { await deleteArticle(id); setArticles(p => p.filter(x => x._id !== id)) }
      if (activeTab === "videos") { await deleteVideo(id); setVideos(p => p.filter(x => x._id !== id)) }
      if (activeTab === "quizzes") { await deleteQuiz(id); setQuizzes(p => p.filter(x => x._id !== id)) }
    } catch { alert("Delete failed") }
  }

  // ── Render Helpers ─────────────────────────────────────────────────────────

  const renderModuleForm = () => (
    <div className="space-y-4">
      <div><label className="text-sm font-semibold">Title</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} /></div>
      <div><label className="text-sm font-semibold">Description</label><textarea className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} rows={3} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold">Icon (Material Symbol)</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={moduleForm.icon} onChange={e => setModuleForm({...moduleForm, icon: e.target.value})} /></div>
        <div>
          <label className="text-sm font-semibold">Color</label>
          <select className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={moduleForm.color} onChange={e => setModuleForm({...moduleForm, color: e.target.value as any})}>
            <option value="primary">Primary</option><option value="secondary">Secondary</option><option value="tertiary">Tertiary</option>
          </select>
        </div>
      </div>
      <div><label className="text-sm font-semibold">Order</label><input type="number" className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={moduleForm.order} onChange={e => setModuleForm({...moduleForm, order: Number(e.target.value)})} /></div>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={moduleForm.published} onChange={e => setModuleForm({...moduleForm, published: e.target.checked})} className="h-4 w-4" /> Published</label>
    </div>
  )

  const renderArticleForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold">Module</label>
        <select className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.module_id as string} onChange={e => setArticleForm({...articleForm, module_id: e.target.value})}>
          <option value="" disabled>Select a module</option>
          {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
        </select>
      </div>
      <div><label className="text-sm font-semibold">Title</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} /></div>
      <div><label className="text-sm font-semibold">Summary</label><textarea className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.summary} onChange={e => setArticleForm({...articleForm, summary: e.target.value})} rows={2} /></div>
      <div><label className="text-sm font-semibold">Content Markdown</label><textarea className="w-full font-mono text-sm rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.content_markdown} onChange={e => setArticleForm({...articleForm, content_markdown: e.target.value})} rows={8} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold">Badge</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.badge} onChange={e => setArticleForm({...articleForm, badge: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Image URL</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.image_url} onChange={e => setArticleForm({...articleForm, image_url: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Video ID (optional)</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.video_id} onChange={e => setArticleForm({...articleForm, video_id: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Order</label><input type="number" className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={articleForm.order} onChange={e => setArticleForm({...articleForm, order: Number(e.target.value)})} /></div>
      </div>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={articleForm.published} onChange={e => setArticleForm({...articleForm, published: e.target.checked})} className="h-4 w-4" /> Published</label>
    </div>
  )

  const renderVideoForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold">Module</label>
        <select className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.module_id as string} onChange={e => setVideoForm({...videoForm, module_id: e.target.value})}>
          <option value="" disabled>Select a module</option>
          {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
        </select>
      </div>
      <div><label className="text-sm font-semibold">Title</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} /></div>
      <div><label className="text-sm font-semibold">Description</label><textarea className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.description} onChange={e => setVideoForm({...videoForm, description: e.target.value})} rows={3} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">Source Type</label>
          <select className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.source_type} onChange={e => setVideoForm({...videoForm, source_type: e.target.value as any})}>
            <option value="youtube">YouTube</option><option value="local">Local</option>
          </select>
        </div>
        <div><label className="text-sm font-semibold">Source URL</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.source_url} onChange={e => setVideoForm({...videoForm, source_url: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Thumbnail URL</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.thumbnail_url} onChange={e => setVideoForm({...videoForm, thumbnail_url: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Duration (e.g. 5:30)</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.duration} onChange={e => setVideoForm({...videoForm, duration: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Order</label><input type="number" className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={videoForm.order} onChange={e => setVideoForm({...videoForm, order: Number(e.target.value)})} /></div>
      </div>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={videoForm.published} onChange={e => setVideoForm({...videoForm, published: e.target.checked})} className="h-4 w-4" /> Published</label>
    </div>
  )

  const renderQuizForm = () => {
    const addQuestion = () => {
      setQuizForm({ ...quizForm, questions: [...(quizForm.questions || []), { text: "", options: ["", ""], correct_index: 0 }] })
    }
    const updateQuestion = (idx: number, key: string, value: any) => {
      const qs = [...(quizForm.questions || [])]
      ;(qs[idx] as any)[key] = value
      setQuizForm({ ...quizForm, questions: qs })
    }
    const removeQuestion = (idx: number) => {
      const qs = [...(quizForm.questions || [])]
      qs.splice(idx, 1)
      setQuizForm({ ...quizForm, questions: qs })
    }
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold">Module (Optional)</label>
          <select className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={quizForm.module_id} onChange={e => setQuizForm({...quizForm, module_id: e.target.value})}>
            <option value="">No Module</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
          </select>
        </div>
        <div><label className="text-sm font-semibold">Title</label><input className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} /></div>
        <div><label className="text-sm font-semibold">Description</label><textarea className="w-full rounded-lg border p-2 text-on-surface bg-surface-container-low" value={quizForm.description} onChange={e => setQuizForm({...quizForm, description: e.target.value})} rows={2} /></div>
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={quizForm.published} onChange={e => setQuizForm({...quizForm, published: e.target.checked})} className="h-4 w-4" /> Published</label>
        
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Questions ({quizForm.questions?.length || 0})</h4>
            <button onClick={addQuestion} type="button" className="text-sm bg-primary-container text-primary px-3 py-1 rounded-full">+ Add Question</button>
          </div>
          <div className="space-y-6">
            {quizForm.questions?.map((q, i) => (
              <div key={i} className="p-4 border rounded-xl bg-surface-container-lowest">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm mb-2 block">Question {i + 1}</span>
                  <button type="button" onClick={() => removeQuestion(i)} className="text-error text-sm"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
                <input className="w-full mb-3 rounded-lg border p-2 text-on-surface bg-surface-container-low" placeholder="Question text" value={q.text} onChange={e => updateQuestion(i, "text", e.target.value)} />
                <div className="space-y-2 mb-3 ml-4">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input type="radio" name={`correct_${i}`} checked={q.correct_index === optIdx} onChange={() => updateQuestion(i, "correct_index", optIdx)} className="h-4 w-4" title="Mark as correct answer" />
                      <input className="flex-1 rounded-lg border p-1.5 text-sm text-on-surface bg-surface-container-low" placeholder={`Option ${optIdx + 1}`} value={opt} onChange={e => {
                        const newOpts = [...q.options]; newOpts[optIdx] = e.target.value; updateQuestion(i, "options", newOpts)
                      }} />
                      <button type="button" onClick={() => {
                        const newOpts = [...q.options]; newOpts.splice(optIdx, 1); updateQuestion(i, "options", newOpts)
                      }} className="text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">close</span></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => {
                    const newOpts = [...q.options, ""]; updateQuestion(i, "options", newOpts)
                  }} className="text-xs text-primary">+ Add Option</button>
                </div>
                <div><input className="w-full text-sm rounded-lg border p-2 text-on-surface bg-surface-container-low" placeholder="Explanation (optional)" value={q.explanation || ""} onChange={e => updateQuestion(i, "explanation", e.target.value)} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Main Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar active="Content CMS" />

      <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-72">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-background">Content CMS</h1>
            <p className="mt-1 text-on-surface-variant">Manage educational modules, articles, videos, and quizzes.</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all active:scale-95 hover:bg-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-[20px]">add</span> New {activeTab.slice(0,-1)}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-outline-variant/30 pb-2">
          {(["modules", "articles", "videos", "quizzes"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`rounded-full px-5 py-2 font-semibold capitalize transition-colors ${activeTab === t ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-variant"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content List */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTab === "modules" && modules.map(m => (
              <div key={m._id} className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">{m.icon}</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.published ? 'bg-primary-container text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{m.published ? "Published" : "Draft"}</span></div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(m)} className="p-1 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(m._id)} className="p-1 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                </div>
                <h4 className="font-bold mb-1">{m.title}</h4>
                <p className="text-sm text-on-surface-variant line-clamp-2">{m.description}</p>
              </div>
            ))}

            {activeTab === "articles" && articles.map(a => (
              <div key={a._id} className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.published ? 'bg-primary-container text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{a.published ? "Published" : "Draft"}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="p-1 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(a._id)} className="p-1 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                </div>
                <h4 className="font-bold mb-1">{a.title}</h4>
                <p className="text-sm text-on-surface-variant line-clamp-2">{a.summary}</p>
                <div className="mt-auto pt-3 text-xs text-primary font-semibold">Module: {(a.module_id as any)?.title || a.module_id}</div>
              </div>
            ))}

            {activeTab === "videos" && videos.map(v => (
              <div key={v._id} className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.published ? 'bg-primary-container text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{v.published ? "Published" : "Draft"}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(v)} className="p-1 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(v._id)} className="p-1 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                </div>
                {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                <h4 className="font-bold mb-1">{v.title}</h4>
                <div className="mt-auto pt-3 flex justify-between text-xs text-on-surface-variant">
                  <span>{v.duration}</span>
                  <span className="text-primary font-semibold">{(v.module_id as any)?.title || v.module_id}</span>
                </div>
              </div>
            ))}

            {activeTab === "quizzes" && quizzes.map(q => (
              <div key={q._id} className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.published ? 'bg-primary-container text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{q.published ? "Published" : "Draft"}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(q)} className="p-1 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(q._id)} className="p-1 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                </div>
                <h4 className="font-bold mb-1">{q.title}</h4>
                <p className="text-sm text-on-surface-variant mb-3">{q.questions.length} questions</p>
                <div className="mt-auto pt-3 text-xs text-primary font-semibold">Module: {modules.find(m => m._id === q.module_id)?.title || q.module_id || "None"}</div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto py-10">
            <div className="my-auto w-full max-w-3xl rounded-2xl bg-surface-container-lowest p-6 shadow-xl max-h-full overflow-y-auto">
              <h3 className="mb-6 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
                {editingId ? `Edit ${activeTab.slice(0,-1)}` : `Create ${activeTab.slice(0,-1)}`}
              </h3>
              
              {activeTab === "modules" && renderModuleForm()}
              {activeTab === "articles" && renderArticleForm()}
              {activeTab === "videos" && renderVideoForm()}
              {activeTab === "quizzes" && renderQuizForm()}

              <div className="mt-8 flex gap-3 pt-4 border-t">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-outline-variant py-3 font-semibold text-on-surface hover:bg-surface-variant">Cancel</button>
                <button onClick={handleSave} className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary hover:bg-on-primary-fixed-variant">
                  {editingId ? "Save Changes" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
