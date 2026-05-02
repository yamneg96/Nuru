import api from "./client"
import type { PublicMetrics } from "@/types"

export async function getPublicMetrics(): Promise<PublicMetrics> {
  const { data } = await api.get<PublicMetrics>("/metrics/public")
  return data
}
