import api from "./client"
import type { Module, Article, Video } from "@/types"

// ── Modules ──────────────────────────────────────────────────

export async function getModules(): Promise<Module[]> {
  const { data } = await api.get<Module[]>("/content/modules")
  return data
}

export async function getModule(
  slug: string
): Promise<Module & { articles: Article[]; videos: Video[] }> {
  const { data } = await api.get<
    Module & { articles: Article[]; videos: Video[] }
  >(`/content/modules/${slug}`)
  return data
}

// ── Articles ─────────────────────────────────────────────────

export async function getArticles(moduleId?: string): Promise<Article[]> {
  const { data } = await api.get<Article[]>("/content/articles", {
    params: moduleId ? { module_id: moduleId } : undefined,
  })
  return data
}

export async function getArticle(slug: string): Promise<Article> {
  const { data } = await api.get<Article>(`/content/articles/${slug}`)
  return data
}

// ── Videos ───────────────────────────────────────────────────

export async function getVideos(moduleId?: string): Promise<Video[]> {
  const { data } = await api.get<Video[]>("/content/videos", {
    params: moduleId ? { module_id: moduleId } : undefined,
  })
  return data
}

export async function getVideo(id: string): Promise<Video> {
  const { data } = await api.get<Video>(`/content/videos/${id}`)
  return data
}
