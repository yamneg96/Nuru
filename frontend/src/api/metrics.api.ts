import api from "./client"
import type { PublicMetrics } from "../../../shared/types"

export async function getPublicMetrics(): Promise<PublicMetrics> {
  const { data } = await api.get<PublicMetrics>("/metrics/public");
  // console.log(data)
  return data.data
}
